import './fonts';
import './styles/base.css';
import './styles/card.css';
import './styles/open.css';
import { designById, designs } from './card/designs';
import { escapeXml } from './card/shapes';
import { CardViewer, type CardContent } from './card/viewer';
import { decodeCard } from './share/encode';
import { cardPicture, coverImage } from './share/render';
import { saveImage } from './share/share';
import { burst, shower } from './ui/sparkles';
import { toast } from './ui/toast';

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
const GOLD_DUST = ['#f3d98d', '#ffe9b0', '#ffffff', '#d9b25a'];

/** Centre of an element on screen. */
const centre = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, r };
};

const scene = $('#scene');
const stage = $('#stage');
const wrap = $('#env-wrap');
const hint = $('#hint');
const after = $('#after');

/** "With love, Rooney" → "Rooney". */
function senderName(signOff: string): string {
  const s = signOff.trim();
  if (!s) return '';
  const tail = s.includes(',') ? s.slice(s.lastIndexOf(',') + 1) : s;
  return tail.trim().replace(/[.!]+$/, '');
}

function sealSvg(initial: string, id: string) {
  return `<svg viewBox="0 0 80 80" aria-hidden="true">
    <defs>
      <radialGradient id="${id}g" cx="0.38" cy="0.32" r="0.75">
        <stop offset="0" stop-color="var(--seal-hi)"/><stop offset="0.55" stop-color="var(--seal)"/><stop offset="1" stop-color="var(--seal-lo)"/>
      </radialGradient>
      <filter id="${id}f" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="5" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5"/>
      </filter>
    </defs>
    <g filter="url(#${id}f)">
      <circle cx="40" cy="40" r="35" fill="url(#${id}g)"/>
      <circle cx="27" cy="69" r="7" fill="var(--seal-lo)"/>
      <circle cx="66" cy="58" r="6" fill="var(--seal)"/>
    </g>
    <circle cx="40" cy="40" r="24.5" fill="none" stroke="var(--seal-lo)" stroke-width="2.2" opacity="0.8"/>
    <circle cx="40" cy="40" r="23.2" fill="none" stroke="var(--seal-hi)" stroke-width="0.8" opacity="0.55"/>
    <text x="40.8" y="49.6" text-anchor="middle" font-family="'Bodoni Moda', serif" font-size="26" font-style="italic" fill="var(--seal-lo)">${escapeXml(initial)}</text>
    <text x="40" y="48.8" text-anchor="middle" font-family="'Bodoni Moda', serif" font-size="26" font-style="italic" fill="var(--seal-hi)" opacity="0.55">${escapeXml(initial)}</text>
    <ellipse cx="30" cy="25" rx="10" ry="5" fill="#fff" opacity="0.22" transform="rotate(-30 30 25)"/>
  </svg>`;
}

/** Shift a hex colour lighter (positive) or darker (negative). */
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => ch(v).toString(16).padStart(2, '0')).join('')}`;
}

async function main() {
  const code = location.hash.slice(1);
  const state = code ? await decodeCard(code, designs.map((d) => d.id)) : null;
  if (!state) {
    $('#broken').hidden = false;
    document.body.classList.remove('opening');
    return;
  }

  const design = designById(state.d);
  const content: CardContent = { cover: state.c, message: state.m, hand: state.h, to: state.t, from: state.f };
  const name = senderName(state.f);
  $('#scene-title').textContent = state.t ? `A card for ${state.t}` : 'A card for you';
  document.title = state.t ? `A card for ${state.t}` : 'A card for you';
  const reply = new URLSearchParams({ d: design.id });
  if (name) reply.set('to', name);
  $<HTMLAnchorElement>('#reply').href = `./?${reply}`;

  // The real card waits, invisible, behind the envelope.
  const viewer = new CardViewer(stage, {
    toggleOnClick: true,
    idleSway: true,
    onToggle: (open) => {
      hint.textContent = open ? '' : 'Tap the card to open it';
      if (open && after.hidden) {
        after.hidden = false;
        requestAnimationFrame(() => after.classList.add('is-on'));
        celebrate();
      }
    },
  });
  viewer.render(design, content);

  const env = design.envelope;
  wrap.style.setProperty('--body', env.body);
  wrap.style.setProperty('--body-lo', shade(env.body, -0.05));
  wrap.style.setProperty('--body-lo2', shade(env.body, -0.09));
  wrap.style.setProperty('--liner', env.liner);
  wrap.style.setProperty('--seal', env.seal);
  wrap.style.setProperty('--seal-hi', shade(env.seal, 0.16));
  wrap.style.setProperty('--seal-lo', shade(env.seal, -0.16));
  wrap.style.setProperty('--ink', env.ink);
  const initial = (name[0] ?? 'E').toUpperCase();
  const to = state.t.trim();
  wrap.innerHTML = `
    <div class="env-ground" aria-hidden="true"></div>
    <div class="env-float">
    <div class="envelope" id="envelope">
      <div class="env-halo" aria-hidden="true"></div>
      <div class="env-back"></div>
      <div class="env-slot"><div class="env-card"><img alt="" id="env-img" /></div></div>
      <svg class="env-pocket" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="0,0 54,57 0,100" fill="var(--body-lo)"/>
        <polygon points="100,0 46,57 100,100" fill="var(--body-lo2)"/>
        <polygon points="0,100 50,50 100,100" fill="var(--body)"/>
        <polyline points="0,100 50,50 100,100" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="0.4" vector-effect="non-scaling-stroke"/>
      </svg>
      <p class="env-to hand-${state.h}">${escapeXml(to ? `For ${to}` : 'For you')}</p>
      <div class="env-flap" id="flap"><div class="flap-front"></div><div class="flap-back"></div></div>
      <button type="button" class="env-seal" id="seal" aria-label="Break the wax seal and open the envelope">
        <span class="seal-ring" aria-hidden="true"></span>
        <span class="seal-glow" aria-hidden="true"></span>
        <span class="seal-half seal-l">${sealSvg(initial, 'sl')}</span>
        <span class="seal-half seal-r">${sealSvg(initial, 'sr')}</span>
      </button>
    </div>
    </div>`;
  wrap.hidden = false;
  const envelope = $('#envelope');
  const img = $<HTMLImageElement>('#env-img');
  img.src = await coverImage(design, content.cover);

  const { w, h, bleed: b } = design;
  let cw = 0;
  let ch = 0;
  function size() {
    const box = scene.getBoundingClientRect();
    const availH = box.height - 150;
    const availW = box.width;
    ch = Math.min((availH * 0.94) / 1.86, ((availW * 0.78) / w) * h, 520);
    cw = (ch / h) * w;
    const ew = cw * 1.08;
    const eh = ch * 1.06;
    wrap.style.setProperty('--ew', `${ew}px`);
    wrap.style.setProperty('--eh', `${eh}px`);
    wrap.style.setProperty('--cw', `${cw}px`);
    wrap.style.setProperty('--ch', `${ch}px`);
    wrap.style.setProperty('--rise', `${ch * 0.84}px`);
    // Image includes the die cut bleed around the card.
    img.style.width = `${(cw * (w + 2 * b)) / w}px`;
    img.style.left = `${(-cw * b) / w}px`;
    img.style.top = `${(-ch * b) / h}px`;
  }
  size();
  const ro = new ResizeObserver(size);
  ro.observe(scene);

  hint.textContent = 'Tap the wax seal to open your envelope';
  document.body.classList.add('is-ready');

  const seal = $<HTMLButtonElement>('#seal');
  const confetti = design.confetti ?? [env.liner, env.seal, '#f3d98d', '#ffffff'];

  /** Gold dust drifting up out of the envelope while the card slides free. */
  const trickle = (ms: number) => {
    const until = performance.now() + ms;
    const tick = () => {
      const { x, r } = centre(envelope);
      burst({ x, y: r.top + 6, width: r.width * 0.8, count: 3, colors: GOLD_DUST, angle: -Math.PI / 2, spread: 0.5, speed: [0.5, 1.8], size: [1, 2.6], life: [900, 1500] });
      if (performance.now() < until) setTimeout(tick, 110);
    };
    tick();
  };

  const openIt = async () => {
    seal.disabled = true;
    void CardViewer.requestMotion();
    hint.textContent = '';
    wrap.classList.add('is-opening');

    // A thumb presses the wax, then it cracks.
    envelope.classList.add('is-pressing');
    await wait(170);
    envelope.classList.remove('is-pressing');
    envelope.classList.add('is-breaking');
    const s = centre(seal);
    burst({ x: s.x, y: s.y, count: 16, colors: [env.seal, shade(env.seal, -0.16), shade(env.seal, 0.12)], kinds: ['crumb'], angle: -Math.PI / 2, spread: 1.4, speed: [2.5, 6], size: [1.6, 3.6], life: [900, 1300] });
    burst({ x: s.x, y: s.y, count: 22, colors: GOLD_DUST, spread: Math.PI, speed: [1, 4.5], life: [700, 1300] });
    await wait(420);

    // The flap lifts and light spills out of the envelope.
    envelope.classList.add('is-flap-open');
    {
      const { x, r } = centre(envelope);
      burst({ x, y: r.top + 4, width: r.width * 0.7, count: 20, colors: GOLD_DUST, kinds: ['glint', 'dust'], angle: -Math.PI / 2, spread: 0.9, speed: [1, 3.4], life: [1000, 1800] });
    }
    await wait(380);
    envelope.classList.add('is-flap-behind');
    await wait(420);
    envelope.classList.add('is-rising');
    trickle(900);
    await wait(1150);

    // Hand over from the flat picture to the live, tilting card.
    ro.disconnect();
    const book = stage.querySelector<HTMLElement>('.cv-book')!;
    const target = book.getBoundingClientRect();
    const cardEl = envelope.querySelector<HTMLElement>('.env-card')!;
    const from = cardEl.getBoundingClientRect();
    envelope.classList.add('is-leaving');
    const k = target.width / from.width;
    cardEl.style.transformOrigin = '0 0';
    cardEl.style.transition = reduced ? 'none' : 'transform 0.85s cubic-bezier(0.22, 0.7, 0.12, 1)';
    const base = getComputedStyle(cardEl).transform;
    const m = new DOMMatrix(base === 'none' ? undefined : base);
    const dx = target.left - from.left;
    const dy = target.top - from.top;
    cardEl.style.transform = `translate(${m.e + dx}px, ${m.f + dy}px) scale(${k})`;
    await wait(860);
    document.body.classList.add('is-revealed');
    stage.inert = false;
    const c = centre(book);
    burst({ x: c.x, y: c.y, width: c.r.width * 1.1, height: c.r.height * 1.05, count: 34, colors: GOLD_DUST, kinds: ['glint', 'dust'], spread: Math.PI, speed: [0.2, 1.2], life: [900, 1800], gravity: -0.01 });
    await wait(260);
    wrap.hidden = true;
    hint.textContent = 'Tap the card to open it';
    (stage.querySelector('.cv') as HTMLElement | null)?.focus({ preventScroll: true });
    invite();
  };

  /** Lift the cover's edge now and then until they open it. */
  let peeks = 0;
  const invite = () => {
    setTimeout(function nudge() {
      if (viewer.open || peeks >= 3) return;
      viewer.peek();
      peeks++;
      setTimeout(nudge, 4600);
    }, 1500);
  };

  let celebrated = false;
  function celebrate() {
    if (celebrated) return;
    celebrated = true;
    setTimeout(() => {
      const r = viewer.spine();
      burst({ x: r.left, y: r.top + r.height / 2, height: r.height * 0.9, count: 30, colors: GOLD_DUST, kinds: ['glint', 'dust'], spread: Math.PI, speed: [0.8, 3.5], life: [900, 1700] });
      shower(confetti);
    }, 650);
  }

  seal.addEventListener('click', openIt);
  // The whole envelope opens on tap too; the seal is just the obvious place.
  envelope.addEventListener('click', (e) => {
    if (!seal.disabled && e.target !== seal && !seal.contains(e.target as Node)) void openIt();
  });

  $('#save').addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    btn.disabled = true;
    try {
      await saveImage(await cardPicture(design, content));
      toast('Image saved');
    } catch {
      toast('Could not make the image. Try again.');
    } finally {
      btn.disabled = false;
    }
  });
}

void main();
