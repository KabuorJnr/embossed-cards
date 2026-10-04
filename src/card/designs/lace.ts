import { escapeXml, leaf, petal, place, smoothClosed, type Pt } from '../shapes';
import type { Design, Layer } from '../types';
import { defs, wrapWords } from './common';

const W = 460;
const H = 600;
const BLUSH = '#e2b3ad';
const IVORY = '#fbf6ee';
const ROSE = '#b86b74';

/** The window in the lace, where the words sit. */
const WIN = { cx: 230, cy: 300, rx: 118, ry: 154 };

const f = (n: number) => n.toFixed(1);

/** Ellipse with a scalloped rim, like the edge of a cut doily. */
function scallopedOval(rx: number, ry: number, bumps: number, depth: number): string {
  const pts: Pt[] = [];
  const n = bumps * 4;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + depth * Math.abs(Math.cos((a * bumps) / 2));
    pts.push([WIN.cx + Math.cos(a) * rx * k, WIN.cy + Math.sin(a) * ry * k]);
  }
  return smoothClosed(pts, 0.8);
}

/** The sheet's outline: every edge finished in small scallops. */
function scallopedEdge(m: number, r: number): string {
  let d = `M${m},${m}`;
  for (let x = m; x < W - m - 0.1; x += 2 * r) d += ` A${r},${r} 0 0 1 ${x + 2 * r},${m}`;
  for (let y = m; y < H - m - 0.1; y += 2 * r) d += ` A${r},${r} 0 0 1 ${W - m},${y + 2 * r}`;
  for (let x = W - m; x > m + 0.1; x -= 2 * r) d += ` A${r},${r} 0 0 1 ${x - 2 * r},${H - m}`;
  for (let y = H - m; y > m + 0.1; y -= 2 * r) d += ` A${r},${r} 0 0 1 ${m},${y - 2 * r}`;
  return d + 'Z';
}

const circle = (x: number, y: number, r: number) => `M${f(x - r)},${f(y)} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0Z`;

/** Six petal holes around a round eyelet. */
function rosette(x: number, y: number, R: number, turn = 0): string {
  const out: string[] = [circle(x, y, R * 0.17)];
  for (let i = 0; i < 6; i++) {
    const a = turn + (i * Math.PI) / 3;
    const d = R * 0.32;
    out.push(smoothClosed(place(petal(R * 0.68, R * 0.5, 0.62), x + Math.sin(a) * d, y - Math.cos(a) * d, a), 0.9));
  }
  return out.join(' ');
}

/** Where the lace pattern sits: a staggered grid that keeps clear of the window and the edge. */
function rosetteSpots(): Pt[] {
  const spots: Pt[] = [];
  for (let row = 0; row * 50 < H; row++) {
    for (let col = 0; col * 58 < W + 58; col++) {
      const x = 27 + col * 58 + (row % 2 ? 29 : 0);
      const y = 25 + row * 50;
      if (x < 52 || x > W - 52 || y < 52 || y > H - 52) continue;
      const ex = (x - WIN.cx) / (WIN.rx + 56);
      const ey = (y - WIN.cy) / (WIN.ry + 56);
      if (ex * ex + ey * ey < 1) continue;
      spots.push([x, y]);
    }
  }
  return spots;
}

/** Pearls strung around the window. */
function pearls(count: number, grow: number): Pt[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return [WIN.cx + Math.cos(a) * (WIN.rx + grow), WIN.cy + Math.sin(a) * (WIN.ry + grow)] as Pt;
  });
}

function eyelets(): string {
  const out: string[] = [];
  const m = 26;
  for (let x = m; x <= W - m; x += 17.1) out.push(circle(x, m, 2.6), circle(x, H - m, 2.6));
  for (let y = m + 17; y < H - m - 8; y += 17.2) out.push(circle(m, y, 2.6), circle(W - m, y, 2.6));
  return out.join(' ');
}

function words(text: string) {
  const lines = wrapWords(text.toUpperCase(), 11, 3);
  const size = lines.some((l) => l.length > 9) ? 22 : 27;
  const gap = size + 12;
  return lines
    .map(
      (l, i) =>
        `<text x="${WIN.cx}" y="${f(WIN.cy + (i - (lines.length - 1) / 2) * gap + size * 0.36)}" text-anchor="middle" font-family="Marcellus, serif" font-size="${size}" letter-spacing="${f(size * 0.2)}">${escapeXml(l)}</text>`,
    )
    .join('');
}

/** A sprig either side of a small diamond, framing the words. */
function flourish(y: number): string {
  const x = WIN.cx;
  return [
    `M${x},${y - 5} L${x + 5},${y} L${x},${y + 5} L${x - 5},${y}Z`,
    leaf(x + 10, y, 30, 9, Math.PI / 2 - 0.12),
    leaf(x - 10, y, 30, 9, -Math.PI / 2 + 0.12),
    leaf(x + 26, y - 2, 18, 7, Math.PI / 2 - 0.7),
    leaf(x - 26, y - 2, 18, 7, -Math.PI / 2 + 0.7),
  ]
    .map((d) => `<path d="${d}"/>`)
    .join('');
}

export const laceDesign: Design = {
  id: 'lace',
  name: 'Lace',
  blurb: 'Laser cut ivory lace over blush card, a ring of pearls, gold foil words',
  w: W,
  h: H,
  bleed: 30,
  coverText: { default: 'Forever & always', max: 30, label: 'Words in the frame' },
  defaultMessage: 'Two hearts, one story. Wishing you a lifetime of the little moments.',
  hand: 'pinyon',
  inside: '#f3ebe3',
  insert: '#fffbf6',
  ink: '#4e3236',
  envelope: { body: '#f7f0ea', liner: BLUSH, seal: ROSE, ink: '#5a3b3e' },
  confetti: ['#f3cfc6', '#fffaf3', '#e3a796', '#f6cfc2', '#d9b25a'],

  cover({ uid, cover }): Layer[] {
    const u0 = `${uid}a`;
    const text = words(cover || ' ');
    const lines = wrapWords((cover || ' ').toUpperCase(), 11, 3).length;
    const span = (lines - 1) * 17 + 48;
    const sprigs = flourish(WIN.cy - span) + flourish(WIN.cy + span);
    const base: Layer = {
      depth: 0,
      art: `${defs(u0, { paper: { grain: 0.8, relief: 0.8, seed: 61 }, gold: 'gold', deboss: { depth: 1.2, light: 0.55, dark: 0.42 } })}
        <rect width="${W}" height="${H}" fill="${BLUSH}" filter="url(#${u0}-paper)"/>
        <g filter="url(#${u0}-deb)" fill="#b77f78">${text}${sprigs}</g>
        <g fill="url(#${u0}-gold)">${text}${sprigs}</g>`,
      sheen: `<g>${text}${sprigs}</g>`,
      sheenTone: '#fff3d6',
    };

    const u1 = `${uid}b`;
    const holes = rosetteSpots()
      .map(([x, y], i) => rosette(x, y, 18, (i % 2) * (Math.PI / 6)))
      .join(' ');
    const lace = `${scallopedEdge(10, 10)} ${scallopedOval(WIN.rx, WIN.ry, 22, 0.035)} ${holes} ${eyelets()}`;
    const ring = `<ellipse cx="${WIN.cx}" cy="${WIN.cy}" rx="${WIN.rx + 30}" ry="${WIN.ry + 30}"/>`;
    const sheet: Layer = {
      depth: 9,
      art: `${defs(u1, { paper: { grain: 0.9, relief: 0.7, seed: 62 }, lift: 0.9, emboss: { depth: 1.2, light: 0.9, dark: 0.22 } })}
        <g filter="url(#${u1}-lift)">
          <path d="${lace}" fill-rule="evenodd" fill="${IVORY}" filter="url(#${u1}-paper)"/>
        </g>
        <g filter="url(#${u1}-emb)" fill="none" stroke="${IVORY}" stroke-width="3">${ring}</g>`,
    };

    const u2 = `${uid}c`;
    const beads = pearls(44, 14);
    const pearlArt = beads.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="5.4"/>`).join('');
    const string: Layer = {
      depth: 15,
      art: `${defs(u2, { lift: 0.45 })}
        <defs>
          <radialGradient id="${u2}-pearl" cx="0.36" cy="0.32" r="0.75">
            <stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="#f8f1ea"/>
            <stop offset="0.8" stop-color="#e2d3c8"/><stop offset="1" stop-color="#c7b0a6"/>
          </radialGradient>
        </defs>
        <g filter="url(#${u2}-lift)" fill="url(#${u2}-pearl)">${pearlArt}</g>`,
      sheen: pearlArt,
      sheenTone: 'holo',
    };
    return [base, sheet, string];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    const spots: Pt[] = [];
    for (let x = 60; x < W; x += 85) spots.push([x, 56], [x, H - 56]);
    for (let y = 141; y < H - 100; y += 85) spots.push([56, y], [W - 56, y]);
    const flowers = spots.map(([x, y], i) => rosette(x, y, 16, (i % 2) * 0.5)).join(' ');
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 0.55, seed: 63 }, emboss: { depth: 1.1, light: 0.9, dark: 0.2 } })}
          <rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>
          <g filter="url(#${u}-emb)"><path d="${flowers}" fill="${this.inside}"/></g>`,
      },
    ];
  },

  accent({ uid }) {
    return `${defs(`${uid}x`, { gold: 'rose' })}<path d="${rosette(30, 30, 24)}" fill="url(#${uid}x-gold)"/>`;
  },
};
