// import { Color } from "three";

export interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export type Color = { r: number; g: number; b: number };
export function generatePastelColor(): ColorHSL {
  return {
    h: parseFloat(Math.random().toFixed(2)),
    s: parseFloat(((45 + 20 * Math.random()) / 100).toFixed(2)),
    l: parseFloat(((40 + 20 * Math.random()) / 100).toFixed(2)),
  };
}

export function generateSimilarShadeColorForText(colorHSL: ColorHSL): ColorHSL {
  return { ...colorHSL, s: colorHSL.s + 0.1 };
}

export function generateSimilarShadeColorForParticles(color: Color, variation = 0.3): Color {
  // Clamp helper to keep values within 0–1
  function clamp(val: number): number {
    return Math.min(1, Math.max(0, val));
  }

  // Slightly vary each RGB component
  const r = clamp(color.r + (Math.random() - 0.5) * variation);
  const g = clamp(color.g + (Math.random() - 0.5) * variation);
  const b = clamp(color.b + (Math.random() - 0.5) * variation);

  // Return a new THREE.Color with the tweaked values
  return { r, g, b };
}
