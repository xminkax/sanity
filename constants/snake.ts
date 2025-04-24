export enum GameState {
  START = "start",
  PLAYING = "playing",
  GAME_OVER = "game_over",
  NEXT_LEVEL = "next_level",
}

export function calculateTotalScore(levelNumber: number) {
  return Math.floor(3 * levelNumber + 0.8 * levelNumber ** 2);
}
export const MOBILE_SIZE_CANCAS = 640;
