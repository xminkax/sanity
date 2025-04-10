"use client";
import SnakeGame from "@/components/SnakeGame";
import React, {useEffect, useRef, useState} from "react";
import {useLocalStorage} from "usehooks-ts";
// import Index from "@/components/GameOver";
// import StatusScreen from "@/components/NextLevel";
import Menu from "@/components/Menu";
// import GameOverMobile from "@/components/GameOverMobile";
import {GameState} from "@/constants/snake";
// import NextLevel from "@/components/NextLevel";
import {Press_Start_2P} from "next/font/google";
import GameOver from "@/components/GameOver/index";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Games() {
  const [levelWin, setLevelWin, removeLevelWin] = useLocalStorage<string | undefined>(
    "levelWin",
    "0",
  );
  const [score, setScore, removeScore] = useLocalStorage<string | undefined>(
    "score",
    "0",
  );
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  // const [level, setLevel] = useState(null);
  const hasLoadedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const resetGame = () => {
    setGameState(GameState.MENU);
    removeLevelWin();
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
        {gameState === GameState.MENU && (
          <div className="snake-animated-state">
            <Menu
              startGame={() => setGameState(GameState.PLAYING)}
              nextLevel={Number(levelWin) + 1}
            />
          </div>
        )}
        {gameState === GameState.PLAYING && (
          <div className="snake-animated-state">
            <SnakeGame
              level={Number(levelWin) + 1}
              gameState={GameState.PLAYING}
              gameOver={() => {
                setGameState(GameState.GAME_OVER);
                removeLevelWin();
              }}
              win={() => {
                setGameState(GameState.WIN);
                setLevelWin((Number(levelWin) + 1).toString());
              }}
            />
          </div>
        )}
        {/*{gameState === GameState.WIN && (*/}
        {/*  <div className="snake-animated-state">*/}
        {/*    <NextLevel*/}
        {/*      handleNextLevel={() => {*/}
        {/*        setGameState(GameState.PLAYING);*/}
        {/*      }}*/}
        {/*      nextLevel={Number(levelWin) + 1}*/}
        {/*      // resetGame={resetGame}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*)}*/}
        {gameState === GameState.GAME_OVER && (
          <div className="snake-animated-state">
            <GameOver resetGame={() => setGameState(GameState.PLAYING)}/>
            {/*<GameOverMobile resetGame={resetGame} />*/}
          </div>
        )}
      </div>
    </>
  );
}
