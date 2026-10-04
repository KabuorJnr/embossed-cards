import { escapeXml, place, smoothClosed, type Pt } from '../shapes';
import type { Design, Layer } from '../types';
import { defs, wrapWords } from './common';

const W = 440;
const H = 600;
const INK = '#1c1a19';
const MUSTARD = '#e2a52b';
const SEA = '#15888a';
const CREAM = '#f6eedd';
const PINDO = 34;

const KOROSHO: Pt[] = [
  [0, 46],
  [26, 32],
  [34, 6],
  [24, -22],
  [6, -40],
  [-10, -52],
  [-5, -38],
  [-7, -22],
  [-22, -4],
  [-30, 20],
  [-22, 40],
];

/** The cashew motif at the heart of so many kanga prints. */
const korosho = (x: number, y: number, s: number, a: number) => smoothClosed(place(KOROSHO, x, y, a, s / 50), 1);

function dotsAlong(x: number, y: number, s: number, a: number, n: number, r: number) {
  const out: string[] = [];
  const ring = place(KOROSHO, x, y, a, (s / 50) * 1.16);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * ring.length;
    const i0 = Math.floor(t) % ring.length;
    const i1 = (i0 + 1) % ring.length;
    const f = t - Math.floor(t);
    const px = ring[i0][0] + (ring[i1][0] - ring[i0][0]) * f;
    const py = ring[i0][1] + (ring[i1][1] - ring[i0][1]) * f;
    out.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r}"/>`);
  }
  return out.join('');
}

function pindo() {
  const diamonds: string[] = [];
  const dots: string[] = [];
  const m = PINDO / 2;
  const edge = (x0: number, y0: number, x1: number, y1: number, step: number) => {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.round(len / step);
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = y0 + ((y1 - y0) * i) / n;
      if (i % 2 === 0) diamonds.push(`M${x},${y - 9} L${x + 7},${y} L${x},${y + 9} L${x - 7},${y}Z`);
      else dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>`);
    }
  };
  edge(m, m, W - m, m, 20);
  edge(W - m, m, W - m, H - m, 20);
  edge(W - m, H - m, m, H - m, 20);
  edge(m, H - m, m, m, 20);
  return { diamonds: diamonds.join(' '), dots: dots.join('') };
}

function jina(text: string) {
  const lines = wrapWords(text, 22, 2);
  const size = lines.length > 1 || lines[0].length > 16 ? 19 : 23;
  const mid = 474;
  return lines
    .map(
      (l, i) =>
        `<text x="${W / 2}" y="${mid + (i - (lines.length - 1) / 2) * (size + 6) + size * 0.35}" text-anchor="middle" font-family="Marcellus, serif" font-size="${size}" letter-spacing="${(size * 0.12).toFixed(1)}">${escapeXml(l.toUpperCase())}</text>`,
    )
    .join('');
}

export const kangaDesign: Design = {
  id: 'kanga',
  name: 'Kanga',
  blurb: 'A kanga print with its saying in foil, korosho pressed in gold',
  w: W,
  h: H,
  bleed: 30,
  coverText: { default: 'Mapenzi ni kikohozi', max: 40, label: 'The kanga saying' },
  defaultMessage: 'Some things cannot be hidden. The way I feel about you is one of them.',
  hand: 'caveat',
  inside: '#e9efe9',
  insert: '#fbf8f1',
  ink: '#1c2a2a',
  envelope: { body: '#f1e7d2', liner: SEA, seal: '#b8862a', ink: '#1c2a2a' },

  cover({ uid, cover }): Layer[] {
    const u = `${uid}a`;
    const p = pindo();
    const big = korosho(222, 248, 118, 0.32);
    const bigInner = korosho(222, 248, 72, 0.32);
    const small = [korosho(104, 130, 46, -0.5), korosho(340, 364, 46, 2.6), korosho(348, 112, 34, 0.9), korosho(96, 370, 34, -2.2)];
    const words = jina(cover || ' ');
    const field = `<rect x="${PINDO}" y="${PINDO}" width="${W - PINDO * 2}" height="${H - PINDO * 2}"/>`;
    const band = `<rect x="64" y="440" width="${W - 128}" height="68" rx="3"/>`;
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 0.7, seed: 41 }, gold: 'gold', emboss: { depth: 1.2, light: 0.55, dark: 0.35 }, deboss: { depth: 1 } })}
          <g filter="url(#${u}-paper)">
            <rect width="${W}" height="${H}" fill="${INK}"/>
            <g fill="${SEA}">${field}</g>
            <g fill="${CREAM}"><path d="${big}"/></g>
            <g fill="${MUSTARD}"><path d="${bigInner}"/></g>
            <g fill="${INK}">${dotsAlong(222, 248, 118, 0.32, 34, 3.6)}</g>
            <g fill="${INK}"><circle cx="222" cy="262" r="14"/></g>
            <g fill="${CREAM}">${small.map((d) => `<path d="${d}"/>`).join('')}</g>
            <g fill="${CREAM}">${band}</g>
          </g>
          <g filter="url(#${u}-emb)"><path d="${p.diamonds}" fill="${MUSTARD}"/><g fill="${CREAM}">${p.dots}</g></g>
          <g fill="none" stroke="${MUSTARD}" stroke-width="2"><rect x="${PINDO + 5}" y="${PINDO + 5}" width="${W - PINDO * 2 - 10}" height="${H - PINDO * 2 - 10}"/></g>
          <g fill="none" stroke="url(#${u}-gold)" stroke-width="2.6"><path d="${big}"/>${small.map((d) => `<path d="${d}"/>`).join('')}<path d="${bigInner}"/></g>
          <g filter="url(#${u}-deb)" fill="${INK}">${words}</g>`,
        sheen: `<g fill="none" stroke-width="3"><path d="${big}"/>${small.map((d) => `<path d="${d}"/>`).join('')}<path d="${bigInner}"/></g><path d="${p.diamonds}"/>`,
        sheenTone: '#fff0c2',
      },
    ];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    const motifs: string[] = [];
    for (let y = 70; y < H; y += 120) {
      for (let x = 70; x < W; x += 110) {
        const shift = (Math.round(y / 120) % 2) * 55;
        motifs.push(`<path d="${korosho(x + shift - 20, y, 22, ((x + y) % 7) * 0.4)}"/>`);
      }
    }
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 0.5 }, deboss: { depth: 1, light: 0.8, dark: 0.22 } })}
          <rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>
          <g filter="url(#${u}-deb)" fill="${this.inside}">${motifs.join('')}</g>`,
      },
    ];
  },

  accent() {
    return `<path d="${korosho(30, 32, 18, 0.3)}" fill="${SEA}"/><path d="${korosho(30, 32, 10, 0.3)}" fill="${MUSTARD}"/>`;
  },
};
