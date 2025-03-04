"use client";
import SnakeGame from "@/src/SnakeGame";
import {useState} from "react";
import {useLocalStorage} from 'usehooks-ts'
import GameOver from "@/src/GameOver";
import {GameState} from "@/constants/snake";

export default function Games() {
  const [levelWin, setLevelWin, removeValue] = useLocalStorage<string>('levelWin', null);
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "8rem",
      }}
    >
      {gameState === GameState.MENU &&
        <div className="snake-animated-state"><SnakeGame gameState={GameState.MENU} levelWin={levelWin}
                                                         startGame={() => setGameState(GameState.PLAYING)}/>
        </div>}
      {gameState === GameState.PLAYING &&
        <div
          className="snake-animated-state"
        ><SnakeGame gameState={GameState.PLAYING} levelWin={levelWin}
                    gameOver={() => setGameState(GameState.GAME_OVER)}
                    win={() => {
                      setGameState(GameState.WIN);
                      setLevelWin(levelWin + 1);
                    }}/></div>}
      {gameState === GameState.WIN &&
        <div
          className="snake-animated-state"
        ><SnakeGame gameState={GameState.WIN}
                    startGame={() => setGameState(GameState.PLAYING)}
                    levelWin={levelWin}
                    restartGame={() => {
                      setGameState(GameState.MENU);
                      removeValue();
                    }}/></div>}
      {gameState === GameState.GAME_OVER &&
        <div
          className="snake-animated-state"
        ><GameOver gameState={GameState.GAME_OVER} restartGame={() => setGameState(GameState.PLAYING)}/></div>
      }
    </div>
  );
}
