"use client";
import SnakeGame from "@/components/SnakeGame";
import React, {useEffect, useRef, useState} from "react";
import {useLocalStorage} from "usehooks-ts";
// import Index from "@/components/GameOver";
// import StatusScreen from "@/components/NextLevel";
import Menu from "@/components/Menu";
// import GameOverMobile from "@/components/GameOverMobile";
import {GameState, calculateTotalScore} from "@/constants/snake";
import NextLevel from "@/components/NextLevel";
import {Press_Start_2P} from "next/font/google";
import GameOver from "@/components/GameOver/index";
import {useGameState} from "@/context/SnakeGameContext";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

type SnakeStats = {
  level: number;
  highScore: number;
};


export default function Games() {
  const { gameState, setGameState } = useGameState();
  // const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [snakeStats, setSnakeStats, removeSnakeStats] = useLocalStorage<SnakeStats>("snakeStats", {
    level: 0,
    highScore: 0,
    menu: GameState.START,
  });

  useEffect(() => {
    setHasLoaded(true);
    if(snakeStats.level > 0) {
      setGameState(GameState.NEXT_LEVEL);
    }
  }, []);

  if (!hasLoaded) {
    return null;
  }

  const resetGame = () => {
    setGameState(GameState.PLAYING);
    setSnakeStats(prev => ({
      ...prev,
      level: 0
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
                setSnakeStats(prev => ({
                  ...prev,
                  state: GameState.PLAYING
                }));
                setGameState(GameState.PLAYING)
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
                setSnakeStats(prev => ({
                  ...prev,
                  level: 1
                }));
              }}
              win={(score) => {
                setGameState(GameState.NEXT_LEVEL);
                console.log("win");
                setSnakeStats(prev => ({
                  level: Number(snakeStats?.level) + 1,
                  highScore: score > prev.highScore ? score : prev.highScore
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
            <GameOver resetGame={resetGame}/>
            {/*<GameOverMobile resetGame={resetGame} />*/}
          </div>
        )}
      </div>
    </>
  );
}
