export enum GameState {
  MENU = "menu",
  PLAYING = "playing",
  GAME_OVER = "gameOver",
  WIN = "win",
}

//used for css to define the background
export enum LevelWinBackgrounds {
  "level_0" = "night-sky",
  "level_1" = "shooting-star",
  "level_2" = "iceland-sky",
  "level_3" = "black-hole",
}

//used for the snake window after level is won
export const levelWinTexts = {
  [LevelWinBackgrounds["level_1"]]: "Shooting star coming",
  [LevelWinBackgrounds["level_2"]]: "You got Icelandic sky",
  [LevelWinBackgrounds["level_3"]]: "You are inside the black hole",
};

export const MOBILE_SIZE_CANCAS = 640;
