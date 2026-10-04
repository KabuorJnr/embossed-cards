import { describe, expect, it } from 'vitest';
import { designs } from '../src/card/designs';

describe('designs', () => {
  it('have unique ids', () => {
    const ids = designs.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // Every card on a page shares one id space, so a repeated SVG id would make
  // one layer borrow another layer's filter or gradient.
  it.each(designs.map((d) => [d.id, d] as const))('%s draws every layer with its own SVG ids', (_, d) => {
    const cover = d.cover({ uid: 'c1', cover: d.coverText?.default ?? '' });
    const inside = d.insideLeft({ uid: 'c1L', cover: '' });
    const art = [...cover, ...inside].map((l) => l.art + (l.sheen ?? '')).join('') + d.accent({ uid: 'c1x', cover: '' });
    const ids = [...art.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    for (const [, ref] of art.matchAll(/url\(#([^)]+)\)/g)) expect(ids).toContain(ref);
  });

  it.each(designs.filter((d) => d.coverText).map((d) => [d.id, d] as const))('%s escapes the cover words', (_, d) => {
    const art = d.cover({ uid: 'c2', cover: '<b>&"' }).map((l) => l.art).join('');
    // Designs may set the words in capitals, so compare without case.
    expect(art.toLowerCase()).not.toContain('<b>');
    expect(art.toLowerCase()).toContain('&lt;b&gt;&amp;');
  });
});
