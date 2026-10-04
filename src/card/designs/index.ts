import type { Design } from '../types';
import { acaciaDesign } from './acacia';
import { beadworkDesign } from './beadwork';
import { decoDesign } from './deco';
import { frangipaniDesign } from './frangipani';
import { hibiscusDesign } from './hibiscus';
import { holoDesign } from './holo';
import { kangaDesign } from './kanga';
import { letterpressDesign } from './letterpress';
import { monogramDesign } from './monogram';
import { paperBloomDesign } from './paperbloom';

// What drifts out of the envelope for the original five.
frangipaniDesign.confetti = { kind: 'petal', colors: ['#f6a7b8', '#fde6e4', '#e0628a', '#f4bb3a'] };
hibiscusDesign.confetti = { kind: 'petal', colors: ['#f287a6', '#f9c3d2', '#c22a5e', '#b5132f'] };
letterpressDesign.confetti = { kind: 'flake', colors: ['#f3d98d', '#d9b25a', '#f4b8c3', '#ecd08a'] };
acaciaDesign.confetti = { kind: 'star', colors: ['#f3d98d', '#fdf1dc', '#ec8460', '#d9b25a'] };
kangaDesign.confetti = { kind: 'flake', colors: ['#e2a52b', '#15888a', '#f6eedd', '#d9b25a'] };

export const designs: Design[] = [
  frangipaniDesign,
  holoDesign,
  paperBloomDesign,
  hibiscusDesign,
  monogramDesign,
  letterpressDesign,
  decoDesign,
  acaciaDesign,
  beadworkDesign,
  kangaDesign,
];
export const designById = (id: string) => designs.find((d) => d.id === id) ?? designs[0];
