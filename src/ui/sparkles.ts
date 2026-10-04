/**
 * Gold dust, wax crumbs and paper confetti, drawn on one canvas above the page.
 * Nothing is drawn when the person prefers reduced motion.
 */

type Kind = 'dust' | 'glint' | 'crumb' | 'flake';

interface Particle {
  kind: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  born: number;
  life: number;
  spin: number;
  angle: number;
  /** Phase of the paper's flutter, so flakes tumble out of step. */
  flutter: number;
  gravity: number;
  drag: number;
}

export interface BurstOptions {
  x: number;
  y: number;
  count: number;
  colors: string[];
  kinds?: Kind[];
  /** Direction of travel in radians: 0 is right, -π/2 is up. */
  angle?: number;
  /** How far either side of `angle` particles may fly. */
  spread?: number;
  speed?: [number, number];
  size?: [number, number];
  life?: [number, number];
  gravity?: number;
  drag?: number;
  /** Start points are scattered along a line this wide. */
  width?: number;
  /** ...and this tall. */
  height?: number;
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let raf = 0;
let last = 0;
const live: Particle[] = [];

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.className = 'sparkles';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '40' });
  document.body.append(canvas);
  ctx = canvas.getContext('2d');
  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.round(window.innerWidth * dpr);
    canvas!.height = Math.round(window.innerHeight * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  window.addEventListener('resize', size);
}

function draw(p: Particle, t: number) {
  const g = ctx!;
  const age = (t - p.born) / p.life;
  const fade = age < 0.12 ? age / 0.12 : 1 - Math.max(0, (age - 0.55) / 0.45);
  g.globalAlpha = Math.max(0, Math.min(1, fade));
  g.fillStyle = p.color;
  if (p.kind === 'dust') {
    g.globalCompositeOperation = 'lighter';
    const r = p.size * (0.7 + 0.3 * Math.sin(t * 0.02 + p.flutter));
    const grad = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.6);
    grad.addColorStop(0, p.color);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(p.x, p.y, r * 2.6, 0, Math.PI * 2);
    g.fill();
    g.globalCompositeOperation = 'source-over';
    return;
  }
  g.save();
  g.translate(p.x, p.y);
  g.rotate(p.angle);
  if (p.kind === 'glint') {
    // Four point star that swells and shrinks like light catching foil.
    const r = p.size * (0.55 + 0.45 * Math.abs(Math.sin(t * 0.008 + p.flutter)));
    const k = r * 0.18;
    g.globalCompositeOperation = 'lighter';
    g.beginPath();
    g.moveTo(0, -r);
    g.quadraticCurveTo(k, -k, r, 0);
    g.quadraticCurveTo(k, k, 0, r);
    g.quadraticCurveTo(-k, k, -r, 0);
    g.quadraticCurveTo(-k, -k, 0, -r);
    g.fill();
  } else if (p.kind === 'crumb') {
    const s = p.size;
    g.beginPath();
    g.moveTo(-s, -s * 0.4);
    g.lineTo(-s * 0.2, -s);
    g.lineTo(s, -s * 0.3);
    g.lineTo(s * 0.6, s * 0.8);
    g.lineTo(-s * 0.7, s * 0.6);
    g.closePath();
    g.fill();
  } else {
    // A scrap of paper: squash it as it turns to fake the third dimension.
    g.scale(1, Math.cos(t * 0.006 + p.flutter));
    g.beginPath();
    g.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
  g.globalCompositeOperation = 'source-over';
}

function frame(t: number) {
  const dt = Math.min(48, t - (last || t)) / 16.67;
  last = t;
  const g = ctx!;
  g.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = live.length - 1; i >= 0; i--) {
    const p = live[i];
    if (t - p.born > p.life) {
      live.splice(i, 1);
      continue;
    }
    p.vy += p.gravity * dt;
    p.vx *= Math.pow(p.drag, dt);
    p.vy *= Math.pow(p.drag, dt);
    if (p.kind === 'flake') p.vx += Math.sin(t * 0.003 + p.flutter) * 0.05 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.angle += p.spin * dt;
    draw(p, t);
  }
  g.globalAlpha = 1;
  if (live.length) raf = requestAnimationFrame(frame);
  else {
    raf = 0;
    last = 0;
  }
}

export function burst(o: BurstOptions) {
  if (reduced()) return;
  ensureCanvas();
  if (!ctx) return;
  const now = performance.now();
  const kinds = o.kinds ?? ['dust', 'glint'];
  const [s0, s1] = o.speed ?? [2, 7];
  const [z0, z1] = o.size ?? [1.5, 4];
  const [l0, l1] = o.life ?? [900, 1800];
  for (let i = 0; i < o.count; i++) {
    const kind = kinds[i % kinds.length];
    const a = (o.angle ?? -Math.PI / 2) + rand(-1, 1) * (o.spread ?? Math.PI);
    const v = rand(s0, s1);
    live.push({
      kind,
      x: o.x + rand(-0.5, 0.5) * (o.width ?? 0),
      y: o.y + rand(-0.5, 0.5) * (o.height ?? 0),
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      size: rand(z0, z1) * (kind === 'glint' ? 2.4 : kind === 'flake' ? 1.8 : 1),
      color: o.colors[Math.floor(Math.random() * o.colors.length)],
      born: now + rand(0, 90),
      life: rand(l0, l1),
      spin: rand(-0.12, 0.12),
      angle: rand(0, Math.PI * 2),
      flutter: rand(0, Math.PI * 2),
      gravity: o.gravity ?? (kind === 'crumb' ? 0.32 : kind === 'flake' ? 0.035 : 0.02),
      drag: o.drag ?? (kind === 'flake' ? 0.975 : 0.955),
    });
  }
  if (!raf) raf = requestAnimationFrame(frame);
}

/** Paper confetti drifting down across the whole page. */
export function shower(colors: string[], count = 46) {
  burst({
    x: window.innerWidth / 2,
    y: -20,
    width: window.innerWidth * 1.1,
    count,
    colors,
    kinds: ['flake', 'flake', 'glint'],
    angle: Math.PI / 2,
    spread: 0.5,
    speed: [0.6, 2.2],
    size: [2.5, 5],
    life: [3600, 5600],
    gravity: 0.03,
    drag: 0.985,
  });
}
