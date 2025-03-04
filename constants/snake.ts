export enum GameState {
  MENU = "menu",
  PLAYING = "playing",
  GAME_OVER = "gameOver",
  WIN = "win"
}

//used for css to define the background
export enum levelWinBackgrounds {
  1 = "shooting_star",
  2 = "iceland_sky",
  3 = "black_hole",
}

//used for the snake window after level is won
export const levelWinTexts = {
  [levelWinBackgrounds[1]]: "Shooting star coming",
  [levelWinBackgrounds[2]]: "You got Icelandic sky",
  [levelWinBackgrounds[3]]: "You are inside the black hole"
};