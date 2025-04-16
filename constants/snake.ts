export enum GameState {
  START = "start",
  PLAYING = "playing",
  GAME_OVER = "game_over",
  NEXT_LEVEL = "next_level",
}

export function calculateTotalScore(levelNumber) {
  let totalScore = 0;
  for (let i = 1; i <= levelNumber; i++) {
    totalScore += 2;
  }
  return totalScore;
}

export const MOBILE_SIZE_CANCAS = 640;
