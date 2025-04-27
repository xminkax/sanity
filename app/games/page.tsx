"use client";
import SnakeGame from "@/components/Snake/SnakeGame";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Menu from "@/components/Snake/Menu";
import { calculateTotalScore, GameState } from "@/constants/snake";
import NextLevel from "@/components/Snake/NextLevel";
import GameOver from "@/components/Snake/GameOver";
import { useGameState } from "@/context/SnakeGameContext";
import { pressStart2P } from "@/lib/fonts";

type SnakeStats = {
  level: number;
  highScore: number;
};

export default function Games() {
  const { gameState, setGameState } = useGameState();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [snakeStats, setSnakeStats] = useLocalStorage<SnakeStats>("snakeStats", {
    level: 0,
    highScore: 0,
  });
  useEffect(() => {
    if (gameState === GameState.GAME_OVER) {
      setGameState(GameState.START);
    }
  }, []);

  useEffect(() => {
    setHasLoaded(true);
    if (snakeStats.level > 0) {
      setGameState(GameState.NEXT_LEVEL);
    }
  }, [setGameState, snakeStats.level]);

  if (!hasLoaded) {
    return null;
  }

  const resetStats = () => {
    setSnakeStats((prev) => ({
      ...prev,
      level: 0,
    }));
  };

  const playAgain = () => {
    setGameState(GameState.PLAYING);
    resetStats();
  };

  const resetGame = () => {
    setGameState(GameState.START);
    resetStats();
  };

  const handleGameOver = () => {
    setGameState(GameState.GAME_OVER);
    resetStats();
  };

  const startGame = () => {
    setSnakeStats((prev) => ({
      ...prev,
      state: GameState.PLAYING,
    }));
    setGameState(GameState.PLAYING);
  };

  const winGame = (score) => {
    setGameState(GameState.NEXT_LEVEL);
    setSnakeStats((prev) => ({
      level: snakeStats?.level + 1,
      highScore: score > prev.highScore ? score : prev.highScore,
    }));
  };

  return (
    <div className={`${pressStart2P.className} flex justify-center`}>
      {gameState === GameState.START && (
        <div className="snake__animated-state">
          <Menu startGame={startGame} />
        </div>
      )}
      {gameState === GameState.PLAYING && (
        <div className="snake__animated-state">
          <SnakeGame
            highScore={snakeStats.highScore}
            score={calculateTotalScore(snakeStats?.level)}
            level={snakeStats?.level + 1}
            gameOver={handleGameOver}
            win={winGame}
          />
        </div>
      )}
      {gameState === GameState.NEXT_LEVEL && (
        <div className="snake__animated-state">
          <NextLevel
            handleNextLevel={() => {
              setGameState(GameState.PLAYING);
            }}
            nextLevel={snakeStats?.level + 1}
            resetGame={resetGame}
          />
        </div>
      )}
      {gameState === GameState.GAME_OVER && (
        <div className="snake__animated-state">
          <GameOver playAgain={playAgain} />
        </div>
      )}
    </div>
  );
}
