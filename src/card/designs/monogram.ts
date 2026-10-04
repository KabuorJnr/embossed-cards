import { escapeXml, leaf, rot, type Pt } from '../shapes';
import type { Design, Layer } from '../types';
import { defs } from './common';

const W = 440;
const H = 600;
const WINE = '#5d1a29';
const CX = W / 2;
const CY = 300;

/** Two laurel branches curving up either side of the monogram. */
function laurel() {
  const leaves: string[] = [];
  const stems: string[] = [];
  const R = 148;
  for (const side of [-1, 1]) {
    const pts: Pt[] = [];
    for (let i = 0; i <= 13; i++) {
      // From the bottom of the circle up toward the top on each side.
      const a = Math.PI / 2 + side * (0.32 + i * 0.165);
      const p: Pt = [CX + Math.cos(a) * R, CY + Math.sin(a) * R];
      pts.push(p);
      if (i === 0) continue;
      // Direction the stem travels; a leaf tip turns off it to each side.
      const travel = a + (side * Math.PI) / 2;
      const len = 30 - i * 0.9;
      leaves.push(leaf(p[0], p[1], len, len * 0.42, travel + 0.6 + Math.PI / 2));
      leaves.push(leaf(p[0], p[1], len * 0.92, len * 0.4, travel - 0.6 + Math.PI / 2));
    }
    stems.push(`M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L')}`);
  }
  const berries: string[] = [];
  for (const side of [-1, 1]) {
    for (const i of [3, 7, 11]) {
      const a = Math.PI / 2 + side * (0.32 + i * 0.165);
      const [x, y] = rot([CX + R + 9, CY], a, [CX, CY]);
      berries.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6"/>`);
    }
  }
  return { leaves, stems, berries };
}

function initials(text: string) {
  const t = (text.trim() || 'A').slice(0, 3);
  const size = t.length === 1 ? 300 : t.length === 2 ? 158 : 112;
  return `<text x="${CX}" y="${CY + size * 0.34}" text-anchor="middle" font-family="'Bodoni Moda', serif" font-style="italic" font-size="${size}">${escapeXml(t)}</text>`;
}

export const monogramDesign: Design = {
  id: 'monogram',
  name: 'Monogram',
  blurb: 'Deep wine card, their initials blind embossed inside a gold foil laurel',
  w: W,
  h: H,
  bleed: 30,
  coverText: { default: 'A', max: 3, label: 'Initials on the cover' },
  defaultMessage: 'Some names are worth pressing into paper. Yours is one of them.',
  hand: 'bodoni',
  inside: '#efe4dd',
  insert: '#fbf8f4',
  ink: '#3a1620',
  envelope: { body: '#efe6df', liner: WINE, seal: '#8a1f33', ink: '#3a1620' },
  confetti: { kind: 'flake', colors: ['#f3d98d', '#d9b25a', '#ecd08a', '#b98a32'] },

  cover({ uid, cover }): Layer[] {
    const u = `${uid}a`;
    const l = laurel();
    const borders = `<rect x="20" y="20" width="${W - 40}" height="${H - 40}" fill="none" stroke-width="2"/><rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none" stroke-width="0.9"/>`;
    const letter = initials(cover);
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 0.9, grain: 0.8, seed: 5 }, gold: 'gold', emboss: { depth: 2.8, light: 0.42, dark: 0.6 } })}
          <rect width="${W}" height="${H}" fill="${WINE}" filter="url(#${u}-paper)"/>
          <g filter="url(#${u}-emb)"><g fill="${WINE}">${letter}</g></g>
          <g stroke="url(#${u}-gold)">${borders}</g>`,
        sheen: `<g fill="none">${borders.replace(/stroke-width="2"/, 'stroke-width="2.6"').replace(/stroke-width="0.9"/, 'stroke-width="1.4"')}</g>`,
        sheenTone: '#fff1c8',
      },
      {
        depth: 6,
        art: `${defs(`${u}l`, { gold: 'gold', lift: 0.45 })}
          <g filter="url(#${u}l-lift)">
            <g fill="none" stroke="url(#${u}l-gold)" stroke-width="2.4" stroke-linecap="round">${l.stems.map((d) => `<path d="${d}"/>`).join('')}</g>
            <g fill="url(#${u}l-gold)">${l.leaves.map((d) => `<path d="${d}"/>`).join('')}${l.berries.join('')}</g>
          </g>`,
        sheen: `${l.leaves.map((d) => `<path d="${d}"/>`).join('')}${l.berries.join('')}`,
        sheenTone: '#fff1c8',
      },
    ];
  },

  insideLeft({ uid, cover }): Layer[] {
    const u = `${uid}i`;
    // The back of an embossed sheet: the same letters, mirrored and pressed in.
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 0.6, seed: 9 }, deboss: { depth: 2.2, light: 0.75, dark: 0.22 } })}
          <rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>
          <g filter="url(#${u}-deb)"><g fill="${this.inside}" transform="translate(${W} 0) scale(-1 1)">${initials(cover)}</g></g>`,
      },
    ];
  },

  accent({ uid }) {
    return `${defs(`${uid}x`, { gold: 'gold' })}
      <g fill="url(#${uid}x-gold)"><path d="${leaf(27, 48, 24, 10, -0.5)}"/><path d="${leaf(33, 48, 24, 10, 0.5)}"/></g>`;
  },
};
