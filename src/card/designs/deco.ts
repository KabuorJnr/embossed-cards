import { escapeXml, type Pt } from '../shapes';
import type { Design, Layer } from '../types';
import { defs, wrapWords } from './common';

const W = 440;
const H = 600;
const EMERALD = '#0f3d34';
const DEEP = '#0a2a24';

/** The window in the raised frame: a tall arch over the sunburst. */
const ARCH = { x0: 110, x1: 330, top: 104, base: 404 };
const archR = (ARCH.x1 - ARCH.x0) / 2;
const archCx = (ARCH.x0 + ARCH.x1) / 2;
const archCy = ARCH.top + archR;

function arch(grow: number): string {
  const r = archR + grow;
  return `M${archCx - r},${ARCH.base + grow} L${archCx - r},${archCy} A${r},${r} 0 0 1 ${archCx + r},${archCy} L${archCx + r},${ARCH.base + grow}Z`;
}

/** Rectangle with square steps cut from each corner, the signature deco frame. */
function stepped(inset: number, step: number): string {
  const x0 = inset;
  const y0 = inset;
  const x1 = W - inset;
  const y1 = H - inset;
  const s = step;
  const pts: Pt[] = [
    [x0 + s, y0],
    [x1 - s, y0],
    [x1 - s, y0 + s],
    [x1, y0 + s],
    [x1, y1 - s],
    [x1 - s, y1 - s],
    [x1 - s, y1],
    [x0 + s, y1],
    [x0 + s, y1 - s],
    [x0, y1 - s],
    [x0, y0 + s],
    [x0 + s, y0 + s],
  ];
  return `M${pts.map(([x, y]) => `${x},${y}`).join(' L')}Z`;
}

/** Fan of rays rising from a point, alternate rays only so the paper shows between. */
function rays(cx: number, cy: number, len: number, count: number, inner = 52): string {
  const out: string[] = [];
  for (let i = 0; i < count; i += 2) {
    const a0 = Math.PI + (i / count) * Math.PI;
    const a1 = Math.PI + ((i + 1) / count) * Math.PI;
    const p = (a: number, r: number) => `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
    out.push(`M${p(a0, inner)} L${p(a0, len)} L${p(a1, len)} L${p(a1, inner)}Z`);
  }
  return out.join(' ');
}

const diamond = (x: number, y: number, rx: number, ry: number) => `M${x},${y - ry} L${x + rx},${y} L${x},${y + ry} L${x - rx},${y}Z`;

/** Fine diagonal lattice, pressed blind into the frame. */
const lattice = (id: string, stroke: string) => `
  <pattern id="${id}" patternUnits="userSpaceOnUse" width="30" height="30">
    <path d="M-2,-2 L32,32 M32,-2 L-2,32" stroke="${stroke}" stroke-width="1.1" fill="none"/>
    <path d="${diamond(15, 15, 2.6, 4)}" fill="${stroke}"/>
  </pattern>`;

function words(text: string) {
  const lines = wrapWords(text.toUpperCase(), 16, 2);
  const size = lines.some((l) => l.length > 12) ? 22 : 27;
  const mid = 478;
  return lines
    .map(
      (l, i) =>
        `<text x="${W / 2}" y="${(mid + (i - (lines.length - 1) / 2) * (size + 12) + size * 0.36).toFixed(1)}" text-anchor="middle" font-family="Marcellus, serif" font-size="${size}" letter-spacing="${(size * 0.24).toFixed(1)}">${escapeXml(l)}</text>`,
    )
    .join('');
}

export const decoDesign: Design = {
  id: 'deco',
  name: 'Deco',
  blurb: 'Emerald card, raised arch frame, gold leaf sunburst and a pressed lattice',
  w: W,
  h: H,
  bleed: 30,
  coverText: { default: 'Congratulations', max: 30, label: 'Words under the arch' },
  defaultMessage: 'Here is to you, and to everything still ahead. Raise a glass tonight.',
  hand: 'bodoni',
  inside: '#e7dfcb',
  insert: '#fbf8f0',
  ink: '#14322c',
  envelope: { body: '#ece4d0', liner: EMERALD, seal: '#1f5b4b', ink: '#14322c' },
  confetti: ['#d9b25a', '#f3d98d', '#1f5b4b', '#efe4c8'],

  cover({ uid, cover }): Layer[] {
    const u0 = `${uid}a`;
    const sun = { x: archCx, y: ARCH.base };
    const fan = rays(sun.x, sun.y, 330, 26);
    const rings = [44, 34, 24].map((r) => `M${sun.x - r},${sun.y} A${r},${r} 0 0 1 ${sun.x + r},${sun.y}`).join(' ');
    const back: Layer = {
      depth: 0,
      art: `${defs(u0, { paper: { grain: 0.8, relief: 0.8, seed: 51 }, gold: 'gold', leaf: true })}
        <defs>
          <radialGradient id="${u0}-glow" gradientUnits="userSpaceOnUse" cx="${sun.x}" cy="${sun.y}" r="320">
            <stop offset="0" stop-color="#1d6a5a"/><stop offset="0.6" stop-color="${EMERALD}"/><stop offset="1" stop-color="${DEEP}"/>
          </radialGradient>
          <clipPath id="${u0}-win"><path d="${arch(6)}"/></clipPath>
        </defs>
        <rect width="${W}" height="${H}" fill="url(#${u0}-glow)" filter="url(#${u0}-paper)"/>
        <g clip-path="url(#${u0}-win)" fill="url(#${u0}-gold)" filter="url(#${u0}-leaf)">
          <path d="${fan}"/>
          <path d="M${sun.x - 46},${sun.y} A46,46 0 0 1 ${sun.x + 46},${sun.y}Z"/>
        </g>
        <path d="${rings}" fill="none" stroke="${DEEP}" stroke-width="2.4" clip-path="url(#${u0}-win)"/>`,
      sheen: `<g clip-path="url(#${u0}-win)"><path d="${fan}"/></g>`,
      sheenTone: '#fff3c9',
    };

    const u1 = `${uid}b`;
    const text = words(cover || ' ');
    const outer = stepped(18, 22);
    const inner = stepped(27, 16);
    const pillars = [-14, -22, -30]
      .flatMap((d) => [ARCH.x0 + d, ARCH.x1 - d])
      .map((x) => `M${x},${archCy + 10} L${x},${ARCH.base + 8}`)
      .join(' ');
    const studs = [diamond(W / 2 - 150, 478, 6, 9), diamond(W / 2 + 150, 478, 6, 9)];
    const frame: Layer = {
      depth: 11,
      art: `${defs(u1, { paper: { grain: 0.8, relief: 0.9, seed: 52 }, gold: 'gold', lift: 1.1, deboss: { depth: 1.1, light: 0.22, dark: 0.55 } })}
        <defs>${lattice(`${u1}-lat`, EMERALD)}</defs>
        <g filter="url(#${u1}-lift)">
          <path d="M0,0 H${W} V${H} H0Z ${arch(0)}" fill-rule="evenodd" fill="${EMERALD}" filter="url(#${u1}-paper)"/>
        </g>
        <g filter="url(#${u1}-deb)">
          <path d="M0,0 H${W} V${H} H0Z ${arch(20)}" fill-rule="evenodd" fill="url(#${u1}-lat)"/>
        </g>
        <g fill="none" stroke="url(#${u1}-gold)">
          <path d="${outer}" stroke-width="3"/>
          <path d="${inner}" stroke-width="1.3"/>
          <path d="${arch(1)}" stroke-width="3.2"/>
          <path d="${arch(10)}" stroke-width="1.2"/>
          <path d="${pillars}" stroke-width="1.3"/>
          <path d="M${W / 2 - 120},${ARCH.base + 30} H${W / 2 + 120}" stroke-width="1.3"/>
        </g>
        <g fill="url(#${u1}-gold)">${studs.map((d) => `<path d="${d}"/>`).join('')}</g>
        <g filter="url(#${u1}-deb)" fill="#b48a3c">${text}</g>
        <g fill="url(#${u1}-gold)">${text}</g>`,
      sheen: `<g fill="none" stroke-width="3"><path d="${outer}"/><path d="${arch(1)}"/></g><g>${text}</g>${studs.map((d) => `<path d="${d}"/>`).join('')}`,
      sheenTone: '#fff3c9',
    };

    const u2 = `${uid}c`;
    const key = [diamond(archCx, ARCH.top - 10, 13, 20), diamond(archCx, ARCH.top - 10, 6, 10)];
    const keystone: Layer = {
      depth: 20,
      art: `${defs(u2, { gold: 'gold', glitter: 7, lift: 0.7 })}
        <g filter="url(#${u2}-lift)">
          <path d="${key[0]}" fill="url(#${u2}-gold)" filter="url(#${u2}-gl)"/>
          <path d="${key[1]}" fill="${DEEP}"/>
        </g>`,
      glitter: `<path d="${key[0]}"/>`,
    };
    return [back, frame, keystone];
  },

  insideLeft({ uid }): Layer[] {
    const u = `${uid}i`;
    const frame = stepped(26, 18);
    return [
      {
        depth: 0,
        art: `${defs(u, { paper: { relief: 0.6, seed: 53 }, gold: 'gold', deboss: { depth: 0.9, light: 0.75, dark: 0.18 } })}
          <defs>${lattice(`${u}-lat`, this.inside)}</defs>
          <rect width="${W}" height="${H}" fill="${this.inside}" filter="url(#${u}-paper)"/>
          <g filter="url(#${u}-deb)"><rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="url(#${u}-lat)"/></g>
          <path d="${frame}" fill="none" stroke="url(#${u}-gold)" stroke-width="2"/>`,
        sheen: `<path d="${frame}" fill="none" stroke-width="2"/>`,
        sheenTone: '#fff3c9',
      },
    ];
  },

  accent({ uid }) {
    return `${defs(`${uid}x`, { gold: 'gold' })}
      <path d="${rays(30, 44, 28, 10, 10)}" fill="url(#${uid}x-gold)"/>
      <path d="M22,44 A8,8 0 0 1 38,44Z" fill="url(#${uid}x-gold)"/>`;
  },
};
