import { type Pt, petal, place, rng, rot, smoothClosed, smoothOpen } from './shapes';

export interface BloomPalette {
  throat: string;
  mid: string;
  body: string;
  edge: string;
  vein: string;
}

export const PINK_FRANGIPANI: BloomPalette = {
  throat: '#f4bb3a',
  mid: '#fde6e4',
  body: '#f6a7b8',
  edge: '#e0628a',
  vein: '#c94672',
};

export const WHITE_FRANGIPANI: BloomPalette = {
  throat: '#f2b32e',
  mid: '#fff6dc',
  body: '#fffdf8',
  edge: '#f3e3d0',
  vein: '#d8b98e',
};

export interface Bloom {
  /** Painted petals plus gold outline. */
  art: string;
  /** Petal outlines only, for foil light. */
  outline: string;
  /** Petal silhouettes, for masks and blind deboss. */
  silhouette: string;
}

/**
 * Frangipani: five thick petals in a pinwheel, a warm throat,
 * and a crease running down each petal.
 */
export function frangipani(
  uid: string,
  cx: number,
  cy: number,
  R: number,
  angle: number,
  pal: BloomPalette,
  gold = true,
): Bloom {
  const gid = `${uid}-fg${Math.round(cx)}x${Math.round(cy)}`;
  const paths: string[] = [];
  const veins: string[] = [];
  const twists: string[] = [];
  for (let i = 0; i < 5; i++) {
    const a = angle + (i * Math.PI * 2) / 5;
    const base: Pt = [cx + Math.cos(a - Math.PI / 2) * R * 0.04, cy + Math.sin(a - Math.PI / 2) * R * 0.04];
    const pts = place(petal(R, R * 0.66, 0.72, R * 0.2), base[0], base[1], a + 0.16);
    paths.push(smoothClosed(pts, 0.95));
    const vein: Pt[] = [
      [R * 0.02, -R * 0.12],
      [R * 0.1, -R * 0.42],
      [R * 0.17, -R * 0.68],
      [R * 0.19, -R * 0.8],
    ];
    veins.push(smoothOpen(place(vein, base[0], base[1], a + 0.16)));
    // Light across the petal's width suggests the twist of a thick petal.
    const [l, rr] = place([[-R * 0.36, -R * 0.55], [R * 0.4, -R * 0.62]], base[0], base[1], a + 0.16);
    twists.push(`<linearGradient id="${gid}t${i}" gradientUnits="userSpaceOnUse" x1="${l[0].toFixed(1)}" y1="${l[1].toFixed(1)}" x2="${rr[0].toFixed(1)}" y2="${rr[1].toFixed(1)}">
      <stop offset="0" stop-color="${pal.vein}" stop-opacity="0.28"/>
      <stop offset="0.45" stop-color="${pal.vein}" stop-opacity="0"/>
      <stop offset="0.7" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0.32"/>
    </linearGradient>`);
  }
  const art = `
  <defs>
    <radialGradient id="${gid}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${R}">
      <stop offset="0" stop-color="${pal.throat}"/>
      <stop offset="0.17" stop-color="${pal.throat}" stop-opacity="0.9"/>
      <stop offset="0.36" stop-color="${pal.mid}"/>
      <stop offset="0.72" stop-color="${pal.body}"/>
      <stop offset="1" stop-color="${pal.edge}"/>
    </radialGradient>
    ${twists.join('')}
  </defs>
  <g filter="url(#${uid}-wc)">
    ${paths
      .map(
        (d, i) =>
          `<path d="${d}" fill="url(#${gid})" stroke="${pal.vein}" stroke-opacity="0.18" stroke-width="${(R / 40).toFixed(2)}"/><path d="${d}" fill="url(#${gid}t${i})"/>`,
      )
      .join('')}
  </g>
  <g fill="none" stroke="${pal.vein}" stroke-opacity="0.38" stroke-width="${(R / 70).toFixed(2)}" stroke-linecap="round">
    ${veins.map((d) => `<path d="${d}"/>`).join('')}
  </g>
  ${
    gold
      ? `<g fill="none" stroke="url(#${uid}-gold)" stroke-width="${(R / 60).toFixed(2)}" stroke-linejoin="round">${paths
          .map((d) => `<path d="${d}"/>`)
          .join('')}</g>`
      : ''
  }
  <circle cx="${cx}" cy="${cy}" r="${(R * 0.07).toFixed(1)}" fill="${pal.throat}" opacity="0.9"/>`;
  const outline = paths.map((d) => `<path d="${d}" fill="none" stroke-width="${(R / 45).toFixed(2)}"/>`).join('');
  const silhouette = paths.map((d) => `<path d="${d}"/>`).join('');
  return { art, outline, silhouette };
}

/** Ruffled hibiscus petal fan from the centre outward. */
function hibiscusPetal(R: number, r: ReturnType<typeof rng>): Pt[] {
  const pts: Pt[] = [[0, 0]];
  const spread = 0.74;
  const steps = 9;
  const phase = r.range(0, 3);
  for (let i = 0; i <= steps; i++) {
    const t = -spread + (2 * spread * i) / steps;
    // Broad, softly waved edge: wide in the middle, tucked at the sides.
    const ruffle = (0.78 + 0.2 * Math.cos(t * 1.6)) * (1 + 0.045 * Math.sin(i * 1.3 + phase)) + r.range(-0.015, 0.015);
    pts.push([Math.sin(t) * R * ruffle, -Math.cos(t) * R * ruffle]);
  }
  return pts;
}

export interface Hibiscus extends Bloom {
  /** Glitter shapes: the petal rim and the pollen tip. */
  glitter: string;
  /** Glitter art drawn on the card. */
  glitterArt: string;
}

export function hibiscus(uid: string, cx: number, cy: number, R: number, angle: number, seed: number): Hibiscus {
  const r = rng(seed);
  const gid = `${uid}-hb${seed}`;
  const paths: string[] = [];
  for (let i = 0; i < 5; i++) {
    const a = angle + (i * Math.PI * 2) / 5 + r.range(-0.08, 0.08);
    paths.push(smoothClosed(place(hibiscusPetal(R * r.range(0.92, 1.04), r), cx, cy, a), 0.9));
  }
  // Staminal column curving out of the throat, ending in pollen dots.
  const ca = angle + r.range(-0.6, 0.6);
  const tip = rot([cx, cy - R * 0.78], ca, [cx, cy]);
  const mid = rot([cx + R * 0.08, cy - R * 0.4], ca, [cx, cy]);
  const column = smoothOpen([[cx, cy], mid, tip]);
  const pollen: string[] = [];
  for (let i = 0; i < 9; i++) {
    const pa = (i / 9) * Math.PI * 2;
    pollen.push(
      `<circle cx="${(tip[0] + Math.cos(pa) * R * 0.07).toFixed(1)}" cy="${(tip[1] + Math.sin(pa) * R * 0.07).toFixed(1)}" r="${(R * 0.035).toFixed(1)}"/>`,
    );
  }
  const veins = paths
    .map((_, i) => {
      const a = angle + (i * Math.PI * 2) / 5;
      const out = rot([cx, cy - R * 0.7], a, [cx, cy]);
      const m = rot([cx + R * 0.05, cy - R * 0.35], a, [cx, cy]);
      return `<path d="${smoothOpen([[cx, cy], m, out])}"/>`;
    })
    .join('');
  const art = `
  <defs>
    <radialGradient id="${gid}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${R}">
      <stop offset="0" stop-color="#8e1240"/>
      <stop offset="0.2" stop-color="#c22a5e"/>
      <stop offset="0.48" stop-color="#f287a6"/>
      <stop offset="0.86" stop-color="#f9c3d2"/>
      <stop offset="1" stop-color="#f3a1b9"/>
    </radialGradient>
  </defs>
  <g filter="url(#${uid}-wc)">${paths.map((d) => `<path d="${d}" fill="url(#${gid})"/>`).join('')}</g>
  <g fill="none" stroke="#a3204f" stroke-opacity="0.3" stroke-width="${(R / 55).toFixed(2)}" stroke-linecap="round">${veins}</g>
  <path d="${column}" fill="none" stroke="#e9a33a" stroke-width="${(R / 16).toFixed(1)}" stroke-linecap="round"/>`;
  const rim = paths.map((d) => `<path d="${d}" fill="none" stroke-width="${(R / 22).toFixed(1)}"/>`).join('');
  const glitterArt = `
    <g fill="none" stroke="#f8c1d0" stroke-width="${(R / 22).toFixed(1)}" stroke-linejoin="round" filter="url(#${uid}-gl)">
      ${paths.map((d) => `<path d="${d}"/>`).join('')}
    </g>
    <g fill="#f2c45c" filter="url(#${uid}-gl)">${pollen.join('')}</g>`;
  return {
    art,
    outline: paths.map((d) => `<path d="${d}" fill="none" stroke-width="${(R / 40).toFixed(2)}"/>`).join(''),
    silhouette: paths.map((d) => `<path d="${d}"/>`).join(''),
    glitter: rim + `<g>${pollen.join('')}</g>`,
    glitterArt,
  };
}

/** Closed hibiscus bud on a short stalk. */
export function bud(cx: number, cy: number, len: number, angle: number): { body: string; calyx: string } {
  const body = smoothClosed(
    place(
      [
        [0, 0],
        [len * 0.24, -len * 0.3],
        [len * 0.16, -len * 0.78],
        [0, -len],
        [-len * 0.16, -len * 0.76],
        [-len * 0.24, -len * 0.28],
      ],
      cx,
      cy,
      angle,
    ),
  );
  const calyx = smoothClosed(
    place(
      [
        [0, len * 0.08],
        [len * 0.28, -len * 0.1],
        [len * 0.14, -len * 0.38],
        [len * 0.05, -len * 0.2],
        [-len * 0.06, -len * 0.42],
        [-len * 0.16, -len * 0.18],
        [-len * 0.28, -len * 0.1],
      ],
      cx,
      cy,
      angle,
    ),
  );
  return { body, calyx };
}
