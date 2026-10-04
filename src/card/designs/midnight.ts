import { escapeXml, rng, sparkle, star, type Pt } from '../shapes';
import type { Design, Layer } from '../types';
import { cardClip, defs, wrapWords } from './common';

const W = 520;
const H = 520;
const INDIGO = '#151a4a';

const f = (n: number) => n.toFixed(1);

/** Crescent: a disc with a slightly smaller, offset disc taken out of it. */
function crescent(cx: number, cy: number, R: number): string {
  const dx = R * 0.44;
  const dy = -R * 0.26;
  const r2 = R * 0.86;
  const d = Math.hypot(dx, dy);
  const ux = dx / d;
  const uy = dy / d;
  const a = (R * R - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(R * R - a * a);
  const p1: Pt = [cx + a * ux - h * uy, cy + a * uy + h * ux];
  const p2: Pt = [cx + a * ux + h * uy, cy + a * uy - h * ux];
  return `M${f(p1[0])},${f(p1[1])} A${R},${R} 0 1,1 ${f(p2[0])},${f(p2[1])} A${r2},${r2} 0 1,0 ${f(p1[0])},${f(p1[1])}Z`;
}

interface Constellation {
  stars: [number, number, number][];
  lines: [number, number][];
}

const DIPPER: Constellation = {
  stars: [
    [58, 92, 6],
    [104, 80, 7],
    [148, 98, 6],
    [184, 128, 8],
    [196, 180, 7],
    [256, 186, 9],
    [252, 132, 7],
  ],
  lines: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 3],
  ],
};

const HUNTER: Constellation = {
  stars: [
    [78, 250, 8],
    [146, 238, 7],
    [98, 292, 5],
    [113, 297, 5.5],
    [128, 302, 5],
    [82, 352, 7],
    [158, 344, 9],
  ],
  lines: [
    [0, 2],
    [1, 4],
    [2, 3],
    [3, 4],
    [2, 5],
    [4, 6],
  ],
};

function drawConstellation(c: Constellation) {
  const lines = c.lines.map(([a, b]) => `M${c.stars[a][0]},${c.stars[a][1]} L${c.stars[b][0]},${c.stars[b][1]}`).join(' ');
  const points = c.stars.map(([x, y, r]) => `<path d="${sparkle(x, y, r)}"/>`).join('');
  return { lines, points };
}

/** A bank of cloud: overlapping discs standing on a flat base. */
function cloudBank(bumps: [number, number, number][], base: number) {
  const discs = bumps.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
  const xs = bumps.map(([x, , r]) => [x - r, x + r]).flat();
  const foot = `<rect x="${Math.min(...xs)}" y="${base}" width="${Math.max(...xs) - Math.min(...xs)}" height="${H + 60 - base}"/>`;
  return discs + foot;
}

/** Clouds may drift past the sides of the card, never below it. */
const aboveFoot = (id: string) => `<clipPath id="${id}"><rect x="-200" y="-200" width="${W + 400}" height="${H + 200}"/></clipPath>`;

function words(text: string) {
  const lines = wrapWords(text.toUpperCase(), 18, 2);
  const size = lines.some((l) => l.length > 13) ? 20 : 25;
  const mid = 386;
  return lines
    .map(
      (l, i) =>
        `<text x="${W / 2 + 40}" y="${f(mid + (i - (lines.length - 1) / 2) * (size + 10) + size * 0.36)}" text-anchor="middle" font-family="Marcellus, serif" font-size="${size}" letter-spacing="${f(size * 0.26)}">${escapeXml(l)}</text>`,
    )
    .join('');
}

export const midnightDesign: Design = {
  id: 'midnight',
  name: 'Midnight',
  blurb: 'Holographic foil moon, silver constellations, layered paper clouds',
  w: W,
  h: H,
  bleed: 50,
  coverText: { default: 'Over the moon', max: 30, label: 'Words under the stars' },
  defaultMessage: 'I love you to the moon, and all the way back again.',
  hand: 'caveat',
  inside: '#1d2358',
  insert: '#f8f7fb',
  ink: '#1b2058',
  envelope: { body: '#e4e6f2', liner: '#1b2058', seal: '#2c3478', ink: '#1b2058' },
  confetti: ['#c3e6f4', '#f4c9e4', '#f8f0c8', '#ffffff', '#cfc0f2'],

  cover({ uid, cover }): Layer[] {
    const u0 = `${uid}a`;
    const r = rng(71);
    const dust: string[] = [];
    for (let i = 0; i < 70; i++) {
      const x = r.range(10, W - 10);
      const y = r.range(10, 420);
      if (Math.hypot(x - 372, y - 150) < 110) continue;
      dust.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r.range(0.7, 1.9))}"/>`);
    }
    const glints = Array.from({ length: 9 }, () => sparkle(r.range(220, 500), r.range(250, 330), r.range(3, 6)));
    const dipper = drawConstellation(DIPPER);
    const hunter = drawConstellation(HUNTER);
    const moon = crescent(372, 150, 94);
    const text = words(cover || ' ');
    const sky: Layer = {
      depth: 0,
      art: `${defs(u0, { paper: { grain: 0.85, relief: 0.6, seed: 72 }, gold: 'holo', leaf: true, glitter: 9, deboss: { depth: 1, light: 0.25, dark: 0.6 } })}
        <defs>
          <linearGradient id="${u0}-sky" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stop-color="#0b0f33"/><stop offset="0.55" stop-color="${INDIGO}"/><stop offset="1" stop-color="#3a2d6e"/>
          </linearGradient>
          <linearGradient id="${u0}-silver" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#9aa0b4"/><stop offset="0.5" stop-color="#f4f6fb"/><stop offset="1" stop-color="#a4aabd"/>
          </linearGradient>
        </defs>
        <rect width="${W}" height="${H}" fill="url(#${u0}-sky)" filter="url(#${u0}-paper)"/>
        <g fill="#cfd4ee" opacity="0.85">${dust.join('')}</g>
        <g fill="none" stroke="url(#${u0}-silver)" stroke-width="1.3" stroke-dasharray="1 4" stroke-linecap="round">
          <path d="${dipper.lines}"/><path d="${hunter.lines}"/>
        </g>
        <g fill="url(#${u0}-silver)" filter="url(#${u0}-gl)">${dipper.points}${hunter.points}${glints.map((d) => `<path d="${d}"/>`).join('')}</g>
        <path d="${moon}" fill="url(#${u0}-gold)" filter="url(#${u0}-leaf)"/>
        <g filter="url(#${u0}-deb)" fill="#2b3170">${text}</g>
        <g fill="url(#${u0}-silver)">${text}</g>`,
      sheen: `<path d="${moon}"/><g>${text}</g>`,
      sheenTone: 'holo',
      glitter: `${dipper.points}${hunter.points}${glints.map((d) => `<path d="${d}"/>`).join('')}`,
    };

    const u1 = `${uid}b`;
    const back = cloudBank(
      [
        [-10, 470, 52],
        [70, 452, 48],
        [150, 470, 40],
        [300, 466, 46],
        [380, 444, 58],
        [470, 458, 50],
        [540, 474, 42],
      ],
      462,
    );
    const backClouds: Layer = {
      depth: 10,
      art: `${defs(u1, { paper: { relief: 0.7, seed: 73 }, lift: 0.9 })}<defs>${cardClip(u1, W, H)}</defs>
        <g clip-path="url(#${u1}-card)"><g filter="url(#${u1}-lift)"><g fill="#4b4f93" filter="url(#${u1}-paper)">${back}</g></g></g>`,
    };

    const u2 = `${uid}c`;
    const front = cloudBank(
      [
        [-30, 500, 46],
        [40, 486, 44],
        [112, 492, 36],
        [200, 500, 40],
        [262, 488, 34],
        [420, 498, 44],
        [496, 482, 40],
        [556, 500, 36],
      ],
      496,
    );
    const frontClouds: Layer = {
      depth: 20,
      overhang: true,
      art: `${defs(u2, { paper: { relief: 0.8, seed: 74 }, lift: 1.3 })}
        <defs><linearGradient id="${u2}-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#a4aabd"/><stop offset="0.5" stop-color="#f6f7fb"/><stop offset="1" stop-color="#a4aabd"/>
        </linearGradient>${aboveFoot(`${u2}-foot`)}</defs>
        <g clip-path="url(#${u2}-foot)"><g filter="url(#${u2}-lift)">
          <g fill="none" stroke="url(#${u2}-edge)" stroke-width="5">${front}</g>
          <g fill="#8d92d2" filter="url(#${u2}-paper)">${front}</g>
        </g></g>`,
      // Only the outer rim catches the light, not the discs hidden inside the cloud.
      sheen: `<mask id="${u2}-rim" maskUnits="userSpaceOnUse" x="-200" y="-200" width="${W + 400}" height="${H + 400}">
          <rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#fff"/><g fill="#000" stroke="none">${front}</g>
        </mask>
        <g clip-path="url(#${u2}-foot)" mask="url(#${u2}-rim)" fill="none" stroke-width="5">${front}</g>`,
      sheenTone: '#ffffff',
    };

    const u3 = `${uid}d`;
    const head: Pt = [440, 318];
    const tail: Pt = [300, 268];
    const len = Math.hypot(head[0] - tail[0], head[1] - tail[1]);
    const nx = -(head[1] - tail[1]) / len;
    const ny = (head[0] - tail[0]) / len;
    const trail = `M${tail[0]},${tail[1]} L${f(head[0] + nx * 9)},${f(head[1] + ny * 9)} L${f(head[0] - nx * 9)},${f(head[1] - ny * 9)}Z`;
    const starHead = star(head[0], head[1], 16, -Math.PI / 2 + 0.3);
    const shooting: Layer = {
      depth: 28,
      art: `${defs(u3, { gold: 'holo', glitter: 15, lift: 0.6 })}
        <defs><linearGradient id="${u3}-trail" gradientUnits="userSpaceOnUse" x1="${tail[0]}" y1="${tail[1]}" x2="${head[0]}" y2="${head[1]}">
          <stop offset="0" stop-color="#f4c9e4" stop-opacity="0"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.95"/>
        </linearGradient></defs>
        <path d="${trail}" fill="url(#${u3}-trail)" filter="url(#${u3}-gl)"/>
        <g filter="url(#${u3}-lift)"><path d="${starHead}" fill="url(#${u3}-gold)" filter="url(#${u3}-gl)"/></g>`,
      glitter: `<path d="${trail}"/><path d="${starHead}"/>`,
      sheen: `<path d="${starHead}"/>`,
      sheenTone: 'holo',
    };
    return [sky, backClouds, frontClouds, shooting];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    const r = rng(75);
    const glints: string[] = [];
    for (let i = 0; i < 22; i++) {
      const x = r.range(30, W - 30);
      const y = r.range(30, H - 30);
      glints.push(i % 4 ? sparkle(x, y, r.range(2.5, 6)) : star(x, y, r.range(4, 6.5)));
    }
    const moon = crescent(150, 150, 30);
    return [
      { depth: 0, art: `${defs(u, { paper: { relief: 0.5, seed: 76 } })}<rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>` },
      {
        depth: 3,
        art: `${defs(`${u}s`, { gold: 'holo', glitter: 5 })}
          <g fill="url(#${u}s-gold)" filter="url(#${u}s-gl)">${glints.map((d) => `<path d="${d}"/>`).join('')}<path d="${moon}"/></g>`,
        glitter: glints.map((d) => `<path d="${d}"/>`).join(''),
        sheen: `<path d="${moon}"/>`,
        sheenTone: 'holo',
      },
    ];
  },

  accent({ uid }) {
    return `${defs(`${uid}x`, { gold: 'holo' })}<path d="${crescent(30, 30, 18)}" fill="url(#${uid}x-gold)" stroke="#8d88c4" stroke-width="0.9"/>`;
  },
};
