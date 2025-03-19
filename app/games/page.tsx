"use client";
import SnakeGame from "@/components/SnakeGame";
import React, { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import GameOver from "@/components/GameOver";
import StatusScreen from "@/components/NextLevel";
import Menu from "@/components/Menu";
import GameOverMobile from "@/components/GameOverMobile";
import { GameState } from "@/constants/snake";
import NextLevel from "@/components/NextLevel";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Games() {
  const [levelWin, setLevelWin, removeLevelWin] = useLocalStorage<string | undefined>(
    "levelWin",
    null,
  );
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [level, setLevel] = useState((Number(levelWin) || 0) + 1);
  const resetGame = () => {
    setGameState(GameState.MENU);
    removeLevelWin();
  };
  return (
    <>
      <div>games</div>
      {levelWin === "1" && (
        <div className="sky">
          <div className="star-snake"></div>
        </div>
      )}
      <div
        className={`${pressStart2P.className}`}
        style={{
          display: "flex",
          justifyContent: "center",
          // padding: "8rem",
        }}
      >
        {gameState === GameState.MENU && (
          <div className="snake-animated-state">
            <Menu
              nextLevel={levelWin ? Number(levelWin) + 1 : null}
              startGame={() => setGameState(GameState.PLAYING)}
            />
          </div>
        )}
        {gameState === GameState.PLAYING && (
          <div className="snake-animated-state">
            <SnakeGame
              level={level}
              gameState={GameState.PLAYING}
              gameOver={() => {
                setGameState(GameState.GAME_OVER);
                removeLevelWin();
                setLevel(1);
              }}
              win={() => {
                setGameState(GameState.WIN);
                setLevelWin((Number(levelWin || 0) + 1).toString());
              }}
            />
          </div>
        )}
        {gameState === GameState.WIN && (
          <div className="snake-animated-state">
            <NextLevel
              nextLevel={() => {
                setGameState(GameState.PLAYING);
                setLevel(level + 1);
              }}
              resetGame={resetGame}
            />
          </div>
        )}
        {gameState === GameState.GAME_OVER && (
          <div className="snake-animated-state">
            <GameOver resetGame={resetGame} />
          </div>
        )}
      </div>
    </>
  );
}
