export type EmUnit = string;
export type FontWeight = string;
export type BoxShadow = string;
export type TransparentColor = 'transparent';
export type HexColor = `#${string}`;
export type HexColorString = HexColor;
export type HslaColorString = `hsl(${string})` | `hsla(${string})`;
export type RgbaColorString = `rgb(${string})` | `rgba(${string})`;
export type ColorString = HexColorString | HslaColorString | RgbaColorString;

export type BuiltInColors = 'black' | 'blue' | 'red' | 'green' | 'grey' | 'white' | 'yellow';

export type HslaColor = {
  h: number;
  s: number;
  l: number;
  a?: number;
};

export type RgbaColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type Color = string | HexColor | HslaColor | RgbaColor | TransparentColor;
