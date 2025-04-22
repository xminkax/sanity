"use client";
import SnakeGame from "@/components/Snake/SnakeGame";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Menu from "@/components/Snake/Menu";
import { calculateTotalScore, GameState } from "@/constants/snake";
import NextLevel from "@/components/Snake/NextLevel";
import GameOver from "@/components/Snake/GameOver";
import { useGameState } from "@/context/SnakeGameContext";

type SnakeStats = {
  level: number;
  highScore: number;
};

export default function Games() {
  const { gameState, setGameState } = useGameState();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [snakeStats, setSnakeStats, removeSnakeStats] = useLocalStorage<SnakeStats>("snakeStats", {
    level: 0,
    highScore: 0,
  });

  useEffect(() => {
    setHasLoaded(true);
    if (snakeStats.level > 0) {
      setGameState(GameState.NEXT_LEVEL);
    }
  }, [setGameState, snakeStats.level]);

  if (!hasLoaded) {
    return null;
  }

  const playAgain = () => {
    setGameState(GameState.PLAYING);
    setSnakeStats((prev) => ({
      ...prev,
      level: 0,
    }));
  };

  const resetGame = () => {
    setGameState(GameState.START);
    setSnakeStats((prev) => ({
      ...prev,
      level: 0,
    }));
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          // padding: "8rem",
        }}
      >
        {gameState === GameState.START && (
          <div className="snake-animated-state">
            <Menu
              startGame={() => {
                setSnakeStats((prev) => ({
                  ...prev,
                  state: GameState.PLAYING,
                }));
                setGameState(GameState.PLAYING);
              }}
            />
          </div>
        )}
        {gameState === GameState.PLAYING && (
          <div className="snake-animated-state">
            <SnakeGame
              highScore={snakeStats.highScore}
              score={calculateTotalScore(Number(snakeStats?.level))}
              level={Number(snakeStats?.level) + 1}
              gameOver={() => {
                setGameState(GameState.GAME_OVER);
                setSnakeStats((prev) => ({
                  ...prev,
                  level: 0,
                }));
              }}
              win={(score) => {
                setGameState(GameState.NEXT_LEVEL);
                setSnakeStats((prev) => ({
                  level: Number(snakeStats?.level) + 1,
                  highScore: score > prev.highScore ? score : prev.highScore,
                }));
              }}
            />
          </div>
        )}
        {gameState === GameState.NEXT_LEVEL && (
          <div className="snake-animated-state">
            <NextLevel
              handleNextLevel={() => {
                setGameState(GameState.PLAYING);
              }}
              nextLevel={Number(snakeStats?.level) + 1}
              resetGame={resetGame}
            />
          </div>
        )}
        {gameState === GameState.GAME_OVER && (
          <div className="snake-animated-state">
            <GameOver playAgain={playAgain} />
          </div>
        )}
      </div>
    </>
  );
}
