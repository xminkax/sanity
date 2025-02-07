export interface ColorHSL {
  h: number,
  s: number,
  l: number
}

export function getColorHSL(): ColorHSL {
  return {
    h: parseFloat(Math.random().toFixed(2)),
    s: parseFloat(((45 + 20 * Math.random()) / 100).toFixed(2)),
    l: parseFloat(((50 + 20 * Math.random()) / 100).toFixed(2)),
  };
}
