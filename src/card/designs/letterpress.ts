import { frangipani, type BloomPalette } from '../flora';
import { escapeXml, leaf, smoothOpen } from '../shapes';
import type { Design, Layer } from '../types';
import { defs, wrapWords } from './common';

const W = 440;
const H = 600;
const COTTON = '#f5f2ec';

const BLUSH: BloomPalette = {
  throat: '#efb447',
  mid: '#fdf0ec',
  body: '#f4b8c3',
  edge: '#df7d96',
  vein: '#c75a7a',
};

const SPRAY: [number, number, number, number][] = [
  [212, 178, 112, 0.1],
  [326, 282, 72, -0.6],
  [110, 290, 64, 0.8],
];

const twigs = smoothOpen([
  [210, 186],
  [226, 300],
  [218, 392],
]);
const sideTwigs = [
  smoothOpen([[224, 300], [276, 290], [326, 282]]),
  smoothOpen([[220, 330], [166, 318], [110, 290]]),
];
const leaves = [
  leaf(220, 384, 84, 30, 2.6),
  leaf(222, 372, 76, 28, -2.5),
  leaf(228, 322, 60, 22, 2.2),
  leaf(214, 336, 54, 20, -2.1),
];

function coverWords(text: string) {
  const lines = wrapWords(text.toUpperCase(), 16, 2);
  const size = lines.some((l) => l.length > 13) ? 24 : 29;
  const top = H - 104 - (lines.length - 1) * (size + 10);
  return lines
    .map(
      (l, i) =>
        `<text x="${W / 2}" y="${top + i * (size + 12)}" text-anchor="middle" font-family="Marcellus, serif" font-size="${size}" letter-spacing="${(size * 0.22).toFixed(1)}">${escapeXml(l)}</text>`,
    )
    .join('');
}

export const letterpressDesign: Design = {
  id: 'letterpress',
  name: 'Letterpress',
  blurb: 'Cotton card, painted frangipani spray, gold foil words pressed in',
  w: W,
  h: H,
  bleed: 40,
  coverText: { default: 'Happy birthday', max: 32, label: 'Words on the cover' },
  defaultMessage: 'For all the quiet ways you make life lovely.',
  hand: 'pinyon',
  inside: '#ebe7e1',
  insert: '#fbf9f5',
  ink: '#33302c',
  envelope: { body: '#f2efe9', liner: '#e2c27c', seal: '#9c7a3c', ink: '#3a352f' },

  cover({ uid, cover }): Layer[] {
    const u = `${uid}a`;
    const blooms = SPRAY.map(([x, y, R, a]) => frangipani(u, x, y, R, a, BLUSH, false));
    const words = coverWords(cover || ' ');
    const frame = `<rect x="22" y="22" width="${W - 44}" height="${H - 44}" rx="2" fill="none" stroke="#000" stroke-width="2.2"/>`;
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { grain: 0.75, relief: 1.1, seed: 19 }, gold: 'gold', wc: '#c75a7a', deboss: { depth: 1.3 }, leaf: true })}
          <rect width="${W}" height="${H}" fill="${COTTON}" filter="url(#${u}-paper)"/>
          <g filter="url(#${u}-deb)">${frame.replace('stroke="#000"', `stroke="${COTTON}"`)}</g>
          <g opacity="0.92">
            <g fill="none" stroke="#6f8f5a" stroke-width="3.2" stroke-linecap="round">
              <path d="${twigs}"/>${sideTwigs.map((d) => `<path d="${d}"/>`).join('')}
            </g>
            <g fill="#8fae78" opacity="0.85">${leaves.map((d) => `<path d="${d}"/>`).join('')}</g>
            ${blooms.map((b) => b.art).join('')}
          </g>
          <g fill="none" stroke="url(#${u}-gold)" stroke-width="1.3">${blooms.map((b) => b.silhouette).join('')}</g>
          <g filter="url(#${u}-deb)"><g fill="#d9b25a">${words}</g></g>
          <g fill="url(#${u}-gold)">${words}</g>`,
        sheen: `<g>${words}</g><g fill="none" stroke-width="1.6">${blooms.map((b) => b.silhouette).join('')}</g>`,
        sheenTone: '#fff3cf',
      },
    ];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    // The back of a letterpress sheet: the press shows through as a soft relief.
    const blooms = SPRAY.map(([x, y, R, a]) => frangipani(u, W - x, y, R, -a, BLUSH, false));
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { grain: 0.75, relief: 0.6, seed: 23 }, emboss: { depth: 1.1, light: 0.75, dark: 0.18 } })}
          <rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>
          <g filter="url(#${u}-emb)"><g fill="none" stroke="${this.inside}" stroke-width="2.4">${blooms.map((b) => b.silhouette).join('')}</g></g>
          <g fill="none" stroke="#d08aa0" stroke-opacity="0.5" stroke-width="1">${blooms.map((b) => b.silhouette).join('')}</g>`,
      },
    ];
  },

  accent({ uid }) {
    const b = frangipani(`${uid}x`, 30, 32, 20, 0.2, BLUSH, false);
    return `${defs(`${uid}x`, { wc: '#c75a7a' })}${b.art}`;
  },
};
