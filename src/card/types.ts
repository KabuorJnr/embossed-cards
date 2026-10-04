export type HandId = 'caveat' | 'pinyon' | 'bodoni';
export type ConfettiKind = 'petal' | 'star' | 'flake' | 'bead';

/** One sheet of material on a card face. Layers stack and lift toward the viewer. */
export interface Layer {
  /** SVG markup (defs and shapes) drawn in the design's coordinate space. */
  art: string;
  /** How far the sheet sits above the card, in design units. Drives parallax. */
  depth: number;
  /** Shapes that catch moving light like foil. Fill and stroke are supplied by the viewer. */
  sheen?: string;
  /** Highlight colour for the moving foil light. */
  sheenTone?: string;
  /** Shapes that twinkle like glitter as the card moves. */
  glitter?: string;
  /** Die cut that extends past the card edge and shows through on the inside. */
  overhang?: boolean;
}

export interface RenderOptions {
  /** Unique prefix for SVG ids so several cards can share a page. */
  uid: string;
  /** Words printed on the cover, for designs that carry them. */
  cover: string;
}

export interface Design {
  id: string;
  name: string;
  /** One line for the design picker, describing the materials. */
  blurb: string;
  w: number;
  h: number;
  /** Extra drawing room around the card for die cuts that overhang the edge. */
  bleed: number;
  coverText?: { default: string; max: number; label: string };
  defaultMessage: string;
  hand: HandId;
  /** Colour of the paper on the inside of the card. */
  inside: string;
  /** Colour of the writing insert. */
  insert: string;
  /** Ink colour for the handwritten message. */
  ink: string;
  envelope: { body: string; liner: string; seal: string; ink: string };
  /** What drifts down when the card is first opened. */
  confetti?: { kind: ConfettiKind; colors: string[] };
  cover(o: RenderOptions): Layer[];
  insideLeft(o: RenderOptions): Layer[];
  /** Small motif printed under the message, drawn in a 60 x 60 box. */
  accent(o: RenderOptions): string;
}
