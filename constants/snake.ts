export enum GameState {
  START = "start",
  PLAYING = "playing",
  GAME_OVER = "game_over",
  NEXT_LEVEL = "next_level",
}

export function calculateTotalScore(levelNumber: number) {
  if (levelNumber > 4) {
    const baseSpeedAt4 = Math.floor(3 * levelNumber + 0.8 * levelNumber ** 2);
    return baseSpeedAt4 + (levelNumber - 4) * 2;
  }
  return Math.floor(3 * levelNumber + 0.8 * levelNumber ** 2);
}
