export enum GameState {
  MENU = "menu",
  PLAYING = "playing",
  GAME_OVER = "gameOver",
  WIN = "win",
}

//used for css to define the background
export enum levelWinBackgrounds {
  0 = "night-sky",
  1 = "shooting-star",
  2 = "iceland-sky",
  3 = "black-hole",
}

//used for the snake window after level is won
export const levelWinTexts = {
  [levelWinBackgrounds[1]]: "Shooting star coming",
  [levelWinBackgrounds[2]]: "You got Icelandic sky",
  [levelWinBackgrounds[3]]: "You are inside the black hole",
};

export const MOBILE_SIZE_CANCAS = 640;
