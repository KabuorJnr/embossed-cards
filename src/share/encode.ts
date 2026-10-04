import type { HandId } from '../card/types';

/** Everything a card needs, small enough to live inside a link. */
export interface CardState {
  /** Design id. */
  d: string;
  /** Cover words. */
  c: string;
  /** Message inside. */
  m: string;
  /** Handwriting. */
  h: HandId;
  /** Recipient name. */
  t: string;
  /** Sign off. */
  f: string;
}

export const LIMITS = { c: 40, m: 400, t: 40, f: 60 } as const;
const HANDS: HandId[] = ['caveat', 'pinyon', 'bodoni'];

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

const hasStreams = () => typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const body = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(body).arrayBuffer());
}

/** Keep only known fields, trimmed to their limits. */
export function clean(input: Partial<CardState>, knownDesigns: string[]): CardState {
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
  const d = typeof input.d === 'string' && knownDesigns.includes(input.d) ? input.d : knownDesigns[0];
  const h = HANDS.includes(input.h as HandId) ? (input.h as HandId) : 'caveat';
  return { d, h, c: str(input.c, LIMITS.c), m: str(input.m, LIMITS.m), t: str(input.t, LIMITS.t), f: str(input.f, LIMITS.f) };
}

/** Card state to a compact, URL safe string. `z` = deflated, `j` = plain. */
export async function encodeCard(state: CardState): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(state));
  if (hasStreams()) {
    try {
      return 'z' + toBase64Url(await pipe(json, new CompressionStream('deflate-raw')));
    } catch {
      /* fall through to plain encoding */
    }
  }
  return 'j' + toBase64Url(json);
}

export async function decodeCard(code: string, knownDesigns: string[]): Promise<CardState | null> {
  try {
    const kind = code[0];
    let bytes = fromBase64Url(code.slice(1));
    if (kind === 'z') {
      if (!hasStreams()) return null;
      bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
    } else if (kind !== 'j') return null;
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== 'object') return null;
    return clean(parsed, knownDesigns);
  } catch {
    return null;
  }
}

/** Link to the envelope page for this card. The card lives after the #, so it never reaches a server. */
export function cardLink(code: string, from: string = location.href): string {
  const url = new URL('open.html', from);
  url.search = '';
  url.hash = code;
  return url.toString();
}
