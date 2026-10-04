import type { Design } from '../types';
import { acaciaDesign } from './acacia';
import { frangipaniDesign } from './frangipani';
import { hibiscusDesign } from './hibiscus';
import { kangaDesign } from './kanga';
import { letterpressDesign } from './letterpress';

export const designs: Design[] = [frangipaniDesign, hibiscusDesign, letterpressDesign, acaciaDesign, kangaDesign];
export const designById = (id: string) => designs.find((d) => d.id === id) ?? designs[0];
