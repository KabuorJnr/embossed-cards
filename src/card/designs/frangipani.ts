import { frangipani, PINK_FRANGIPANI } from '../flora';
import { rng, star, wobbleBand } from '../shapes';
import type { Design, Layer } from '../types';
import { cardClip, defs, sheet } from './common';

const W = 520;
const H = 520;
const PAPER = '#f1e3c1';
const TEAL = '#3c6f6b';

function stars(seed: number, count: number, avoid: [number, number, number][]) {
  const r = rng(seed);
  const out: { x: number; y: number; s: number; a: number }[] = [];
  let guard = 0;
  while (out.length < count && guard++ < 500) {
    const x = r.range(40, W - 40);
    const y = r.range(40, H - 40);
    const s = r.range(11, 21);
    if (avoid.some(([ax, ay, ar]) => Math.hypot(ax - x, ay - y) < ar + s)) continue;
    if (out.some((o) => Math.hypot(o.x - x, o.y - y) < o.s + s + 22)) continue;
    out.push({ x, y, s, a: r.range(-0.5, 0.5) });
  }
  return out;
}

export const frangipaniDesign: Design = {
  id: 'frangipani',
  name: 'Frangipani',
  blurb: 'Gold leaf stripes, glitter stars, raised frangipani',
  w: W,
  h: H,
  bleed: 96,
  defaultMessage: 'You make ordinary days feel like a garden in full bloom.',
  hand: 'caveat',
  inside: '#ead9b3',
  insert: '#fbf7ef',
  ink: '#2b2622',
  envelope: { body: '#efe2c3', liner: '#d9b25a', seal: '#b23a5c', ink: '#3a2c22' },

  cover({ uid }): Layer[] {
    const r = rng(11);
    const bands: string[] = [];
    for (let i = 0; i < 10; i++) {
      bands.push(wobbleBand(30 + i * 51 + r.range(-6, 6), -4, H + 4, r.range(13, 21), r));
    }
    const u0 = `${uid}a`;
    const base: Layer = {
      depth: 0,
      art: `${defs(u0, { paper: {}, gold: 'gold', leaf: true })}
        <defs>${cardClip(u0, W, H)}</defs>
        ${sheet(u0, W, H, PAPER)}
        <g clip-path="url(#${u0}-card)" fill="url(#${u0}-gold)" filter="url(#${u0}-leaf)">
          ${bands.map((d) => `<path d="${d}"/>`).join('')}
        </g>`,
      sheen: `<g clip-path="url(#${u0}-card)">${bands.map((d) => `<path d="${d}"/>`).join('')}</g>`,
      sheenTone: '#fff4cc',
    };

    const flowers: [number, number, number, number][] = [
      [420, 104, 128, 0.35],
      [104, 418, 138, -0.5],
    ];
    const list = stars(5, 15, flowers.map(([x, y, R]) => [x, y, R * 0.92]));
    const u1 = `${uid}b`;
    const starPaths = list.map((s) => star(s.x, s.y, s.s, -Math.PI / 2 + s.a));
    const starLayer: Layer = {
      depth: 7,
      art: `${defs(u1, { gold: 'gold', glitter: 4, lift: 0.5 })}
        <g filter="url(#${u1}-lift)">
          <g fill="${TEAL}" stroke="${TEAL}" stroke-width="7" stroke-linejoin="round">${starPaths.map((d) => `<path d="${d}"/>`).join('')}</g>
          <g fill="url(#${u1}-gold)" filter="url(#${u1}-gl)">${starPaths.map((d) => `<path d="${d}"/>`).join('')}</g>
        </g>`,
      glitter: starPaths.map((d) => `<path d="${d}"/>`).join(''),
    };

    const u2 = `${uid}c`;
    const blooms = flowers.map(([x, y, R, a]) => frangipani(u2, x, y, R, a, PINK_FRANGIPANI));
    const flowerLayer: Layer = {
      depth: 26,
      overhang: true,
      art: `${defs(u2, { gold: 'gold', wc: '#c94672', lift: 1.4 })}
        <g filter="url(#${u2}-lift)">${blooms.map((b) => `<g>${b.art}</g>`).join('')}</g>`,
      sheen: blooms.map((b) => b.outline).join(''),
      sheenTone: '#fff1d6',
    };
    return [base, starLayer, flowerLayer];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    const list = stars(21, 6, [[W / 2, H / 2, 40]]);
    const paths = list.map((s) => star(s.x, s.y, s.s * 1.1, -Math.PI / 2 + s.a));
    return [
      { depth: 0, art: `${defs(u, { paper: { relief: 0.55 } })}${sheet(u, W, H, this.inside)}` },
      {
        depth: 3,
        art: `${defs(`${u}s`, { gold: 'gold', glitter: 8, lift: 0.4 })}
          <g fill="url(#${u}s-gold)" filter="url(#${u}s-gl)">${paths.map((d) => `<path d="${d}"/>`).join('')}</g>`,
        glitter: paths.map((d) => `<path d="${d}"/>`).join(''),
      },
    ];
  },

  accent({ uid }) {
    return `${defs(`${uid}x`, { gold: 'gold', glitter: 2 })}
      <path d="${star(30, 30, 13)}" fill="url(#${uid}x-gold)" filter="url(#${uid}x-gl)"/>`;
  },
};
