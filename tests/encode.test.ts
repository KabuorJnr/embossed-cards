import { describe, expect, it } from 'vitest';
import { clean, decodeCard, encodeCard, type CardState } from '../src/share/encode';

const known = ['frangipani', 'hibiscus', 'letterpress', 'acacia', 'kanga'];
const card: CardState = {
  d: 'kanga',
  c: 'Mapenzi ni kikohozi',
  m: 'Some things cannot be hidden.\nThe way I feel about you is one of them. 💛',
  h: 'pinyon',
  t: 'Amani',
  f: 'With love, Rooney',
};

describe('card links', () => {
  it('round trips a card through the compressed encoding', async () => {
    const code = await encodeCard(card);
    expect(code[0]).toBe('z');
    expect(code).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(await decodeCard(code, known)).toEqual(card);
  });

  it('reads the plain fallback encoding', async () => {
    const json = btoa(unescape(encodeURIComponent(JSON.stringify(card))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(await decodeCard('j' + json, known)).toEqual(card);
  });

  it('rejects broken links instead of throwing', async () => {
    expect(await decodeCard('zNOTREAL', known)).toBeNull();
    expect(await decodeCard('', known)).toBeNull();
    expect(await decodeCard('q123', known)).toBeNull();
  });

  it('drops unknown fields and trims long text', () => {
    const out = clean({ ...card, d: 'nope', h: 'comic' as never, m: 'x'.repeat(900), extra: 1 } as never, known);
    expect(out.d).toBe('frangipani');
    expect(out.h).toBe('caveat');
    expect(out.m.length).toBe(400);
    expect(Object.keys(out).sort()).toEqual(['c', 'd', 'f', 'h', 'm', 't']);
  });
});
