import { escapeXml } from './shapes';
import { sparkleTexture } from './sparkle';
import type { Design, HandId, Layer } from './types';

export interface CardContent {
  cover: string;
  message: string;
  hand: HandId;
  to: string;
  from: string;
}

export interface ViewerOptions {
  /** Tap or click toggles the card open. */
  toggleOnClick?: boolean;
  /** Gentle sway while nobody is touching the card. */
  idleSway?: boolean;
  /** Fraction of the stage the card may fill. */
  fill?: number;
  onToggle?: (open: boolean) => void;
}

const NS = 'http://www.w3.org/2000/svg';
let counter = 0;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Stop = [number, string, number];

/** A narrow band of light, as on a pressed foil. */
const PLAIN_SHEEN = (tone: string): Stop[] => [
  [0, tone, 0],
  [0.4, tone, 0],
  [0.48, tone, 0.85],
  [0.52, tone, 0.9],
  [0.6, tone, 0],
  [1, tone, 0],
];

/** Holographic foil splits the band of light into a rainbow that slides as the card tilts. */
const HOLO_SHEEN: Stop[] = [
  [0, '#ffffff', 0],
  [0.3, '#ff9fd8', 0],
  [0.37, '#ff9fd8', 0.75],
  [0.43, '#ffe58f', 0.85],
  [0.49, '#a6ffcf', 0.9],
  [0.55, '#8fd5ff', 0.85],
  [0.61, '#c9a2ff', 0.75],
  [0.68, '#c9a2ff', 0],
  [1, '#ffffff', 0],
];

interface Overlay {
  sheen?: SVGGradientElement;
  patterns: SVGPatternElement[];
}

/**
 * Renders a design as a layered 3D card that tilts with the pointer or the
 * phone's motion, catches light on foil and glitter, and opens like a book.
 */
export class CardViewer {
  readonly root: HTMLDivElement;
  private tilt: HTMLDivElement;
  private book: HTMLDivElement;
  private design!: Design;
  private content!: CardContent;
  private overlays: Overlay[] = [];
  private msgEl!: HTMLDivElement;
  private toEl!: HTMLDivElement;
  private fromEl!: HTMLDivElement;
  private insertEl!: HTMLDivElement;
  private isOpen = false;
  private raf = 0;
  private target = { rx: 0, ry: 0 };
  private cur = { rx: 0, ry: 0 };
  private lastInput = 0;
  private gyroBase: { b: number; g: number } | null = null;
  private resizeObs: ResizeObserver;
  private disposers: (() => void)[] = [];
  private turnTimer = 0;

  constructor(
    private host: HTMLElement,
    private opts: ViewerOptions = {},
  ) {
    this.root = document.createElement('div');
    this.root.className = 'cv';
    this.root.innerHTML = `
      <div class="cv-tilt">
        <div class="cv-book">
          <div class="cv-page cv-right"></div>
          <div class="cv-cover">
            <div class="cv-face cv-front"></div>
            <div class="cv-face cv-back"></div>
          </div>
        </div>
      </div>`;
    this.tilt = this.root.querySelector('.cv-tilt')!;
    this.book = this.root.querySelector('.cv-book')!;
    host.appendChild(this.root);

    if (opts.toggleOnClick) {
      this.root.tabIndex = 0;
      this.root.setAttribute('role', 'button');
      const toggle = () => this.setOpen(!this.isOpen, true);
      this.root.addEventListener('click', toggle);
      this.root.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    }

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = this.root.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      this.aim(Math.max(-1, Math.min(1, nx)), Math.max(-1, Math.min(1, ny)));
    };
    const onLeave = () => {
      this.target = { rx: 0, ry: 0 };
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const r = this.root.getBoundingClientRect();
      this.aim(((t.clientX - r.left) / r.width) * 2 - 1, ((t.clientY - r.top) / r.height) * 2 - 1);
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      if (!this.gyroBase) this.gyroBase = { b: e.beta, g: e.gamma };
      // Let the resting angle drift slowly toward however the phone is held.
      this.gyroBase.b += (e.beta - this.gyroBase.b) * 0.004;
      this.gyroBase.g += (e.gamma - this.gyroBase.g) * 0.004;
      const nx = Math.max(-1, Math.min(1, (e.gamma - this.gyroBase.g) / 22));
      const ny = Math.max(-1, Math.min(1, (e.beta - this.gyroBase.b) / 22));
      this.aim(nx, ny);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    this.root.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('deviceorientation', onOrient);
    this.disposers.push(
      () => window.removeEventListener('pointermove', onPointer),
      () => document.removeEventListener('pointerleave', onLeave),
      () => window.removeEventListener('deviceorientation', onOrient),
    );

    this.resizeObs = new ResizeObserver(() => this.fit());
    this.resizeObs.observe(host);
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  /** iOS asks before sharing motion data; call this from a tap. */
  static async requestMotion(): Promise<boolean> {
    const D = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (D && typeof D.requestPermission === 'function') {
      try {
        return (await D.requestPermission()) === 'granted';
      } catch {
        return false;
      }
    }
    return 'DeviceOrientationEvent' in window;
  }

  get open() {
    return this.isOpen;
  }

  render(design: Design, content: CardContent) {
    this.design = design;
    this.content = content;
    const uid = `c${++counter}`;
    const { w, h } = design;
    this.root.style.setProperty('--w', String(w));
    this.root.style.setProperty('--h', String(h));
    this.root.style.setProperty('--b', String(design.bleed));
    this.root.dataset.design = design.id;
    this.overlays = [];

    const front = this.root.querySelector<HTMLDivElement>('.cv-front')!;
    const back = this.root.querySelector<HTMLDivElement>('.cv-back')!;
    const right = this.root.querySelector<HTMLDivElement>('.cv-right')!;

    const coverLayers = design.cover({ uid, cover: content.cover });
    front.replaceChildren(this.edge(), ...coverLayers.map((l, i) => this.layer(l, `${uid}f${i}`, i === 0)));

    const silhouettes = coverLayers.filter((l) => l.overhang).map((l) => this.silhouette(l));
    const inside = design.insideLeft({ uid: `${uid}L`, cover: content.cover });
    back.replaceChildren(
      ...silhouettes,
      this.edge(),
      ...inside.map((l, i) => this.layer(l, `${uid}b${i}`, i === 0)),
      this.shade('cv-gutter'),
    );

    const paperId = `${uid}rp`;
    right.innerHTML = '';
    right.append(this.edge());
    const paper = this.layer(
      {
        depth: 0,
        art: `<defs><filter id="${paperId}" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="12" result="n"/>
          <feDiffuseLighting in="n" surfaceScale="0.6" diffuseConstant="1.15" lighting-color="#fff" result="l"><feDistantLight azimuth="235" elevation="58"/></feDiffuseLighting>
          <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.1"/>
          <feComposite in2="SourceAlpha" operator="in"/></filter></defs>
          <rect width="${w}" height="${h}" fill="${design.inside}" filter="url(#${paperId})"/>
          <rect x="${w * 0.055}" y="${h * 0.045}" width="${w * 0.89}" height="${h * 0.91}" fill="${design.insert}" filter="url(#${paperId})"/>`,
      },
      `${uid}r`,
      true,
    );
    right.append(paper, this.shade('cv-cast'), this.shade('cv-gutter'));

    this.insertEl = document.createElement('div');
    this.insertEl.className = 'cv-insert';
    this.insertEl.style.color = design.ink;
    this.insertEl.innerHTML = `
      <div class="cv-to"></div>
      <div class="cv-msg"></div>
      <div class="cv-from"></div>
      <svg class="cv-accent" viewBox="0 0 60 60" aria-hidden="true">${design.accent({ uid: `${uid}x`, cover: content.cover })}</svg>`;
    right.append(this.insertEl);
    this.msgEl = this.insertEl.querySelector('.cv-msg')!;
    this.toEl = this.insertEl.querySelector('.cv-to')!;
    this.fromEl = this.insertEl.querySelector('.cv-from')!;
    this.setWords(content);
    this.label();
    this.fit();
  }

  /** Update the handwriting inside without rebuilding the artwork. */
  setWords(content: CardContent) {
    this.content = content;
    this.insertEl.className = `cv-insert hand-${content.hand}`;
    this.msgEl.textContent = content.message;
    this.toEl.textContent = content.to ? `${content.to},` : '';
    this.fromEl.textContent = content.from;
    const len = content.message.length;
    const scale = len < 40 ? 1.12 : len < 80 ? 1 : len < 140 ? 0.86 : len < 220 ? 0.74 : len < 320 ? 0.64 : 0.56;
    this.insertEl.style.setProperty('--msg', String(scale));
  }

  /** Re-render the cover only, used when cover words change. */
  setCover(cover: string) {
    if (!this.design) return;
    this.render(this.design, { ...this.content, cover });
    if (this.isOpen) this.book.classList.add('is-open');
  }

  setOpen(open: boolean, fromUser = false) {
    if (open === this.isOpen) return;
    this.isOpen = open;
    this.book.classList.remove('is-peek');
    // Restart the lift so the cover rises off the page on every turn.
    this.book.classList.remove('is-turning');
    void this.book.offsetWidth;
    this.book.classList.add('is-turning');
    clearTimeout(this.turnTimer);
    this.turnTimer = window.setTimeout(() => this.book.classList.remove('is-turning'), 1300);
    this.book.classList.toggle('is-open', open);
    this.fit();
    this.label();
    if (fromUser) this.opts.onToggle?.(open);
  }

  /** Lift the corner of the closed cover for a moment, a hint that it opens. */
  peek() {
    if (this.isOpen || reducedMotion()) return;
    this.book.classList.remove('is-peek');
    void this.book.offsetWidth;
    this.book.classList.add('is-peek');
  }

  /** Where the fold sits on screen, for effects that start from the spine. */
  spine(): DOMRect {
    return this.book.querySelector('.cv-right')!.getBoundingClientRect();
  }

  destroy() {
    clearTimeout(this.turnTimer);
    cancelAnimationFrame(this.raf);
    this.resizeObs.disconnect();
    this.disposers.forEach((d) => d());
    this.root.remove();
  }

  private label() {
    if (!this.opts.toggleOnClick || !this.design) return;
    this.root.setAttribute(
      'aria-label',
      this.isOpen
        ? `${this.design.name} card, open. ${this.content.to ? `${this.content.to}, ` : ''}${this.content.message.replace(/[.!?]*\s*$/, '.')} ${this.content.from}. Press to close.`
        : `${this.design.name} card, closed. Press to open.`,
    );
    this.root.setAttribute('aria-pressed', String(this.isOpen));
  }

  private aim(nx: number, ny: number) {
    this.lastInput = performance.now();
    const k = reducedMotion() ? 0.3 : 1;
    this.target = { rx: -ny * 11 * k, ry: nx * 15 * k };
  }

  private fit() {
    if (!this.design) return;
    const { w, h, bleed } = this.design;
    const box = this.host.getBoundingClientRect();
    const fill = this.opts.fill ?? (box.width < 520 ? 0.9 : 0.82);
    const availW = box.width;
    const availH = box.height;
    const spare = bleed * 0.55;
    const sClosed = Math.min((availW * fill) / (w + spare * 2), (availH * fill) / (h + spare * 1.2));
    const narrow = availW < availH * 0.95;
    let k = 1;
    let tx = 0;
    if (this.isOpen) {
      if (narrow) {
        // Phone: keep the message page centred and let the inside cover peek in.
        k = Math.min((availW * 0.84) / w, (availH * fill) / h) / sClosed;
        tx = 0;
      } else {
        k = Math.min((availW * 0.9) / (w * 2), (availH * fill) / h) / sClosed;
        tx = (w * sClosed * k) / 2;
      }
    }
    this.root.style.setProperty('--s', sClosed.toFixed(4));
    this.book.style.setProperty('--zoom', k.toFixed(4));
    this.book.style.setProperty('--tx', `${tx.toFixed(1)}px`);
  }

  private loop(t: number) {
    this.raf = requestAnimationFrame(this.loop);
    const idle = this.opts.idleSway && !reducedMotion() && t - this.lastInput > 2600;
    const goal = idle ? { rx: Math.sin(t * 0.00055) * 4.5, ry: Math.sin(t * 0.0008) * 9 } : this.target;
    const ease = idle ? 0.04 : 0.09;
    const dx = goal.rx - this.cur.rx;
    const dy = goal.ry - this.cur.ry;
    if (Math.abs(dx) < 0.005 && Math.abs(dy) < 0.005) return;
    this.cur.rx += dx * ease;
    this.cur.ry += dy * ease;
    const { rx, ry } = this.cur;
    this.tilt.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    const mx = ry / 15;
    const my = -rx / 11;
    this.root.style.setProperty('--mx', mx.toFixed(3));
    this.root.style.setProperty('--my', my.toFixed(3));
    if (!this.design) return;
    const { w, h } = this.design;
    const sx = (mx * w * 0.75).toFixed(1);
    const sy = (my * h * 0.55).toFixed(1);
    for (const o of this.overlays) {
      o.sheen?.setAttribute('gradientTransform', `translate(${sx} ${sy})`);
      o.patterns[0]?.setAttribute('patternTransform', `translate(${(mx * 46).toFixed(1)} ${(my * 46).toFixed(1)})`);
      o.patterns[1]?.setAttribute(
        'patternTransform',
        `translate(${(-mx * 38 + 70).toFixed(1)} ${(-my * 31 + 40).toFixed(1)}) rotate(37)`,
      );
    }
  }

  /** Light and shadow that change as the cover turns. */
  private shade(className: string) {
    const d = document.createElement('div');
    d.className = `cv-shade ${className}`;
    return d;
  }

  /** The visible paper edge and the shadow under it. */
  private edge() {
    const d = document.createElement('div');
    d.className = 'cv-sheet';
    return d;
  }

  private svg(className: string, inner: string) {
    const { w, h, bleed: b } = this.design;
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', className);
    s.setAttribute('viewBox', `${-b} ${-b} ${w + 2 * b} ${h + 2 * b}`);
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    s.innerHTML = inner;
    return s;
  }

  private layer(l: Layer, id: string, isBase: boolean) {
    const div = document.createElement('div');
    div.className = 'cv-layer';
    div.style.setProperty('--z', String(l.depth));
    div.append(this.svg('cv-art', l.art));
    const overlay: Overlay = { patterns: [] };
    if (l.sheen) {
      const tone = l.sheenTone ?? '#ffffff';
      const { w, h } = this.design;
      const stops = (tone === 'holo' ? HOLO_SHEEN : PLAIN_SHEEN(tone))
        .map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
        .join('');
      const s = this.svg(
        `cv-sheen${tone === 'holo' ? ' is-holo' : ''}`,
        `<defs><linearGradient id="${id}-sh" gradientUnits="userSpaceOnUse" x1="${-w * 0.1}" y1="${-h * 0.2}" x2="${w * 1.1}" y2="${h * 1.2}">
          ${stops}
        </linearGradient></defs>
        <g fill="url(#${id}-sh)" stroke="url(#${id}-sh)" stroke-width="0">${l.sheen}</g>`,
      );
      overlay.sheen = s.querySelector('linearGradient')!;
      div.append(s);
    }
    if (l.glitter) {
      const tex = sparkleTexture();
      const s = this.svg(
        'cv-glitter',
        `<defs>
          <pattern id="${id}-p1" patternUnits="userSpaceOnUse" width="80" height="80"><image href="${tex}" width="80" height="80"/></pattern>
          <pattern id="${id}-p2" patternUnits="userSpaceOnUse" width="64" height="64"><image href="${tex}" width="64" height="64"/></pattern>
        </defs>
        <g fill="url(#${id}-p1)" stroke="url(#${id}-p1)" stroke-width="0">${l.glitter}</g>
        <g fill="url(#${id}-p2)" stroke="url(#${id}-p2)" stroke-width="0">${l.glitter}</g>`,
      );
      overlay.patterns = Array.from(s.querySelectorAll('pattern'));
      div.append(s);
    }
    if (isBase) {
      const glare = document.createElement('div');
      glare.className = 'cv-glare';
      div.append(glare);
    }
    if (overlay.sheen || overlay.patterns.length) this.overlays.push(overlay);
    return div;
  }

  /** The back of an overhanging die cut, seen from inside the open card. */
  private silhouette(l: Layer) {
    const { w, h, bleed: b } = this.design;
    const svg = `<svg xmlns="${NS}" viewBox="${-b} ${-b} ${w + 2 * b} ${h + 2 * b}">${l.art}</svg>`;
    const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    const d = document.createElement('div');
    d.className = 'cv-sil';
    d.style.background = this.design.inside;
    d.style.setProperty('mask-image', url);
    d.style.setProperty('-webkit-mask-image', url);
    return d;
  }
}

/** Escape text for use inside SVG text nodes. */
export const svgText = escapeXml;
