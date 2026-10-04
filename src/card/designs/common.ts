import {
  debossFilter,
  embossFilter,
  type FoilTone,
  glitterFilter,
  goldGradient,
  goldLeafFilter,
  liftFilter,
  paperFilter,
  watercolorFilter,
} from '../filters';

export interface DefsOptions {
  paper?: { grain?: number; relief?: number; seed?: number };
  gold?: FoilTone;
  leaf?: boolean;
  glitter?: number;
  wc?: string;
  lift?: number;
  emboss?: { depth?: number; light?: number; dark?: number };
  deboss?: { depth?: number; light?: number; dark?: number };
}

/**
 * Standard filter and gradient set for one layer. Every id is prefixed with
 * the layer's uid: `${u}-paper`, `${u}-gold`, `${u}-leaf`, `${u}-gl`,
 * `${u}-wc`, `${u}-lift`, `${u}-emb`, `${u}-deb`.
 */
export function defs(u: string, o: DefsOptions): string {
  const out: string[] = [];
  if (o.paper) out.push(paperFilter(`${u}-paper`, o.paper.grain, o.paper.relief, o.paper.seed));
  if (o.gold) out.push(goldGradient(`${u}-gold`, o.gold));
  if (o.leaf) out.push(goldLeafFilter(`${u}-leaf`));
  if (o.glitter !== undefined) out.push(glitterFilter(`${u}-gl`, o.glitter));
  if (o.wc) out.push(watercolorFilter(`${u}-wc`, o.wc));
  if (o.lift) out.push(liftFilter(`${u}-lift`, o.lift));
  if (o.emboss) out.push(embossFilter(`${u}-emb`, o.emboss.depth, o.emboss.light, o.emboss.dark));
  if (o.deboss) out.push(debossFilter(`${u}-deb`, o.deboss.depth, o.deboss.light, o.deboss.dark));
  return `<defs>${out.join('')}</defs>`;
}

/** Clip path for the card rectangle. */
export const cardClip = (u: string, w: number, h: number) =>
  `<clipPath id="${u}-card"><rect x="0" y="0" width="${w}" height="${h}"/></clipPath>`;

/** Plain sheet of paper the size of the card. */
export const sheet = (u: string, w: number, h: number, fill: string) =>
  `<rect x="0" y="0" width="${w}" height="${h}" fill="${fill}" filter="url(#${u}-paper)"/>`;

/** Wrap cover words into at most `maxLines` lines of roughly `perLine` characters. */
export function wrapWords(text: string, perLine: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > perLine && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const head = lines.slice(0, maxLines - 1);
    head.push(lines.slice(maxLines - 1).join(' '));
    return head;
  }
  return lines;
}
