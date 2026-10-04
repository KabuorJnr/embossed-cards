import { escapeXml, place, rng, smoothClosed, smoothOpen, type Pt } from '../shapes';
import type { Design, Layer } from '../types';
import { defs, wrapWords } from './common';

const W = 460;
const H = 600;
const BLUSH = '#f2d3c6';

const f = (n: number) => n.toFixed(1);

/** Heart shaped leaf outline in leaf space: stalk at the origin, tip at (0, -1). */
const OUTLINE: Pt[] = [
  [0, -1],
  [0.36, -0.9],
  [0.56, -0.66],
  [0.62, -0.34],
  [0.52, -0.02],
  [0.3, 0.19],
  [0.1, 0.14],
  [0, 0.05],
  [-0.1, 0.14],
  [-0.3, 0.19],
  [-0.52, -0.02],
  [-0.62, -0.34],
  [-0.56, -0.66],
  [-0.36, -0.9],
];

/** Slits fan out from the midrib and cut clean through the margin. */
const SLITS = [0.16, 0.34, 0.52, 0.7];

interface Monstera {
  /** Leaf with its slits and holes cut out (evenodd). */
  body: string;
  /** Mask cut outs for the leaf. */
  cuts: string;
  /** Midrib and side veins, for gold foil. */
  veins: string;
}

function monstera(x: number, y: number, len: number, angle: number, mirror = false): Monstera {
  const L = len;
  const sx = mirror ? -1 : 1;
  const at = (pts: Pt[]) => place(pts.map(([px, py]) => [px * L * sx, py * L] as Pt), x, y, angle);
  const body = smoothClosed(at(OUTLINE), 0.95);
  const cuts: string[] = [];
  const veins: string[] = [smoothOpen(at([[0, 0.04], [0.02, -0.4], [0, -0.96]]))];
  for (const side of [1, -1]) {
    SLITS.forEach((s, i) => {
      const lean = 0.18 + i * 0.05;
      const inner: Pt = [side * 0.13, -s];
      const outer: Pt = [side * 0.9, -s - lean];
      const wIn = 0.012;
      const wOut = 0.05 + i * 0.006;
      cuts.push(
        smoothClosed(
          at([
            [inner[0], inner[1] - wIn],
            [outer[0], outer[1] - wOut],
            [outer[0], outer[1] + wOut],
            [inner[0], inner[1] + wIn],
          ]),
          0.2,
        ),
      );
      // A small window near the rib, between the slits.
      if (i < 3) {
        const hx = side * 0.2;
        const hy = -s - 0.1;
        cuts.push(smoothClosed(at([[hx, hy - 0.035], [hx + side * 0.05, hy], [hx, hy + 0.035], [hx - side * 0.025, hy]]), 1));
      }
      veins.push(smoothOpen(at([[side * 0.02, -s + 0.1], [side * 0.3, -s - 0.02], [side * 0.52, -s - 0.1]])));
    });
  }
  return { body, cuts: cuts.map((d) => `<path d="${d}"/>`).join(''), veins: veins.map((d) => `<path d="${d}"/>`).join('') };
}

/** A leaf from where its stalk meets the card edge to where its tip points. */
type Spec = [bx: number, by: number, tx: number, ty: number, mirror?: boolean];

function leafLayer(u: string, depth: number, specs: Spec[], light: string, dark: string, lift: number, gold: boolean): Layer {
  const leaves = specs.map(([bx, by, tx, ty, m]) => monstera(bx, by, Math.hypot(tx - bx, ty - by), Math.atan2(tx - bx, by - ty), m));
  return {
    depth,
    overhang: true,
    art: `${defs(u, { paper: { relief: 0.9, seed: depth + 80 }, gold: 'gold', lift })}
      <defs>
        <linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
        ${leaves
          .map(
            (lf, i) =>
              `<mask id="${u}-m${i}" maskUnits="userSpaceOnUse" x="-200" y="-200" width="${W + 400}" height="${H + 400}"><path d="${lf.body}" fill="#fff"/><g fill="#000">${lf.cuts}</g></mask>`,
          )
          .join('')}
      </defs>
      <g filter="url(#${u}-lift)">
        ${leaves
          .map(
            (lf, i) => `<g mask="url(#${u}-m${i})">
              <path d="${lf.body}" fill="url(#${u}-g)" filter="url(#${u}-paper)"/>
              <g fill="none" stroke="${gold ? `url(#${u}-gold)` : dark}" stroke-width="${gold ? 2.4 : 2}" stroke-linecap="round" opacity="${gold ? 1 : 0.5}">${lf.veins}</g>
            </g>`,
          )
          .join('')}
      </g>`,
    sheen: gold ? `<g fill="none" stroke-width="2.6">${leaves.map((lf) => lf.veins).join('')}</g>` : undefined,
    sheenTone: '#fff1c4',
  };
}

const SUN = { x: 230, y: 300, r: 96 };
const ring = (r: number) => `M${SUN.x - r},${SUN.y} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0Z`;

function words(text: string) {
  const lines = wrapWords(text.toUpperCase(), 10, 2);
  const size = lines.some((l) => l.length > 8) ? 19 : 23;
  return lines
    .map(
      (l, i) =>
        `<text x="${SUN.x}" y="${f(SUN.y + (i - (lines.length - 1) / 2) * (size + 8) + size * 0.36)}" text-anchor="middle" font-family="Marcellus, serif" font-size="${size}" letter-spacing="${f(size * 0.2)}">${escapeXml(l)}</text>`,
    )
    .join('');
}

export const monsteraDesign: Design = {
  id: 'monstera',
  name: 'Monstera',
  blurb: 'Layered paper monstera leaves, gold foil veins, cut past the edge',
  w: W,
  h: H,
  bleed: 110,
  coverText: { default: 'Hello sunshine', max: 24, label: 'Words on the sun' },
  defaultMessage: 'Keep growing, keep reaching for the light. I am so proud of you.',
  hand: 'caveat',
  inside: '#eedfd5',
  insert: '#fdf8f3',
  ink: '#22352a',
  envelope: { body: '#f6e8df', liner: '#2c5a43', seal: '#b0573f', ink: '#2c3d33' },
  confetti: ['#2c5a43', '#5f9a68', '#9cc68a', '#d9b25a', '#f2d3c6'],

  cover({ uid, cover }): Layer[] {
    const u0 = `${uid}a`;
    const r = rng(81);
    const flecks: string[] = [];
    for (let i = 0; i < 26; i++) {
      const a = r.range(0, Math.PI * 2);
      const d = r.range(SUN.r + 14, SUN.r + 70);
      const x = SUN.x + Math.cos(a) * d;
      const y = SUN.y + Math.sin(a) * d * 1.15;
      const s = r.range(2, 6);
      flecks.push(smoothClosed([[x, y - s], [x + s * 0.9, y - s * 0.2], [x + s * 0.4, y + s], [x - s * 0.8, y + s * 0.5], [x - s, y - s * 0.4]], 0.6));
    }
    const sun = `<circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.r}"/>`;
    const text = words(cover || ' ');
    const base: Layer = {
      depth: 0,
      art: `${defs(u0, { paper: { grain: 0.8, relief: 0.9, seed: 82 }, gold: 'gold', leaf: true, deboss: { depth: 1.2, light: 0.5, dark: 0.5 } })}
        <rect width="${W}" height="${H}" fill="${BLUSH}" filter="url(#${u0}-paper)"/>
        <g fill="url(#${u0}-gold)" filter="url(#${u0}-leaf)">${sun}${flecks.map((d) => `<path d="${d}"/>`).join('')}</g>
        <g filter="url(#${u0}-deb)" fill="#173a29">${text}</g>`,
      // Light runs round the rim of the sun so the words pressed into it stay dark.
      sheen: `<path fill-rule="evenodd" d="${ring(SUN.r)} ${ring(SUN.r - 26)}"/>${flecks.map((d) => `<path d="${d}"/>`).join('')}`,
      sheenTone: '#fff3cc',
    };
    return [
      base,
      leafLayer(
        `${uid}b`,
        8,
        [
          [-40, -20, 120, 170],
          [500, 620, 330, 445, true],
          [510, 40, 372, 150, true],
          [-50, 470, 82, 420],
        ],
        '#2f6b4c',
        '#173a29',
        0.9,
        false,
      ),
      leafLayer(
        `${uid}c`,
        18,
        [
          [-50, 230, 96, 236],
          [520, 470, 380, 400, true],
          [70, 660, 136, 506],
          [280, -70, 300, 66, true],
        ],
        '#4c8b5d',
        '#24573a',
        1.2,
        true,
      ),
      leafLayer(
        `${uid}d`,
        30,
        [
          [40, -60, 104, 84],
          [430, 660, 330, 536, true],
          [520, 250, 400, 236, true],
        ],
        '#7cb36f',
        '#3c7a4c',
        1.5,
        true,
      ),
    ];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    const r = rng(83);
    const flecks: string[] = [];
    for (let i = 0; i < 14; i++) {
      const x = r.range(60, W - 60);
      const y = r.range(60, H - 60);
      const s = r.range(2, 5);
      flecks.push(smoothClosed([[x, y - s], [x + s, y], [x, y + s], [x - s, y]], 0.6));
    }
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 0.55, seed: 84 }, gold: 'gold', leaf: true })}
          <rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>
          <g fill="url(#${u}-gold)" filter="url(#${u}-leaf)">${flecks.map((d) => `<path d="${d}"/>`).join('')}</g>`,
        sheen: flecks.map((d) => `<path d="${d}"/>`).join(''),
        sheenTone: '#fff3cc',
      },
    ];
  },

  accent({ uid }) {
    const lf = monstera(30, 50, 44, 0.25);
    return `<defs><mask id="${uid}x-m" maskUnits="userSpaceOnUse" x="0" y="0" width="60" height="60"><path d="${lf.body}" fill="#fff"/><g fill="#000">${lf.cuts}</g></mask></defs>
      <path d="${lf.body}" fill="#3c7a4c" mask="url(#${uid}x-m)"/>`;
  },
};
