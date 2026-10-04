/**
 * SVG filter recipes for real-paper materials. Each takes an id so a page can
 * hold several cards without filter id collisions.
 * Lighting is static (top left), the moving light is painted by sheen overlays.
 */

/** Cotton or card stock grain with soft directional relief. */
export const paperFilter = (id: string, grain = 0.9, relief = 0.85, seed = 7) => `
<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="${grain}" numOctaves="3" seed="${seed}" result="n"/>
  <feDiffuseLighting in="n" surfaceScale="${relief}" diffuseConstant="1.16" lighting-color="#fff" result="l">
    <feDistantLight azimuth="235" elevation="58"/>
  </feDiffuseLighting>
  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="${seed + 3}" result="m"/>
  <feColorMatrix in="m" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.9 0.5" result="mottle"/>
  <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.1" k2="0" k3="0" k4="0" result="t"/>
  <feComposite in="mottle" in2="t" operator="arithmetic" k2="0.07" k3="1" result="t2"/>
  <feComposite in="t2" in2="SourceAlpha" operator="in"/>
</filter>`;

/** Crinkled metal leaf: wobbly edges, creases and a bright specular. */
export const goldLeafFilter = (id: string, seed = 3, displace = 3.2) => `
<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.03 0.05" numOctaves="3" seed="${seed}" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="${displace}" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.06 0.11" numOctaves="3" seed="${seed + 6}" result="c"/>
  <feDiffuseLighting in="c" surfaceScale="1.6" diffuseConstant="1.08" lighting-color="#fff" result="dl">
    <feDistantLight azimuth="225" elevation="48"/>
  </feDiffuseLighting>
  <feComposite in="d" in2="dl" operator="arithmetic" k1="1.22" result="shaded"/>
  <feSpecularLighting in="c" surfaceScale="1.9" specularConstant="0.95" specularExponent="20" lighting-color="#fff4d2" result="s">
    <feDistantLight azimuth="225" elevation="40"/>
  </feSpecularLighting>
  <feComposite in="s" in2="d" operator="in" result="si"/>
  <feComposite in="shaded" in2="si" operator="arithmetic" k2="1" k3="0.6" result="lit"/>
  <feComposite in="lit" in2="d" operator="in"/>
</filter>`;

/** Fine glitter: bright flakes, dark flakes and a granular edge. */
export const glitterFilter = (id: string, seed = 4) => `
<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="${seed}" result="g"/>
  <feDisplacementMap in="SourceGraphic" in2="g" scale="2.2" xChannelSelector="R" yChannelSelector="B" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency="1.7" numOctaves="1" seed="${seed + 2}" result="n1"/>
  <feColorMatrix in="n1" type="matrix" values="0 0 0 0 1  0 0 0 0 0.97  0 0 0 0 0.86  9 0 0 0 -5.6" result="bright"/>
  <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="${seed + 9}" result="n2"/>
  <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  7 0 0 0 -3.9" result="dark"/>
  <feComposite in="dark" in2="d" operator="in" result="darkIn"/>
  <feComposite in="bright" in2="d" operator="in" result="brightIn"/>
  <feTurbulence type="turbulence" baseFrequency="0.5" numOctaves="1" seed="${seed + 5}" result="b"/>
  <feSpecularLighting in="b" surfaceScale="1.4" specularConstant="0.6" specularExponent="26" lighting-color="#fff6dc" result="sp">
    <feDistantLight azimuth="225" elevation="45"/>
  </feSpecularLighting>
  <feComposite in="sp" in2="d" operator="in" result="spIn"/>
  <feMerge>
    <feMergeNode in="d"/>
    <feMergeNode in="darkIn"/>
    <feMergeNode in="spIn"/>
    <feMergeNode in="brightIn"/>
  </feMerge>
</filter>`;

/** Watercolour: mottled pigment with darker pooling at the edges. */
export const watercolorFilter = (id: string, edge = '#b23a5c', seed = 2, pool = 0.42) => `
<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="${seed}" result="n"/>
  <feColorMatrix in="n" type="saturate" values="0" result="g"/>
  <feComponentTransfer in="g" result="gm">
    <feFuncR type="linear" slope="0.42" intercept="0.74"/>
    <feFuncG type="linear" slope="0.42" intercept="0.74"/>
    <feFuncB type="linear" slope="0.42" intercept="0.74"/>
  </feComponentTransfer>
  <feBlend in="SourceGraphic" in2="gm" mode="multiply" result="m"/>
  <feComposite in="m" in2="SourceAlpha" operator="in" result="body"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="ab"/>
  <feComposite in="SourceAlpha" in2="ab" operator="arithmetic" k2="1" k3="-1" result="ring"/>
  <feFlood flood-color="${edge}" flood-opacity="${pool}"/>
  <feComposite in2="ring" operator="in" result="pool"/>
  <feMerge><feMergeNode in="body"/><feMergeNode in="pool"/></feMerge>
</filter>`;

/** Cut paper lifted off the card: contact shadow plus a soft cast shadow. */
export const liftFilter = (id: string, height = 1) => `
<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
  <feGaussianBlur in="SourceAlpha" stdDeviation="${1.1 * height}"/>
  <feOffset dx="${0.6 * height}" dy="${1.4 * height}" result="c"/>
  <feFlood flood-color="#2b1d12" flood-opacity="0.32"/>
  <feComposite in2="c" operator="in" result="contact"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="${4.5 * height}"/>
  <feOffset dx="${2.5 * height}" dy="${6 * height}" result="cast"/>
  <feFlood flood-color="#2b1d12" flood-opacity="0.22"/>
  <feComposite in2="cast" operator="in" result="castC"/>
  <feMerge><feMergeNode in="castC"/><feMergeNode in="contact"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>`;

/** Blind emboss: the shape rises out of the paper in the paper's own colour. */
export const embossFilter = (id: string, depth = 1.6, light = 0.85, dark = 0.3) => `
<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
  <feOffset in="SourceAlpha" dx="${depth}" dy="${depth}" result="o1"/>
  <feComposite in="SourceAlpha" in2="o1" operator="out" result="e1"/>
  <feGaussianBlur in="e1" stdDeviation="${depth * 0.55}" result="b1"/>
  <feFlood flood-color="#fff" flood-opacity="${light}"/>
  <feComposite in2="b1" operator="in" result="hi"/>
  <feOffset in="SourceAlpha" dx="${-depth}" dy="${-depth}" result="o2"/>
  <feComposite in="SourceAlpha" in2="o2" operator="out" result="e2"/>
  <feGaussianBlur in="e2" stdDeviation="${depth * 0.55}" result="b2"/>
  <feFlood flood-color="#000" flood-opacity="${dark}"/>
  <feComposite in2="b2" operator="in" result="sh"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="${depth}"/>
  <feOffset dx="${depth * 0.7}" dy="${depth}" result="c"/>
  <feComposite in="c" in2="SourceAlpha" operator="out" result="co"/>
  <feFlood flood-color="#000" flood-opacity="${dark * 0.55}"/>
  <feComposite in2="co" operator="in" result="cast"/>
  <feMerge><feMergeNode in="cast"/><feMergeNode in="SourceGraphic"/><feMergeNode in="sh"/><feMergeNode in="hi"/></feMerge>
</filter>`;

/** Letterpress deboss: the shape is pressed into the paper. */
export const debossFilter = (id: string, depth = 1.4, light = 0.7, dark = 0.34) => `
<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
  <feOffset in="SourceAlpha" dx="${depth}" dy="${depth}" result="o1"/>
  <feComposite in="SourceAlpha" in2="o1" operator="out" result="e1"/>
  <feGaussianBlur in="e1" stdDeviation="${depth * 0.6}" result="b1"/>
  <feFlood flood-color="#000" flood-opacity="${dark}"/>
  <feComposite in2="b1" operator="in" result="sh"/>
  <feOffset in="SourceAlpha" dx="${-depth}" dy="${-depth}" result="o2"/>
  <feComposite in="SourceAlpha" in2="o2" operator="out" result="e2"/>
  <feGaussianBlur in="e2" stdDeviation="${depth * 0.6}" result="b2"/>
  <feFlood flood-color="#fff" flood-opacity="${light}"/>
  <feComposite in2="b2" operator="in" result="hi"/>
  <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="sh"/><feMergeNode in="hi"/></feMerge>
</filter>`;

/** Gold gradient used as the base colour of foil and leaf. */
export const goldGradient = (id: string, tone: 'gold' | 'rose' | 'silver' = 'gold') => {
  const stops = {
    gold: ['#7d5a1c', '#d9b25a', '#a97b26', '#f3d98d', '#b98a32', '#ecd08a', '#8c661f'],
    rose: ['#8a4d45', '#e3a796', '#b06e61', '#f6cfc2', '#c08274', '#f0bfb0', '#93574c'],
    silver: ['#6f747c', '#d9dde3', '#9aa0a8', '#f5f7fa', '#a9afb7', '#e6e9ee', '#7b8189'],
  }[tone];
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">${stops
    .map((c, i) => `<stop offset="${(i / (stops.length - 1)).toFixed(3)}" stop-color="${c}"/>`)
    .join('')}</linearGradient>`;
};
