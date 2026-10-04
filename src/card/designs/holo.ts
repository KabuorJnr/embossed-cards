import { rng, sparkle, star } from '../shapes';
import type { Design, Layer } from '../types';
import { defs, wrapWords } from './common';
import { escapeXml } from '../shapes';

const W = 520;
const H = 520;
const NAVY = '#17203d';
const MOON: [number, number, number] = [334, 196, 84];

/** Crescent as one path: outer circle minus a circle offset toward the upper right. */
function crescent(cx: number, cy: number, R: number, angle: number) {
  const r = R * 0.84;
  const d = R * 0.5;
  const x = (d * d + R * R - r * r) / (2 * d);
  const y = Math.sqrt(R * R - x * x);
  const deg = (angle * 180) / Math.PI;
  return `<path transform="translate(${cx} ${cy}) rotate(${deg.toFixed(1)})" d="M${x.toFixed(2)},${(-y).toFixed(2)} A${R},${R} 0 1 0 ${x.toFixed(2)},${y.toFixed(2)} A${r.toFixed(2)},${r.toFixed(2)} 0 0 1 ${x.toFixed(2)},${(-y).toFixed(2)}Z"/>`;
}

const STARS: [number, number, number][] = [
  [70, 96, 9],
  [128, 150, 6],
  [182, 112, 8],
  [236, 168, 5],
  [104, 236, 7],
  [168, 286, 6],
  [86, 340, 8],
  [210, 372, 5],
  [262, 300, 7],
];
const LINKS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [1, 4],
  [4, 5],
  [5, 6],
  [5, 8],
  [5, 7],
];

function words(text: string) {
  const lines = wrapWords(text, 22, 2);
  const size = lines.length > 1 ? 22 : 26;
  const base = H - 64 - (lines.length - 1) * (size + 8);
  return lines
    .map(
      (l, i) =>
        `<text x="${W / 2}" y="${base + i * (size + 10)}" text-anchor="middle" font-family="Marcellus, serif" font-size="${size}" letter-spacing="${(size * 0.24).toFixed(1)}">${escapeXml(l.toUpperCase())}</text>`,
    )
    .join('');
}

export const holoDesign: Design = {
  id: 'holo',
  name: 'Holo night',
  blurb: 'Iridescent foil moon and constellation that shift colour as you tilt',
  w: W,
  h: H,
  bleed: 30,
  coverText: { default: 'Make a wish', max: 28, label: 'Words on the cover' },
  defaultMessage: 'Of all the stars I could wish on, I would still choose you.',
  hand: 'bodoni',
  inside: '#1d2748',
  insert: '#fbf8f2',
  ink: '#1a2140',
  envelope: { body: '#e7e8ef', liner: NAVY, seal: '#5b4b9a', ink: '#1a2140' },
  confetti: { kind: 'star', colors: ['#ff9ad8', '#8fd3ff', '#a6ffcb', '#fff59a', '#c89bff', '#e6e9ee'] },

  cover({ uid, cover }): Layer[] {
    const u = `${uid}a`;
    const r = rng(73);
    const dust: string[] = [];
    for (let i = 0; i < 46; i++) dust.push(`<circle cx="${r.range(16, W - 16).toFixed(1)}" cy="${r.range(16, H - 120).toFixed(1)}" r="${r.range(0.7, 1.9).toFixed(2)}"/>`);
    const glints = [sparkle(420, 360, 10), sparkle(60, 430, 7), sparkle(470, 70, 8)];
    const lines = LINKS.map(([a, b]) => `<line x1="${STARS[a][0]}" y1="${STARS[a][1]}" x2="${STARS[b][0]}" y2="${STARS[b][1]}"/>`).join('');
    const starPaths = STARS.map(([x, y, s]) => `<path d="${star(x, y, s, -Math.PI / 2, 5, 0.42)}"/>`).join('');
    const rings = [124, 168, 214].map((rr) => `<circle cx="${MOON[0]}" cy="${MOON[1]}" r="${rr}"/>`).join('');
    const text = words(cover || ' ');
    const u2 = `${uid}b`;
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 0.6, seed: 61 }, gold: 'silver', glitter: 31, emboss: { depth: 1.6, light: 0.32, dark: 0.55 } })}
          <rect width="${W}" height="${H}" fill="${NAVY}" filter="url(#${u}-paper)"/>
          <clipPath id="${u}-cc"><rect width="${W}" height="${H}"/></clipPath>
          <g clip-path="url(#${u}-cc)"><g filter="url(#${u}-emb)"><g fill="none" stroke="${NAVY}" stroke-width="3.2">${rings}</g></g></g>
          <g fill="#dfe3ec" filter="url(#${u}-gl)">${dust.join('')}</g>
          <g fill="none" stroke="url(#${u}-gold)" stroke-width="1.5" stroke-linecap="round">${lines}</g>
          <g fill="url(#${u}-gold)">${starPaths}${glints.map((d) => `<path d="${d}"/>`).join('')}</g>
          <g fill="url(#${u}-gold)">${text}</g>`,
        sheen: `<g fill="none" stroke-width="2.4">${lines}</g>${starPaths}${glints.map((d) => `<path d="${d}"/>`).join('')}${text}`,
        sheenTone: 'holo',
        glitter: dust.join(''),
      },
      {
        depth: 16,
        art: `${defs(u2, { gold: 'silver', leaf: true, lift: 1.2 })}
          <g filter="url(#${u2}-lift)"><g fill="url(#${u2}-gold)" filter="url(#${u2}-leaf)">${crescent(...MOON, -0.6)}</g></g>`,
        sheen: crescent(...MOON, -0.6),
        sheenTone: 'holo',
      },
    ];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    const r = rng(19);
    const marks: string[] = [];
    for (let i = 0; i < 14; i++) {
      const x = r.range(40, W - 40);
      const y = r.range(40, H - 40);
      marks.push(i % 2 ? sparkle(x, y, r.range(4, 8)) : star(x, y, r.range(4, 7)));
    }
    const paths = marks.map((d) => `<path d="${d}"/>`).join('');
    return [
      { depth: 0, art: `${defs(u, { paper: { relief: 0.5 } })}<rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>` },
      { depth: 3, art: `${defs(`${u}s`, { gold: 'silver' })}<g fill="url(#${u}s-gold)">${paths}</g>`, sheen: paths, sheenTone: 'holo' },
    ];
  },

  accent({ uid }) {
    return `${defs(`${uid}x`, { gold: 'silver' })}<g fill="url(#${uid}x-gold)">${crescent(30, 30, 14, -0.6)}</g>`;
  },
};
