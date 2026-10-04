import { bud, hibiscus } from '../flora';
import { leaf, smoothOpen, type Pt } from '../shapes';
import type { Design, Layer } from '../types';
import { cardClip, defs } from './common';

const W = 460;
const H = 600;
const RED = '#b5132f';

/** Mottled pigment wash so the red reads as hand painted card, not a flat fill. */
const washFilter = (id: string) => `
<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="31" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.02  0 0 0 0 0.1  0 0 0 -2.2 1.25" result="dark"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="8" result="g"/>
  <feDiffuseLighting in="g" surfaceScale="1" diffuseConstant="1.14" lighting-color="#fff" result="l">
    <feDistantLight azimuth="235" elevation="58"/>
  </feDiffuseLighting>
  <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.1" result="t"/>
  <feComposite in="dark" in2="t" operator="atop" result="w"/>
  <feComposite in="w" in2="SourceAlpha" operator="in"/>
</filter>`;

const STEM: Pt[] = [
  [236, 690],
  [244, 560],
  [232, 430],
  [250, 300],
  [262, 170],
  [252, 40],
];

const BRANCHES: Pt[][] = [
  [[240, 470], [190, 420], [150, 345]],
  [[248, 340], [300, 300], [352, 255]],
  [[258, 210], [210, 170], [130, 128]],
  [[244, 560], [300, 520], [352, 405]],
  [[238, 600], [180, 600], [160, 560]],
];

const LEAVES: [number, number, number, number, number][] = [
  [238, 520, 62, 30, 0.9],
  [246, 395, 58, 28, -0.95],
  [256, 250, 54, 26, 1.0],
  [254, 120, 50, 24, -0.8],
  [300, 520, 46, 22, -1.4],
  [190, 420, 44, 22, 1.5],
];

export const hibiscusDesign: Design = {
  id: 'hibiscus',
  name: 'Hibiscus',
  blurb: 'Painted red card, glitter edged hibiscus that spill off the edge',
  w: W,
  h: H,
  bleed: 90,
  defaultMessage: 'Some people feel like sunshine. You are one of them.',
  hand: 'caveat',
  inside: '#efe9e7',
  insert: '#fbf8f4',
  ink: '#3b1d22',
  envelope: { body: '#f4ece9', liner: '#b5132f', seal: '#8e1240', ink: '#5a1626' },

  cover({ uid }): Layer[] {
    const u0 = `${uid}a`;
    const base: Layer = {
      depth: 0,
      art: `<defs>${washFilter(`${u0}-wash`)}</defs>
        <rect width="${W}" height="${H}" fill="${RED}" filter="url(#${u0}-wash)"/>`,
    };

    const u1 = `${uid}b`;
    const stem = smoothOpen(STEM);
    const branches = BRANCHES.map((b) => smoothOpen(b));
    const leaves = LEAVES.map(([x, y, l, w, a]) => leaf(x, y, l, w, a));
    const stems: Layer = {
      depth: 12,
      overhang: true,
      art: `${defs(u1, { lift: 0.8, glitter: 14 })}
        <defs>
          <linearGradient id="${u1}-lf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#4fae55"/><stop offset="1" stop-color="#1f6b31"/>
          </linearGradient>
        </defs>
        <g filter="url(#${u1}-lift)" stroke-linecap="round" fill="none">
          <path d="${stem}" stroke="#1d6a30" stroke-width="15"/>
          <path d="${stem}" stroke="#3c9a47" stroke-width="10"/>
          ${branches.map((d) => `<path d="${d}" stroke="#1d6a30" stroke-width="9"/><path d="${d}" stroke="#3c9a47" stroke-width="5.5"/>`).join('')}
          <g fill="url(#${u1}-lf)" stroke="#9fd38f" stroke-width="1.6">
            ${leaves.map((d) => `<path d="${d}"/>`).join('')}
          </g>
        </g>`,
    };

    const u2 = `${uid}c`;
    const spots: [number, number, number, number][] = [
      [128, 112, 84, 0.2],
      [404, 236, 88, -0.3],
      [86, 366, 92, 0.6],
      [372, 430, 76, 0.1],
      [150, 574, 86, -0.4],
    ];
    const blooms = spots.map(([x, y, R, a], i) => hibiscus(u2, x, y, R, a, 40 + i));
    const buds = [bud(300, 300, 54, 0.5), bud(352, 520, 50, -0.2), bud(262, 40, 46, 0.1)];
    const flowers: Layer = {
      depth: 26,
      overhang: true,
      art: `${defs(u2, { wc: '#8e1240', lift: 1.4, glitter: 6 })}
        <g filter="url(#${u2}-lift)">
          ${buds
            .map(
              (b) =>
                `<path d="${b.body}" fill="#e2577f" stroke="#f6b3c6" stroke-width="2.5"/><path d="${b.calyx}" fill="#2f8a3f" stroke="#1d6a30" stroke-width="1.2"/>`,
            )
            .join('')}
          ${blooms.map((b) => `<g>${b.art}${b.glitterArt}</g>`).join('')}
        </g>`,
      glitter: blooms.map((b) => b.glitter).join(''),
    };
    return [base, stems, flowers];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    const a = hibiscus(u, 220, 210, 92, 0.3, 77);
    const b = hibiscus(u, 120, 420, 56, -0.4, 78);
    return [
      { depth: 0, art: `${defs(u, { paper: { relief: 0.5 } })}<rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>` },
      {
        depth: 2,
        art: `${defs(`${u}g`, { glitter: 18 })}${cardClip(`${u}g`, W, H)}
          <g fill="none" stroke="#b5132f" stroke-width="5" stroke-linejoin="round" filter="url(#${u}g-gl)">${a.silhouette}${b.silhouette}</g>
          <g fill="none" stroke="#e27a96" stroke-width="2" stroke-linejoin="round">${a.silhouette}${b.silhouette}</g>`,
        glitter: `<g fill="none" stroke-width="5">${a.silhouette}${b.silhouette}</g>`,
      },
    ];
  },

  accent({ uid }) {
    const f = hibiscus(`${uid}x`, 30, 32, 22, 0.2, 90);
    return `<g fill="none" stroke="#c22a5e" stroke-width="2" stroke-linejoin="round">${f.silhouette}</g>`;
  },
};
