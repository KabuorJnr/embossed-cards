import { escapeXml } from '../shapes';
import type { Design, Layer } from '../types';
import { defs, wrapWords } from './common';

const W = 440;
const H = 600;
const INK = '#151419';
const FX = W / 2;
const FY = 486;

function fan() {
  const arcs = [72, 112, 152, 192].map((r) => `<path d="M${FX - r},${FY} A${r},${r} 0 0 1 ${FX + r},${FY}"/>`);
  const rays: string[] = [];
  for (let a = 180 + 9; a < 360; a += 9) {
    const t = (a * Math.PI) / 180;
    rays.push(`<line x1="${(FX + Math.cos(t) * 72).toFixed(1)}" y1="${(FY + Math.sin(t) * 72).toFixed(1)}" x2="${(FX + Math.cos(t) * 192).toFixed(1)}" y2="${(FY + Math.sin(t) * 192).toFixed(1)}"/>`);
  }
  const sun = `<path d="M${FX - 56},${FY} A56,56 0 0 1 ${FX + 56},${FY}Z"/>`;
  return { arcs: arcs.join(''), rays: rays.join(''), sun };
}

/** Blind debossed rays fanning across the whole card behind the foil. */
function wideRays() {
  const out: string[] = [];
  for (let a = 182; a < 360; a += 6) {
    const t1 = (a * Math.PI) / 180;
    const t2 = ((a + 2.2) * Math.PI) / 180;
    const R = 900;
    out.push(`M${FX},${FY} L${(FX + Math.cos(t1) * R).toFixed(1)},${(FY + Math.sin(t1) * R).toFixed(1)} L${(FX + Math.cos(t2) * R).toFixed(1)},${(FY + Math.sin(t2) * R).toFixed(1)}Z`);
  }
  return out.join(' ');
}

function corners() {
  const s = (x: number, y: number, dx: number, dy: number) =>
    `<path d="M${x},${y + dy * 44} L${x},${y} L${x + dx * 44},${y} M${x + dx * 8},${y + dy * 30} L${x + dx * 8},${y + dy * 8} L${x + dx * 30},${y + dy * 8} M${x + dx * 16},${y + dy * 16} l${dx * 6},0 l0,${dy * 6} l${-dx * 6},0Z"/>`;
  return [s(38, 38, 1, 1), s(W - 38, 38, -1, 1), s(38, H - 38, 1, -1), s(W - 38, H - 38, -1, -1)].join('');
}

function words(text: string) {
  const lines = wrapWords(text, 14, 2);
  const size = lines.some((l) => l.length > 11) ? 30 : 36;
  const top = 168 - (lines.length - 1) * (size * 0.6);
  return lines
    .map(
      (l, i) =>
        `<text x="${FX}" y="${top + i * (size + 14)}" text-anchor="middle" font-family="Marcellus, serif" font-size="${size}" letter-spacing="${(size * 0.2).toFixed(1)}">${escapeXml(l.toUpperCase())}</text>`,
    )
    .join('');
}

export const decoDesign: Design = {
  id: 'deco',
  name: 'Deco',
  blurb: 'Black card, copper foil sunburst and blind debossed rays',
  w: W,
  h: H,
  bleed: 30,
  coverText: { default: 'Cheers to you', max: 28, label: 'Words on the cover' },
  defaultMessage: 'Here is to you, to everything you have built, and to everything still coming.',
  hand: 'bodoni',
  inside: '#efe7dc',
  insert: '#fbf8f2',
  ink: '#241d17',
  envelope: { body: '#ece4d8', liner: INK, seal: '#a2582c', ink: '#241d17' },
  confetti: { kind: 'flake', colors: ['#f0bb8a', '#d08a55', '#e7a878', '#fff1e0'] },

  cover({ uid, cover }): Layer[] {
    const u = `${uid}a`;
    const f = fan();
    const text = words(cover || ' ');
    const frame = `<rect x="18" y="18" width="${W - 36}" height="${H - 36}" fill="none" stroke-width="2"/><rect x="26" y="26" width="${W - 52}" height="${H - 52}" fill="none" stroke-width="0.8"/>`;
    const diamonds = [250, 270, 290].map((y, i) => `<path d="M${FX},${y - 5 + i * 0} l5,5 l-5,5 l-5,-5Z"/>`).join('');
    const foil = `<g fill="none" stroke-width="2.4">${f.arcs}</g><g fill="none" stroke-width="1.2">${f.rays}</g>${f.sun}<g fill="none">${frame}</g><g fill="none" stroke-width="2">${corners()}</g>${text}${diamonds}`;
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 0.7, seed: 14 }, gold: 'copper', leaf: true, deboss: { depth: 1.3, light: 0.14, dark: 0.7 } })}
          <rect width="${W}" height="${H}" fill="${INK}" filter="url(#${u}-paper)"/>
          <clipPath id="${u}-cc"><rect width="${W}" height="${H}"/></clipPath>
          <g clip-path="url(#${u}-cc)"><g filter="url(#${u}-deb)"><path d="${wideRays()}" fill="${INK}"/></g></g>
          <path d="M${FX - 198},${FY} A198,198 0 0 1 ${FX + 198},${FY}Z" fill="${INK}"/>
          <g fill="url(#${u}-gold)" stroke="url(#${u}-gold)">
            <g fill="none" stroke-width="2.4">${f.arcs}</g>
            <g fill="none" stroke-width="1.2">${f.rays}</g>
            <g stroke="none" filter="url(#${u}-leaf)">${f.sun}</g>
            <g fill="none">${frame}</g>
            <g fill="none" stroke-width="2">${corners()}</g>
            <g stroke="none">${text}${diamonds}</g>
          </g>`,
        sheen: foil,
        sheenTone: '#ffd9b8',
      },
    ];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 0.55, seed: 3 }, deboss: { depth: 1, light: 0.8, dark: 0.18 } })}
          <rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>
          <clipPath id="${u}-cc"><rect width="${W}" height="${H}"/></clipPath>
          <g clip-path="url(#${u}-cc)" transform="translate(${W} 0) scale(-1 1)"><g filter="url(#${u}-deb)"><path d="${wideRays()}" fill="${this.inside}"/></g></g>`,
      },
    ];
  },

  accent({ uid }) {
    const arcs = [10, 16, 22].map((r) => `<path d="M${30 - r},44 A${r},${r} 0 0 1 ${30 + r},44"/>`).join('');
    return `${defs(`${uid}x`, { gold: 'copper' })}<g fill="none" stroke="url(#${uid}x-gold)" stroke-width="2">${arcs}</g><path d="M22,44 A8,8 0 0 1 38,44Z" fill="url(#${uid}x-gold)"/>`;
  },
};
