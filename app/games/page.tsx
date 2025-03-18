"use client";
import SnakeGame from "@/components/SnakeGame";
import React, {useState} from "react";
import {useLocalStorage} from "usehooks-ts";
import GameOver from "@/components/GameOver";
import StatusScreen from "@/components/NextLevel";
import Menu from "@/components/Menu";
import GameOverMobile from "@/components/GameOverMobile";
import {GameState} from "@/constants/snake";
import NextLevel from "@/components/NextLevel";

export default function Games() {
  const [levelWin, setLevelWin, removeLevelWin] = useLocalStorage<string | undefined>("levelWin", '0');
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  return (<>
      <div>games</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          // padding: "8rem",
        }}
      >
        {gameState === GameState.MENU && (
          <div className="snake-animated-state">
            <Menu
              gameState={GameState.MENU}
              levelWin={levelWin}
              startGame={() => setGameState(GameState.PLAYING)}
              gameOver={() => {
                setGameState(GameState.GAME_OVER);
                removeLevelWin();
              }}
            />
          </div>
        )}
        {gameState === GameState.PLAYING && (
          <div className="snake-animated-state">
            <SnakeGame
              gameState={GameState.PLAYING}
              levelWin={levelWin}
              gameOver={() => {
                setGameState(GameState.GAME_OVER);
                removeLevelWin();
              }}
              win={() => {
                setGameState(GameState.WIN);
                setLevelWin(levelWin + 1);
              }}
            />
          </div>
        )}
        {gameState === GameState.WIN && (
          <div className="snake-animated-state">
            <NextLevel
              gameState={GameState.WIN}
              restartButton={{
                onClick: () => {
                  setGameState(GameState.MENU);
                  removeLevelWin();
                },
                text: 'Restart'
              }}
              title="Congrats!"
              nextLevelButton={{
                onClick: () => setGameState(GameState.PLAYING),
                text: "Next level"
              }}
              levelWin={levelWin}
            />
          </div>
        )}
        {gameState === GameState.GAME_OVER && (
          <div className="snake-animated-state">
            <GameOverMobile
              gameState={GameState.GAME_OVER}
              restartButton={{
                onClick: () => setGameState(GameState.PLAYING),
                text: 'Restart'
              }}
              title="Game over"
              restartGame={() => setGameState(GameState.PLAYING)}
            />
          </div>
        )}
      </div>
    </>
  )
    ;
}
