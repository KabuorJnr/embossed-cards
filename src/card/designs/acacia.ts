import { blob, rng, smoothOpen, sparkle, star, type Pt } from '../shapes';
import type { Design, Layer } from '../types';
import { cardClip, defs } from './common';

const W = 520;
const H = 520;

function hill(y: number, amp: number, waves: number, phase: number): string {
  const pts: Pt[] = [];
  for (let i = 0; i <= 12; i++) {
    const x = -20 + (i * (W + 40)) / 12;
    pts.push([x, y + Math.sin((i / 12) * Math.PI * waves + phase) * amp + Math.sin(i * 1.7 + phase) * amp * 0.25]);
  }
  return `${smoothOpen(pts)} L${W + 20},${H + 20} L-20,${H + 20}Z`;
}

/** Giraffe in profile, standing on (x, y), facing left. */
function giraffe(x: number, y: number, s: number): string {
  const p = (px: number, py: number) => `${(x + px * s).toFixed(1)},${(y + py * s).toFixed(1)}`;
  const leg = (lx: number, lean: number) =>
    `M${p(lx, -46)} L${p(lx + 4, -46)} L${p(lx + 3.2 + lean, 0)} L${p(lx + 0.6 + lean, 0)}Z`;
  return [
    `M${p(-2, -50)} C${p(4, -64)} ${p(36, -66)} ${p(50, -56)} C${p(54, -48)} ${p(46, -40)} ${p(38, -42)} L${p(6, -42)} C${p(0, -42)} ${p(-4, -46)} ${p(-2, -50)}Z`,
    leg(2, -2),
    leg(9, 1),
    leg(36, 1),
    leg(42, 3),
    `M${p(-1, -50)} L${p(9, -57)} L${p(-6, -112)} L${p(-13, -110)}Z`,
    `M${p(-13, -108)} C${p(-16, -116)} ${p(-6, -118)} ${p(-4, -113)} L${p(-20, -103)} C${p(-24, -103)} ${p(-24, -107)} ${p(-21, -108)}Z`,
    `M${p(-9, -116)} L${p(-8, -122)} L${p(-6.6, -122)} L${p(-7, -115)}Z`,
    `M${p(49, -55)} L${p(55, -30)} L${p(53, -30)} L${p(47, -52)}Z`,
  ].join(' ');
}

function acacia(x: number, y: number, s: number, seed: number) {
  const r = rng(seed);
  const trunk = smoothOpen([
    [x, y],
    [x + 4 * s, y - 60 * s],
    [x + 2 * s, y - 110 * s],
  ]);
  const branches = [
    smoothOpen([[x + 2 * s, y - 100 * s], [x - 40 * s, y - 140 * s], [x - 78 * s, y - 158 * s]]),
    smoothOpen([[x + 3 * s, y - 100 * s], [x + 44 * s, y - 138 * s], [x + 86 * s, y - 160 * s]]),
    smoothOpen([[x + 2 * s, y - 108 * s], [x + 6 * s, y - 140 * s], [x - 4 * s, y - 166 * s]]),
  ];
  const canopy = [
    blob(x, y - 170 * s, 120 * s, 20 * s, r, 12, 0.12),
    blob(x - 70 * s, y - 160 * s, 60 * s, 14 * s, r, 10, 0.15),
    blob(x + 74 * s, y - 162 * s, 66 * s, 15 * s, r, 10, 0.15),
    blob(x + 6 * s, y - 186 * s, 80 * s, 13 * s, r, 10, 0.15),
  ];
  return { trunk, branches, canopy };
}

export const acaciaDesign: Design = {
  id: 'acacia',
  name: 'Acacia dusk',
  blurb: 'Layered paper savannah, gold leaf sun, giraffes at sunset',
  w: W,
  h: H,
  bleed: 30,
  defaultMessage: 'However far apart we are, we still share the same sunset.',
  hand: 'caveat',
  inside: '#3a2238',
  insert: '#fbf6ee',
  ink: '#2d1b2c',
  envelope: { body: '#ecc7b2', liner: '#3a2238', seal: '#b4486c', ink: '#3a2238' },

  cover({ uid }): Layer[] {
    const u0 = `${uid}a`;
    const r = rng(17);
    const glints: string[] = [];
    for (let i = 0; i < 11; i++) glints.push(sparkle(r.range(30, 300), r.range(26, 150), r.range(3, 7.5)));
    const sun = `<circle cx="352" cy="232" r="64"/>`;
    const birds = [
      [262, 150, 1],
      [286, 136, 0.8],
      [300, 162, 0.7],
    ]
      .map(([bx, by, k]) => `<path d="M${bx - 9 * k},${by - 3 * k} Q${bx - 4 * k},${by - 6 * k} ${bx},${by} Q${bx + 4 * k},${by - 6 * k} ${bx + 9 * k},${by - 3 * k}"/>`)
      .join('');
    const sky: Layer = {
      depth: 0,
      art: `${defs(u0, { paper: { relief: 0.7 }, gold: 'gold', leaf: true, glitter: 12 })}
        <defs>
          <linearGradient id="${u0}-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#f4b56c"/><stop offset="0.5" stop-color="#ec8460"/><stop offset="1" stop-color="#bb4d69"/>
          </linearGradient>
        </defs>
        <rect width="${W}" height="${H}" fill="url(#${u0}-sky)" filter="url(#${u0}-paper)"/>
        <g fill="url(#${u0}-gold)" filter="url(#${u0}-leaf)">${sun}</g>
        <g fill="#fdf1dc" filter="url(#${u0}-gl)">${glints.map((d) => `<path d="${d}"/>`).join('')}</g>
        <g fill="none" stroke="#5a2b47" stroke-width="2.2" stroke-linecap="round">${birds}</g>`,
      sheen: sun,
      sheenTone: '#fff2c4',
      glitter: glints.map((d) => `<path d="${d}"/>`).join(''),
    };

    const ridge = (id: string, depth: number, y: number, amp: number, waves: number, phase: number, fill: string, extra = '', lift = 0.8): Layer => {
      const u = `${uid}${id}`;
      return {
        depth,
        art: `${defs(u, { paper: { relief: 0.6, seed: depth }, lift })}<defs>${cardClip(u, W, H)}</defs>
          <g clip-path="url(#${u}-card)"><g filter="url(#${u}-lift)">
            <g fill="${fill}" filter="url(#${u}-paper)"><path d="${hill(y, amp, waves, phase)}"/>${extra}</g>
          </g></g>`,
      };
    };

    const tree = acacia(150, 470, 1, 5);
    const front = `<path d="${tree.trunk}" fill="none" stroke="#2b1730" stroke-width="11" stroke-linecap="round"/>
      ${tree.branches.map((d) => `<path d="${d}" fill="none" stroke="#2b1730" stroke-width="6.5" stroke-linecap="round"/>`).join('')}
      ${tree.canopy.map((d) => `<path d="${d}"/>`).join('')}`;
    const grass = Array.from({ length: 18 }, (_, i) => {
      const gx = 20 + i * 29 + ((i * 37) % 11);
      const gy = 452 + Math.sin(i) * 5;
      return `<path d="M${gx},${gy + 8} q-3,-14 -7,-18 M${gx},${gy + 8} q1,-16 3,-22 M${gx},${gy + 8} q4,-12 9,-15" fill="none" stroke="#2b1730" stroke-width="1.8" stroke-linecap="round"/>`;
    }).join('');

    return [
      sky,
      ridge('b', 7, 352, 16, 2.2, 0.4, '#d77273'),
      ridge('c', 15, 404, 14, 1.6, 2.2, '#8f3d62', `<path d="${giraffe(372, 400, 0.95)}"/><path d="${giraffe(424, 404, 0.72)}"/>`, 1),
      {
        ...ridge('d', 27, 452, 9, 1.3, 1.1, '#2b1730', `${front}${grass}`, 1.4),
      },
    ];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    const r = rng(44);
    const glints: string[] = [];
    for (let i = 0; i < 16; i++) {
      const x = r.range(40, W - 40);
      const y = r.range(40, H - 40);
      glints.push(i % 3 ? sparkle(x, y, r.range(3, 7)) : star(x, y, r.range(4, 7)));
    }
    const moon = `<path d="M150,140 a46,46 0 1,0 52,58 a38,38 0 1,1 -52,-58Z"/>`;
    return [
      { depth: 0, art: `${defs(u, { paper: { relief: 0.5 } })}<rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>` },
      {
        depth: 3,
        art: `${defs(`${u}s`, { gold: 'silver', glitter: 3 })}
          <g fill="url(#${u}s-gold)" filter="url(#${u}s-gl)">${glints.map((d) => `<path d="${d}"/>`).join('')}${moon}</g>`,
        glitter: glints.map((d) => `<path d="${d}"/>`).join('') + moon,
        sheen: moon,
        sheenTone: '#ffffff',
      },
    ];
  },

  accent({ uid }) {
    return `${defs(`${uid}x`, { gold: 'gold', leaf: true })}
      <circle cx="30" cy="30" r="12" fill="url(#${uid}x-gold)" filter="url(#${uid}x-leaf)"/>`;
  },
};
