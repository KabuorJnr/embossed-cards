import { petal, place, rng, smoothClosed } from '../shapes';
import type { Design, Layer } from '../types';
import { defs } from './common';

const W = 520;
const H = 520;
const CX = W / 2;
const CY = H / 2;
const COTTON = '#f6f3ee';

// Outer ring first. Each ring is its own sheet of paper, stacked higher.
const RINGS = [
  { n: 14, R: 206, tint: '#fcfbf8', depth: 5, twist: 0 },
  { n: 12, R: 166, tint: '#f9f3ef', depth: 11, twist: 0.13 },
  { n: 10, R: 128, tint: '#f6ebe6', depth: 17, twist: 0.05 },
  { n: 8, R: 92, tint: '#f3e1db', depth: 23, twist: 0.3 },
  { n: 6, R: 58, tint: '#efd5cd', depth: 29, twist: 0.12 },
];

function ring(uid: string, i: number): Layer {
  const { n, R, tint, depth, twist } = RINGS[i];
  const u = `${uid}r${i}`;
  const paths: string[] = [];
  const grads: string[] = [];
  for (let k = 0; k < n; k++) {
    const a = twist + (k * Math.PI * 2) / n;
    const base = [CX + Math.cos(a - Math.PI / 2) * R * 0.22, CY + Math.sin(a - Math.PI / 2) * R * 0.22];
    const len = R * 0.8;
    const width = ((Math.PI * 2 * R * 0.62) / n) * 1.25;
    const pts = place(petal(len, width, 0.66, 0, 1), base[0], base[1], a);
    paths.push(smoothClosed(pts, 0.92));
    // Light catches one side of each curled petal.
    const [l, r] = place(
      [
        [-width * 0.5, -len * 0.6],
        [width * 0.5, -len * 0.6],
      ],
      base[0],
      base[1],
      a,
    );
    grads.push(`<linearGradient id="${u}g${k}" gradientUnits="userSpaceOnUse" x1="${l[0].toFixed(1)}" y1="${l[1].toFixed(1)}" x2="${r[0].toFixed(1)}" y2="${r[1].toFixed(1)}">
      <stop offset="0" stop-color="#fff" stop-opacity="0.65"/><stop offset="0.45" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.75" stop-color="#7a5a4c" stop-opacity="0"/><stop offset="1" stop-color="#7a5a4c" stop-opacity="0.16"/>
    </linearGradient>`);
  }
  const crease = paths
    .map((_, k) => {
      const a = twist + (k * Math.PI * 2) / n;
      const [p0, p1] = place(
        [
          [0, -R * 0.2],
          [0, -R * 0.66],
        ],
        CX + Math.cos(a - Math.PI / 2) * R * 0.22,
        CY + Math.sin(a - Math.PI / 2) * R * 0.22,
        a,
      );
      return `<line x1="${p0[0].toFixed(1)}" y1="${p0[1].toFixed(1)}" x2="${p1[0].toFixed(1)}" y2="${p1[1].toFixed(1)}"/>`;
    })
    .join('');
  return {
    depth,
    art: `${defs(u, { paper: { relief: 0.55, seed: 30 + i }, lift: 0.75 })}<defs>${grads.join('')}</defs>
      <g filter="url(#${u}-lift)">
        <g filter="url(#${u}-paper)">${paths.map((d) => `<path d="${d}" fill="${tint}"/>`).join('')}</g>
        ${paths.map((d, k) => `<path d="${d}" fill="url(#${u}g${k})"/>`).join('')}
        <g stroke="#9c7f72" stroke-opacity="0.16" stroke-width="1" stroke-linecap="round">${crease}</g>
      </g>`,
  };
}

export const paperBloomDesign: Design = {
  id: 'paperbloom',
  name: 'Paper bloom',
  blurb: 'White on white: five sheets of cut petals stacked into a deep paper rose',
  w: W,
  h: H,
  bleed: 30,
  defaultMessage: 'Quietly, beautifully, you make everything around you bloom.',
  hand: 'pinyon',
  inside: '#f0ebe4',
  insert: '#fcfaf6',
  ink: '#3b302b',
  envelope: { body: '#f4f0ea', liner: '#e9cfc7', seal: '#c98a8a', ink: '#3b302b' },
  confetti: { kind: 'petal', colors: ['#ffffff', '#fbf3ef', '#f3dcd6', '#efd0c7'] },

  cover({ uid }): Layer[] {
    const u = `${uid}a`;
    const r = rng(8);
    const dots: string[] = [];
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      dots.push(`<circle cx="${(CX + Math.cos(a) * 238).toFixed(1)}" cy="${(CY + Math.sin(a) * 238).toFixed(1)}" r="${i % 2 ? 2 : 3.4}"/>`);
    }
    const pistil: string[] = [];
    for (let i = 0; i < 13; i++) {
      const a = r.range(0, Math.PI * 2);
      const d = r.range(0, 14);
      pistil.push(`<circle cx="${(CX + Math.cos(a) * d).toFixed(1)}" cy="${(CY + Math.sin(a) * d).toFixed(1)}" r="${r.range(2.4, 4.2).toFixed(1)}"/>`);
    }
    const uc = `${uid}c`;
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 1, grain: 0.75, seed: 4 }, emboss: { depth: 1.2, light: 0.9, dark: 0.22 } })}
          <rect width="${W}" height="${H}" fill="${COTTON}" filter="url(#${u}-paper)"/>
          <g filter="url(#${u}-emb)"><g fill="${COTTON}">${dots.join('')}</g></g>`,
      },
      ...RINGS.map((_, i) => ring(uid, i)),
      {
        depth: 33,
        art: `${defs(uc, { gold: 'gold', lift: 0.5 })}<g filter="url(#${uc}-lift)"><g fill="url(#${uc}-gold)">${pistil.join('')}</g></g>`,
        sheen: pistil.join(''),
        sheenTone: '#fff3d0',
      },
    ];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    const outer = Array.from({ length: 14 }, (_, k) => {
      const a = (k * Math.PI * 2) / 14;
      const R = 206;
      return `<path d="${smoothClosed(place(petal(R * 0.8, ((Math.PI * 2 * R * 0.62) / 14) * 1.25, 0.66, 0, 1), CX + Math.cos(a - Math.PI / 2) * R * 0.22, CY + Math.sin(a - Math.PI / 2) * R * 0.22, a), 0.92)}"/>`;
    }).join('');
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 0.55, seed: 2 }, deboss: { depth: 0.9, light: 0.85, dark: 0.14 } })}
          <rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>
          <g filter="url(#${u}-deb)"><g fill="none" stroke="${this.inside}" stroke-width="2">${outer}</g></g>`,
      },
    ];
  },

  accent() {
    const petals = Array.from({ length: 6 }, (_, k) => {
      const a = (k * Math.PI) / 3;
      return `<path d="${smoothClosed(place(petal(16, 10, 0.66, 0, 1), 30 + Math.cos(a - Math.PI / 2) * 3, 30 + Math.sin(a - Math.PI / 2) * 3, a), 0.92)}"/>`;
    }).join('');
    return `<g fill="#f3dcd6" stroke="#d9b6ab" stroke-width="0.8">${petals}</g><circle cx="30" cy="30" r="3.2" fill="#d9b25a"/>`;
  },
};
