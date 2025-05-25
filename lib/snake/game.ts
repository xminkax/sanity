export function calculateTotalScore(levelNumber: number) {
  return Math.floor(3 * levelNumber + 0.8 * levelNumber ** 2);
}

export function generateFoodPosition(
  canvasWidth: number,
  canvasHeight: number,
  unitSize: number,
  snake: { x: number; y: number }[],
): {
  x: number;
  y: number;
} {
  const pos = {
    x: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize,
    y: Math.floor(Math.random() * (canvasHeight / unitSize)) * unitSize,
  };
  if (snake && snake.some((unit) => pos.x === unit.x && pos.y === unit.y)) {
    return generateFoodPosition(canvasWidth, canvasHeight, unitSize, snake);
  }
  return pos;
}

export function parseScreensConfig(value: string) {
  return parseInt(value, 10);
}

type Direction = { x: number; y: number };

export function isOppositeDirection(val1: Direction, val2: Direction): boolean {
  if (val1.x < 0 && val2.x === 0 && val2.y === 0) {
    return true; //can't start left
  }
  if ((val1.x < 0 && val2.x > 0) || (val1.x > 0 && val2.x < 0)) {
    return true;
  }
  return (val1.y < 0 && val2.y > 0) || (val1.y > 0 && val2.y < 0);
}

export function isWin(counter: number, level: number): boolean {
  return counter === calculateTotalScore(level);
}
