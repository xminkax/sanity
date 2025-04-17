"use client";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import LorenzAttractor from "@/components/LorenzAttractor/Index";
import Nebula from "@/components/Nebula/index";
import Aurora from "@/components/Aurora/index";
import Particles from "@/components/Particles";
import { useGameState } from "@/context/SnakeGameContext";
import { GameState } from "@/constants/snake";

const NUM_STARS: number = 50;

interface StarStyle {
  animationDelay: string;
  top: string;
  left: string;
}

const generateStars = (): JSX.Element[] => {
  return Array.from({ length: NUM_STARS }).map((_, index) => {
    const starStyle: StarStyle = {
      left: Math.random() * 100 + "vw",
      animationDelay: Math.random() * 3 + "s",
      top: Math.random() * 100 + "vh",
    };

    return <div key={index} className="star" style={starStyle}></div>;
  });
};

type SnakeStats = {
  level: number;
  highScore: number;
};

const StarsLayout: FC<{ children: ReactNode }> = ({ children }): JSX.Element => {
  const { gameState, setGameState } = useGameState();
  const pathname = usePathname();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [snakeStats, setSnakeStats, removeSnakeStats] = useLocalStorage<SnakeStats>("snakeStats", {
    level: 0,
    highScore: 0,
  });

  const shouldDisplayBackgroundFromGame = () =>
    hasLoaded &&
    (pathname !== "/games" || (pathname === "/games" && gameState === GameState.NEXT_LEVEL));

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  const reset = () => {
    setSnakeStats((prev) => ({
      ...prev,
      level: 0,
    }));
    setGameState(GameState.START);
  };

  // console.log(snakeStats, 'layout');
  const { level, highScore } = snakeStats;
  return (
    <body>
      <Header
        shouldDisplayResetIcon={highScore > 0}
        reset={reset}
        isResetDisabled={highScore > 0 && level === 0}
      />

      {hasLoaded && level === 0 && pathname !== "/games" && (
        <div>
          <LorenzAttractor />
        </div>
      )}
      {hasLoaded &&
        (gameState === GameState.PLAYING || gameState === GameState.START) &&
        pathname === "/games" && <div>{generateStars()}</div>}
      {level === 1 && shouldDisplayBackgroundFromGame() && (
        <div>
          <Aurora />
        </div>
      )}
      {level === 2 && shouldDisplayBackgroundFromGame() && <Particles />}
      {level === 3 && pathname !== "/games" && shouldDisplayBackgroundFromGame() && <div>{generateStars()}</div>}
      {level === 3 && pathname === "/games" && shouldDisplayBackgroundFromGame() && <Nebula/>}
      {children}
    </body>
  );
};

export default StarsLayout;
