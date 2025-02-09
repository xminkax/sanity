import {Color} from 'three';

export interface ColorHSL {
  h: number,
  s: number,
  l: number
}

export interface Position {
  x: number,
  y: number,
  z: number
}

export function generatePastelColor(): ColorHSL {
  return {
    h: parseFloat(Math.random().toFixed(2)),
    s: parseFloat(((45 + 20 * Math.random()) / 100).toFixed(2)),
    l: parseFloat(((50 + 20 * Math.random()) / 100).toFixed(2)),
  };
}

export function generateSimilarShadeColorForText(colorHSL: ColorHSL) {
  return {...colorHSL, s: colorHSL.s + 0.1};
}

export function generateSimilarShadeColorForParticles(color: Color): Color {
  return {r: color.r - 0.4 + Math.random() * 0.4, g: color.g, b: color.b} as Color;
}
