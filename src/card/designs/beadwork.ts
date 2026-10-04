import type { Design, Layer } from '../types';
import { defs } from './common';

const W = 440;
const H = 600;
const RED = '#b51f2b';
const NAVY = '#1c2a5a';
const CX = W / 2;
const CY = 262;

const BEAD = {
  white: '#f6f2ea',
  red: '#d22b2b',
  blue: '#2a5bd7',
  orange: '#f08a1c',
  yellow: '#f4c430',
  green: '#1f9a54',
  black: '#1a1a1a',
};
type BeadName = keyof typeof BEAD;

// Each ring of the collar, from the neck outward. A pattern repeats round the ring.
const RINGS: { r: number; pattern: BeadName[] }[] = [
  { r: 78, pattern: ['white'] },
  { r: 89, pattern: ['red'] },
  { r: 100, pattern: ['blue', 'blue', 'blue', 'white', 'white', 'white'] },
  { r: 111, pattern: ['white'] },
  { r: 122, pattern: ['orange', 'orange', 'yellow', 'yellow', 'green', 'green'] },
  { r: 133, pattern: ['black'] },
  { r: 144, pattern: ['white', 'red', 'red', 'white', 'blue', 'blue'] },
  { r: 155, pattern: ['red'] },
  { r: 166, pattern: ['white', 'white', 'yellow', 'white', 'white', 'green'] },
];

interface Bead {
  x: number;
  y: number;
  r: number;
  c: string;
}

function collar(): Bead[] {
  const out: Bead[] = [];
  for (const ring of RINGS) {
    const n = Math.round((Math.PI * 2 * ring.r) / 10.4);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      out.push({ x: CX + Math.cos(a) * ring.r, y: CY + Math.sin(a) * ring.r, r: 4.4, c: BEAD[ring.pattern[k % ring.pattern.length]] });
    }
  }
  // Strands hanging from the lower edge of the collar.
  const strands = 9;
  for (let s = 0; s < strands; s++) {
    const a = Math.PI / 2 + (s - (strands - 1) / 2) * 0.17;
    const x0 = CX + Math.cos(a) * 172;
    const y0 = CY + Math.sin(a) * 172;
    const len = 6 + (4 - Math.abs(s - 4)) * 2;
    for (let k = 0; k < len; k++) {
      const names: BeadName[] = ['white', 'red', 'blue', 'white', 'yellow', 'green'];
      out.push({ x: x0 + (a - Math.PI / 2) * k * 3, y: y0 + 10 + k * 8.8, r: 3.9, c: BEAD[names[(k + s) % names.length]] });
    }
    const last = out[out.length - 1];
    out.push({ x: last.x, y: last.y + 13, r: 7, c: 'silver' });
  }
  return out;
}

function plaid() {
  const parts: string[] = [];
  for (let x = 30; x < W; x += 88) parts.push(`<rect x="${x}" y="0" width="22" height="${H}" fill="${NAVY}" opacity="0.5"/><rect x="${x + 30}" y="0" width="3" height="${H}" fill="#111" opacity="0.45"/>`);
  for (let y = 40; y < H; y += 88) parts.push(`<rect x="0" y="${y}" width="${W}" height="22" fill="${NAVY}" opacity="0.5"/><rect x="0" y="${y + 30}" width="${W}" height="3" fill="#111" opacity="0.45"/>`);
  return parts.join('');
}

export const beadworkDesign: Design = {
  id: 'beadwork',
  name: 'Beadwork',
  blurb: 'Red plaid shuka with a raised bead collar that glints as you tilt',
  w: W,
  h: H,
  bleed: 30,
  defaultMessage: 'Wherever life takes you, you carry home with you.',
  hand: 'caveat',
  inside: '#efe4d6',
  insert: '#fbf7f0',
  ink: '#2a1d1a',
  envelope: { body: '#f1e5d5', liner: RED, seal: NAVY, ink: '#2a1d1a' },
  confetti: { kind: 'bead', colors: Object.values(BEAD) },

  cover({ uid }): Layer[] {
    const u = `${uid}a`;
    const beads = collar();
    const ub = `${uid}b`;
    const art = beads
      .map((b) =>
        b.c === 'silver'
          ? `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${b.r}" fill="url(#${ub}-gold)"/>`
          : `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${b.r}" fill="${b.c}"/><circle cx="${(b.x - b.r * 0.32).toFixed(1)}" cy="${(b.y - b.r * 0.34).toFixed(1)}" r="${(b.r * 0.34).toFixed(2)}" fill="#fff" opacity="0.55"/>`,
      )
      .join('');
    const glints = beads.map((b) => `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${(b.r * 0.85).toFixed(2)}"/>`).join('');
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 1.1, grain: 1.2, seed: 22 } })}
          <g filter="url(#${u}-paper)"><rect width="${W}" height="${H}" fill="${RED}"/>${plaid()}</g>`,
      },
      {
        depth: 9,
        art: `${defs(ub, { gold: 'silver', lift: 0.7 })}
          <g filter="url(#${ub}-lift)">
            <circle cx="${CX}" cy="${CY}" r="${RINGS[RINGS.length - 1].r + 6}" fill="none" stroke="#5a2a1a" stroke-width="2" opacity="0.35"/>
            ${art}
          </g>`,
        sheen: glints,
        sheenTone: '#ffffff',
      },
    ];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    const row = (y: number) =>
      Array.from({ length: 34 }, (_, k) => {
        const names: BeadName[] = ['white', 'red', 'blue', 'white', 'yellow', 'green'];
        return `<circle cx="${(20 + k * 12).toFixed(1)}" cy="${y}" r="3.6" fill="${BEAD[names[k % names.length]]}"/>`;
      }).join('');
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 0.55, seed: 7 }, lift: 0.4 })}
          <rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>
          <g filter="url(#${u}-lift)">${row(34)}${row(H - 34)}</g>`,
      },
    ];
  },

  accent() {
    return `<circle cx="18" cy="30" r="5.5" fill="${BEAD.red}"/><circle cx="30" cy="30" r="5.5" fill="${BEAD.blue}"/><circle cx="42" cy="30" r="5.5" fill="${BEAD.yellow}"/>
      <g fill="#fff" opacity="0.55"><circle cx="16.4" cy="28.2" r="1.8"/><circle cx="28.4" cy="28.2" r="1.8"/><circle cx="40.4" cy="28.2" r="1.8"/></g>`;
  },
};
