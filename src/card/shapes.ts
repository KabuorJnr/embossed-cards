/** Small, deterministic drawing helpers shared by every card design. */

export type Pt = [number, number];

/** Mulberry32: a tiny seeded random generator so every card renders identically. */
export function rng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range: (min: number, max: number) => min + (max - min) * next(),
    pick: <T>(list: readonly T[]) => list[Math.floor(next() * list.length)],
  };
}

const f = (n: number) => Math.round(n * 100) / 100;

/** Smooth closed path through points (Catmull-Rom converted to cubic Béziers). */
export function smoothClosed(points: Pt[], tension = 1): string {
  const n = points.length;
  let d = `M${f(points[0][0])},${f(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + 'Z';
}

/** Smooth open path through points. */
export function smoothOpen(points: Pt[]): string {
  let d = `M${f(points[0][0])},${f(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

/** Rotate a point around an origin. */
export function rot([x, y]: Pt, a: number, [ox, oy]: Pt = [0, 0]): Pt {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [ox + (x - ox) * c - (y - oy) * s, oy + (x - ox) * s + (y - oy) * c];
}

/** Five (or n) point star. */
export function star(cx: number, cy: number, r: number, rot0 = -Math.PI / 2, points = 5, inner = 0.47): string {
  const pts: Pt[] = [];
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 ? r * inner : r;
    const a = rot0 + (i * Math.PI) / points;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  // Slightly rounded points read as cut paper rather than vector clip art.
  return smoothClosed(pts, 0.22);
}

/** Four point sparkle, like a glint on foil. */
export function sparkle(cx: number, cy: number, r: number): string {
  const k = r * 0.16;
  return `M${f(cx)},${f(cy - r)} Q${f(cx + k)},${f(cy - k)} ${f(cx + r)},${f(cy)} Q${f(cx + k)},${f(cy + k)} ${f(cx)},${f(cy + r)} Q${f(cx - k)},${f(cy + k)} ${f(cx - r)},${f(cy)} Q${f(cx - k)},${f(cy - k)} ${f(cx)},${f(cy - r)}Z`;
}

/**
 * A single petal as a closed path: base at the origin, tip at (0,-len).
 * `width` is the widest point, `round` pushes the widest point toward the tip,
 * `twist` skews it sideways like a frangipani petal.
 */
export function petal(len: number, width: number, round = 0.62, twist = 0, notch = 0): Pt[] {
  const w = width / 2;
  const pts: Pt[] = [
    [0, 0],
    [w * 0.35, -len * 0.12],
    [w * 0.95 + twist * 0.3, -len * round * 0.82],
    [w * 0.8 + twist, -len * 0.93],
    [twist * 0.6 + (notch ? w * 0.18 : 0), -len + (notch ? len * 0.06 : 0)],
    [-w * 0.55 + twist * 0.4, -len * 0.95],
    [-w * 0.95 + twist * 0.1, -len * round * 0.8],
    [-w * 0.35, -len * 0.12],
  ];
  return pts;
}

/** Transform a list of points: rotate by angle then translate. */
export function place(pts: Pt[], x: number, y: number, angle: number, scale = 1): Pt[] {
  return pts.map(([px, py]) => {
    const [rx, ry] = rot([px * scale, py * scale], angle);
    return [rx + x, ry + y] as Pt;
  });
}

/** Wobbly vertical band, used for gold leaf stripes. */
export function wobbleBand(x: number, top: number, bottom: number, width: number, r: ReturnType<typeof rng>): string {
  const steps = 14;
  const left: Pt[] = [];
  const right: Pt[] = [];
  let drift = 0;
  for (let i = 0; i <= steps; i++) {
    const y = top + ((bottom - top) * i) / steps;
    drift += r.range(-1.4, 1.4);
    const ww = width * r.range(0.72, 1.12);
    left.push([x + drift - ww / 2 + r.range(-1.2, 1.2), y]);
    right.push([x + drift + ww / 2 + r.range(-1.2, 1.2), y]);
  }
  return smoothClosed([...left, ...right.reverse()], 0.6);
}

/** Irregular blob, for leaves, hills and torn paper. */
export function blob(cx: number, cy: number, rx: number, ry: number, r: ReturnType<typeof rng>, n = 10, jitter = 0.16): string {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + r.range(-jitter, jitter);
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return smoothClosed(pts);
}

/** Leaf shape pointing along `angle`. */
export function leaf(x: number, y: number, len: number, width: number, angle: number): string {
  const pts: Pt[] = [
    [0, 0],
    [width * 0.5, -len * 0.3],
    [width * 0.42, -len * 0.7],
    [0, -len],
    [-width * 0.42, -len * 0.68],
    [-width * 0.5, -len * 0.28],
  ];
  return smoothClosed(place(pts, x, y, angle), 0.9);
}

export const escapeXml = (s: string) =>
  s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c]!);
