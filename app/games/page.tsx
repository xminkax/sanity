"use client";
// import SnakeGame from "@/components/SnakeGame";
import React from "react";
// import { useLocalStorage } from "usehooks-ts";
// import GameOver from "@/components/GameOver";
// import { GameState } from "@/constants/snake";

export default function Games() {
  // const [levelWin, setLevelWin, removeLevelWin] = useLocalStorage<string|undefined>("levelWin", '0');
  // const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  return (<div>games</div>
    // <div
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //     padding: "8rem",
    //   }}
    // >
    //   {gameState === GameState.MENU && (
    //     <div className="snake-animated-state">
    //       <SnakeGame
    //         gameState={GameState.MENU}
    //         levelWin={levelWin}
    //         startGame={() => setGameState(GameState.PLAYING)}
    //       />
    //     </div>
    //   )}
    //   {gameState === GameState.PLAYING && (
    //     <div className="snake-animated-state">
    //       <SnakeGame
    //         gameState={GameState.PLAYING}
    //         levelWin={levelWin}
    //         gameOver={() => {
    //           setGameState(GameState.GAME_OVER);
    //           removeLevelWin();
    //         }}
    //         win={() => {
    //           setGameState(GameState.WIN);
    //           setLevelWin(levelWin + 1);
    //         }}
    //       />
    //     </div>
    //   )}
    //   {gameState === GameState.WIN && (
    //     <div className="snake-animated-state">
    //       <SnakeGame
    //         gameState={GameState.WIN}
    //         startGame={() => setGameState(GameState.PLAYING)}
    //         levelWin={levelWin}
    //         restartGame={() => {
    //           setGameState(GameState.MENU);
    //           removeLevelWin();
    //         }}
    //       />
    //     </div>
    //   )}
    //   {gameState === GameState.GAME_OVER && (
    //     <div className="snake-animated-state">
    //       <GameOver
    //         gameState={GameState.GAME_OVER}
    //         restartGame={() => setGameState(GameState.PLAYING)}
    //       />
    //     </div>
    //   )}
    // </div>
  );
}
