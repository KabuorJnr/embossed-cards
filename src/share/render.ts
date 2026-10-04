import marcellusUrl from '@fontsource/marcellus/files/marcellus-latin-400-normal.woff2?url';
import type { CardContent } from '../card/viewer';
import type { Design, Layer } from '../card/types';

const NS = 'http://www.w3.org/2000/svg';
let thumbCount = 0;
let marcellusData: Promise<string> | null = null;

/** The cover face's font, inlined so standalone SVG images render the words correctly. */
function marcellusFace(): Promise<string> {
  marcellusData ??= fetch(marcellusUrl)
    .then((r) => r.blob())
    .then(
      (b) =>
        new Promise<string>((res) => {
          const fr = new FileReader();
          fr.onload = () => res(String(fr.result));
          fr.readAsDataURL(b);
        }),
    )
    .then((data) => `@font-face{font-family:Marcellus;src:url(${data}) format('woff2');}`)
    .catch(() => '');
  return marcellusData;
}

/** Flatten a stack of layers into one standalone SVG. */
export function flatten(design: Design, layers: Layer[], fontCss = ''): string {
  const { w, h, bleed: b } = design;
  const vb = `${-b} ${-b} ${w + 2 * b} ${h + 2 * b}`;
  const body = layers.map((l) => `<svg x="${-b}" y="${-b}" width="${w + 2 * b}" height="${h + 2 * b}" viewBox="${vb}">${l.art}</svg>`).join('');
  return `<svg xmlns="${NS}" viewBox="${vb}" width="${w + 2 * b}" height="${h + 2 * b}">${fontCss ? `<style>${fontCss}</style>` : ''}${body}</svg>`;
}

const toDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** Cover artwork as an image URL, for thumbnails and the envelope. */
export async function coverImage(design: Design, cover: string): Promise<string> {
  const layers = design.cover({ uid: `t${++thumbCount}`, cover });
  const font = design.coverText ? await marcellusFace() : '';
  return toDataUrl(flatten(design, layers, font));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

const HAND_FONT: Record<CardContent['hand'], { css: (px: number) => string; scale: number }> = {
  caveat: { css: (px) => `500 ${px}px Caveat`, scale: 1 },
  pinyon: { css: (px) => `400 ${px}px "Pinyon Script"`, scale: 0.86 },
  bodoni: { css: (px) => `italic 400 ${px}px "Bodoni Moda"`, scale: 0.72 },
};

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const out: string[] = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > max && line) {
        out.push(line);
        line = word;
      } else line = next;
    }
    out.push(line);
  }
  return out;
}

/**
 * Picture of the card: cover on the left, the handwritten page on the right.
 * Made for sharing to a status or saving to the camera roll.
 */
export async function cardPicture(design: Design, content: CardContent): Promise<Blob> {
  const k = 2;
  const { w, h, bleed: b } = design;
  const m = 56;
  const gap = 64;
  const cw = b + m + w + gap + w + m + b;
  const ch = h + 2 * b + 2 * m;
  const canvas = document.createElement('canvas');
  canvas.width = cw * k;
  canvas.height = ch * k;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(k, k);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, cw, ch);

  const coverX = m + b;
  const pageX = coverX + w + gap;
  const top = m + b;

  const hand = HAND_FONT[content.hand];
  await Promise.all([document.fonts.load(hand.css(40)), document.fonts.load('400 20px "Hanken Grotesk"')]);

  const font = design.coverText ? await marcellusFace() : '';
  const coverSvg = flatten(design, design.cover({ uid: `x${++thumbCount}`, cover: content.cover }), font);
  const pageSvg = flatten(design, [
    {
      depth: 0,
      art: `<rect width="${w}" height="${h}" fill="${design.inside}"/>
        <rect x="${w * 0.055}" y="${h * 0.045}" width="${w * 0.89}" height="${h * 0.91}" fill="${design.insert}"/>`,
    },
  ]);
  const accentSvg = `<svg xmlns="${NS}" viewBox="0 0 60 60" width="120" height="120">${design.accent({ uid: `a${thumbCount}`, cover: content.cover })}</svg>`;
  const [coverImg, pageImg, accentImg] = await Promise.all([
    loadImage(toDataUrl(coverSvg)),
    loadImage(toDataUrl(pageSvg)),
    loadImage(toDataUrl(accentSvg)),
  ]);

  const shadow = (x: number) => {
    ctx.save();
    ctx.shadowColor = 'rgba(40,30,20,0.26)';
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, top, w, h);
    ctx.restore();
  };
  shadow(pageX);
  ctx.drawImage(pageImg, pageX - b, top - b, w + 2 * b, h + 2 * b);
  shadow(coverX);
  ctx.drawImage(coverImg, coverX - b, top - b, w + 2 * b, h + 2 * b);

  // Handwriting, laid out like the open card.
  const insX = pageX + w * 0.055;
  const insW = w * 0.89;
  const pad = insW * 0.1;
  const len = content.message.length;
  const msgScale = len < 40 ? 1.12 : len < 80 ? 1 : len < 140 ? 0.86 : len < 220 ? 0.74 : len < 320 ? 0.64 : 0.56;
  const msgPx = 40 * msgScale * hand.scale;
  const sidePx = 32 * hand.scale;
  ctx.fillStyle = design.ink;
  ctx.textBaseline = 'alphabetic';
  ctx.font = hand.css(msgPx);
  const lines = wrap(ctx, content.message, insW - pad * 2);
  const lineH = msgPx * 1.24;
  const blocks = (content.to ? sidePx * 1.4 : 0) + lines.length * lineH + (content.from ? sidePx * 1.6 : 0) + 60;
  let y = top + h / 2 - blocks / 2;
  if (content.to) {
    ctx.font = hand.css(sidePx);
    ctx.textAlign = 'left';
    y += sidePx;
    ctx.fillText(`${content.to},`, insX + pad, y);
    y += sidePx * 0.4;
  }
  ctx.font = hand.css(msgPx);
  ctx.textAlign = 'center';
  for (const line of lines) {
    y += lineH;
    ctx.fillText(line, pageX + w / 2, y);
  }
  if (content.from) {
    ctx.font = hand.css(sidePx);
    ctx.textAlign = 'right';
    y += sidePx * 1.6;
    ctx.fillText(content.from, insX + insW - pad, y);
  }
  ctx.drawImage(accentImg, pageX + w / 2 - 23, y + 14, 46, 46);

  ctx.font = '400 13px "Hanken Grotesk", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#9a948b';
  ctx.fillText('Pressed with Embossed', cw - 24, ch - 20);

  return new Promise((res, rej) => canvas.toBlob((bl) => (bl ? res(bl) : rej(new Error('Could not draw the card'))), 'image/png'));
}
