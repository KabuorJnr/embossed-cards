import type { Design } from '../types';
import { acaciaDesign } from './acacia';
import { decoDesign } from './deco';
import { frangipaniDesign } from './frangipani';
import { hibiscusDesign } from './hibiscus';
import { kangaDesign } from './kanga';
import { laceDesign } from './lace';
import { letterpressDesign } from './letterpress';
import { midnightDesign } from './midnight';
import { monsteraDesign } from './monstera';

export const designs: Design[] = [
  frangipaniDesign,
  decoDesign,
  hibiscusDesign,
  midnightDesign,
  letterpressDesign,
  monsteraDesign,
  acaciaDesign,
  laceDesign,
  kangaDesign,
];
export const designById = (id: string) => designs.find((d) => d.id === id) ?? designs[0];
