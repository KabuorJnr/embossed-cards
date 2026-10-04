import './fonts';
import './styles/base.css';
import './styles/card.css';
import './styles/app.css';
import { designById, designs } from './card/designs';
import type { Design, HandId } from './card/types';
import { CardViewer, type CardContent } from './card/viewer';
import { cardLink, clean, encodeCard, LIMITS, type CardState } from './share/encode';
import { cardPicture, coverImage } from './share/render';
import { canNativeShare, copyText, nativeShare, saveImage, shareText, whatsappUrl } from './share/share';
import { consentBanner, loadDraft, saveDraft } from './ui/consent';
import { toast } from './ui/toast';

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ids = designs.map((d) => d.id);

const studio = $('#studio');
const stage = $('#stage');
const hint = $('#hint');
const dock = $('.dock');
const designsEl = $('#designs');
const openBtn = $<HTMLButtonElement>('#toggle-open');
const playBtn = $<HTMLButtonElement>('#toggle-play');
const writeBtn = $<HTMLButtonElement>('#compose-open');
const panel = $('#panel');
const form = $<HTMLFormElement>('#compose');
const sendView = $('#send');
const coverField = $('#cover-field');
const coverLabel = $('#cover-label');
const fCover = $<HTMLInputElement>('#f-cover');
const fTo = $<HTMLInputElement>('#f-to');
const fMsg = $<HTMLTextAreaElement>('#f-msg');
const fFrom = $<HTMLInputElement>('#f-from');
const msgCount = $('#msg-count');
const msgError = $('#msg-error');
const agree = $<HTMLInputElement>('#agree');
const actions = $('#send-actions');
const waLink = $<HTMLAnchorElement>('#send-wa');
const shareBtn = $<HTMLButtonElement>('#send-share');

/* ---------- State ---------- */

const params = new URLSearchParams(location.search);
const draft = loadDraft();
let state: CardState = clean(
  {
    d: params.get('d') ?? draft?.d ?? designs[0].id,
    c: draft?.c,
    m: draft?.m,
    h: draft?.h,
    t: params.get('to') ?? draft?.t ?? '',
    f: draft?.f ?? '',
  },
  ids,
);
// Words the person has not changed follow the design they pick.
let ownMessage = Boolean(draft?.m);
let ownCover = Boolean(draft?.c);
let ownHand = Boolean(draft?.h);
let design: Design = designById(state.d);
if (!ownMessage) state.m = design.defaultMessage;
if (!ownCover) state.c = design.coverText?.default ?? '';
if (!draft?.h) state.h = design.hand;

const content = (): CardContent => ({
  cover: state.c,
  message: state.m,
  hand: state.h,
  to: state.t,
  from: state.f,
});

/* ---------- Card ---------- */

const viewer = new CardViewer(stage, {
  toggleOnClick: true,
  idleSway: true,
  celebrate: true,
  onToggle: (open) => {
    stopShowcase();
    syncOpen(open);
  },
});

function syncOpen(open: boolean) {
  openBtn.setAttribute('aria-pressed', String(open));
  openBtn.setAttribute('aria-label', open ? 'Close the card' : 'Open the card');
  hint.textContent = open ? 'Tap the card to close it' : 'Tap the card to open it';
}

let motionAsked = false;
stage.addEventListener(
  'pointerdown',
  () => {
    if (motionAsked) return;
    motionAsked = true;
    void CardViewer.requestMotion();
  },
  { passive: true },
);

/* ---------- Design picker ---------- */

const swatches = designs.map((d, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'swatch';
  b.setAttribute('role', 'radio');
  b.setAttribute('aria-label', `${d.name}: ${d.blurb}`);
  b.dataset.id = d.id;
  b.tabIndex = d.id === design.id ? 0 : -1;
  b.innerHTML = `<img alt="" width="44" height="44" decoding="async" /><span class="progress" aria-hidden="true"></span>`;
  b.addEventListener('click', () => {
    stopShowcase();
    choose(d.id);
  });
  b.addEventListener('keydown', (e) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = designs[(i + step + designs.length) % designs.length];
    stopShowcase();
    choose(next.id);
    swatches.find((s) => s.dataset.id === next.id)?.focus();
  });
  designsEl.append(b);
  return b;
});

designs.forEach(async (d, i) => {
  const img = swatches[i].querySelector('img')!;
  img.src = await coverImage(d, d.coverText?.default ?? '');
});

function choose(id: string, keepOpen = viewer.open) {
  design = designById(id);
  state.d = design.id;
  if (!ownMessage) state.m = design.defaultMessage;
  if (!ownCover) state.c = design.coverText?.default ?? '';
  if (!ownHand) state.h = design.hand;
  viewer.render(design, content());
  if (keepOpen) viewer.setOpen(true);
  for (const s of swatches) {
    const on = s.dataset.id === id;
    s.setAttribute('aria-checked', String(on));
    s.tabIndex = on ? 0 : -1;
    // Keep the chosen design in view in the scrolling dock, without moving the page.
    if (on) designsEl.scrollTo({ left: s.offsetLeft - designsEl.offsetLeft - (designsEl.clientWidth - s.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
  }
  fillForm();
  persist();
}

/* ---------- Showcase: cycles designs like a shop window until someone takes over ---------- */

let playing = !reduced && !draft;
let showTimer = 0;

function showcaseStep(step: number) {
  clearTimeout(showTimer);
  if (!playing) return;
  // Each design: cover, then open, then on to the next.
  if (step % 2 === 0) {
    showTimer = window.setTimeout(() => {
      viewer.setOpen(true);
      syncOpen(true);
      showcaseStep(step + 1);
    }, 4200);
  } else {
    showTimer = window.setTimeout(() => {
      viewer.setOpen(false);
      syncOpen(false);
      showTimer = window.setTimeout(() => {
        const next = designs[(designs.findIndex((d) => d.id === design.id) + 1) % designs.length];
        choose(next.id, false);
        showcaseStep(step + 1);
      }, 1200);
    }, 4200);
  }
}

function stopShowcase() {
  if (!playing) return;
  playing = false;
  clearTimeout(showTimer);
  dock.classList.remove('is-playing');
  playBtn.setAttribute('aria-pressed', 'true');
  playBtn.setAttribute('aria-label', 'Play the showcase');
}

function startShowcase() {
  playing = true;
  dock.classList.add('is-playing');
  playBtn.setAttribute('aria-pressed', 'false');
  playBtn.setAttribute('aria-label', 'Pause the showcase');
  showcaseStep(viewer.open ? 1 : 0);
}

playBtn.addEventListener('click', () => (playing ? stopShowcase() : startShowcase()));
openBtn.addEventListener('click', () => {
  stopShowcase();
  viewer.setOpen(!viewer.open);
  syncOpen(viewer.open);
});
stage.addEventListener('pointerdown', () => stopShowcase(), { passive: true });

/* ---------- Writing ---------- */

function fillForm() {
  if (design.coverText) {
    coverField.hidden = false;
    coverLabel.textContent = design.coverText.label;
    fCover.maxLength = Math.min(design.coverText.max, LIMITS.c);
    fCover.value = state.c;
  } else coverField.hidden = true;
  fTo.value = state.t;
  fMsg.value = state.m;
  fFrom.value = state.f;
  form.querySelectorAll<HTMLInputElement>('input[name="hand"]').forEach((r) => (r.checked = r.value === state.h));
  countChars();
}

function countChars() {
  msgCount.textContent = `${fMsg.value.length} of ${LIMITS.m}`;
}

let saveTimer = 0;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => saveDraft(state), 400);
}

let coverTimer = 0;
form.addEventListener('input', (e) => {
  const t = e.target as HTMLInputElement | HTMLTextAreaElement;
  if (t === fCover) {
    state.c = fCover.value;
    ownCover = true;
    clearTimeout(coverTimer);
    coverTimer = window.setTimeout(() => viewer.setCover(state.c), 220);
  } else {
    if (t === fMsg) {
      state.m = fMsg.value;
      ownMessage = true;
      countChars();
      if (state.m.trim()) setError('');
    }
    if (t === fTo) state.t = fTo.value;
    if (t === fFrom) state.f = fFrom.value;
    if (t.name === 'hand') {
      state.h = t.value as HandId;
      ownHand = true;
    }
    viewer.setWords(content());
  }
  persist();
});

function setError(msg: string) {
  msgError.textContent = msg;
  if (msg) fMsg.setAttribute('aria-invalid', 'true');
  else fMsg.removeAttribute('aria-invalid');
}

let lastFocus: HTMLElement | null = null;

function openPanel() {
  stopShowcase();
  lastFocus = document.activeElement as HTMLElement;
  fillForm();
  panel.hidden = false;
  form.hidden = false;
  sendView.hidden = true;
  studio.classList.add('is-composing');
  document.body.classList.add('is-composing');
  viewer.setOpen(true);
  syncOpen(true);
  // On phones the keyboard would cover the card, so let them choose a field.
  if (window.matchMedia('(pointer: fine)').matches) fMsg.focus({ preventScroll: true });
  else $('#compose-title').focus?.();
}

function closePanel() {
  panel.hidden = true;
  studio.classList.remove('is-composing');
  document.body.classList.remove('is-composing');
  (lastFocus ?? writeBtn).focus({ preventScroll: true });
}

writeBtn.addEventListener('click', openPanel);
panel.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('[data-close]')) closePanel();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !panel.hidden) closePanel();
});

/* ---------- Sending ---------- */

let link = '';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!state.m.trim()) {
    setError('Write a message before you send the card.');
    fMsg.focus();
    return;
  }
  link = cardLink(await encodeCard(state));
  waLink.href = whatsappUrl(shareText(link, state.t));
  $('#send-lede').textContent = state.t.trim()
    ? `${state.t.trim()} gets a sealed envelope. One tap on the wax seal opens it.`
    : 'It goes as a sealed envelope. One tap on the wax seal opens it.';
  shareBtn.hidden = !canNativeShare();
  form.hidden = true;
  sendView.hidden = false;
  $('#send-title').focus();
});

$('#send-back').addEventListener('click', () => {
  sendView.hidden = true;
  form.hidden = false;
  fMsg.focus({ preventScroll: true });
});

function syncAgree() {
  actions.setAttribute('aria-disabled', String(!agree.checked));
  actions.querySelectorAll<HTMLElement>('.btn').forEach((b) => {
    if (agree.checked) b.removeAttribute('tabindex');
    else b.tabIndex = -1;
  });
}
agree.addEventListener('change', syncAgree);
syncAgree();

waLink.addEventListener('click', (e) => {
  if (!agree.checked) e.preventDefault();
});
shareBtn.addEventListener('click', async () => {
  if (!agree.checked) return;
  const r = await nativeShare(link, shareText(link, state.t));
  if (r === 'failed') toast('Sharing is not available here. Copy the link instead.');
});
$('#send-copy').addEventListener('click', async () => {
  if (!agree.checked) return;
  toast((await copyText(link)) ? 'Link copied' : 'Could not copy. Press and hold the link to copy it.');
});
$('#send-image').addEventListener('click', async (e) => {
  if (!agree.checked) return;
  const btn = e.currentTarget as HTMLButtonElement;
  btn.disabled = true;
  btn.textContent = 'Pressing your card';
  try {
    await saveImage(await cardPicture(design, content()));
    toast('Image saved');
  } catch {
    toast('Could not make the image. Try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save as image';
  }
});

/* ---------- Start ---------- */

choose(design.id, false);
syncOpen(false);
if (playing) startShowcase();
else {
  dock.classList.remove('is-playing');
  playBtn.setAttribute('aria-pressed', 'true');
  playBtn.setAttribute('aria-label', 'Play the showcase');
}
consentBanner();
document.addEventListener('storagechoice', () => saveDraft(state));
