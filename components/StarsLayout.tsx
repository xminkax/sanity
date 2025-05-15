"use client";
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LorenzAttractor from "@/components/LorenzAttractor/Index";
import Nebula from "@/components/Nebula/index";
import Aurora from "@/components/Aurora/index";
import Particles from "@/components/Particles";
import { useGameState } from "@/context/SnakeGameContext";
import { GameState } from "@/constants";
import { SnakeStats } from "@/interfaces";

const NUM_STARS: number = 100;

type StarStyle = {
  animationDelay: string;
  top: string;
  left: string;
};

const generateStars = (): JSX.Element[] => {
  return Array.from({ length: NUM_STARS }).map((_, index) => {
    const starStyle: StarStyle = {
      left: Math.random() * 100 + "vw",
      animationDelay: Math.random() * 3 + "s",
      top: Math.random() * 100 + "vh",
    };

    return (
      <div
        key={index}
        className={["star", index % 20 === 0 ? " yellow-star" : ""].join("")}
        style={starStyle}
      ></div>
    );
  });
};

const StarsLayout: FC<{ children: ReactNode }> = ({ children }): JSX.Element => {
  const { gameState, setGameState } = useGameState();
  const pathname = usePathname();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [snakeStats, setSnakeStats] = useLocalStorage<SnakeStats>("snakeStats", {
    level: 0,
    highScore: 0,
  });

  const memoizedStars = useMemo(() => generateStars(), []);

  const shouldDisplayBackgroundFromGame = () =>
    pathname !== "/games" || (pathname === "/games" && gameState === GameState.NEXT_LEVEL);

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

  const renderLevelBackground = () => {
    if (level === 1 && shouldDisplayBackgroundFromGame()) return <Aurora />;
    if (level === 2 && shouldDisplayBackgroundFromGame()) return <Particles />;
    if (level === 3 && pathname !== "/games" && shouldDisplayBackgroundFromGame())
      return <div className="stars">{memoizedStars}</div>;
    if (level === 3 && pathname === "/games" && shouldDisplayBackgroundFromGame())
      return <Nebula />;
    if (level === 4 && shouldDisplayBackgroundFromGame()) return <LorenzAttractor />;
    if (
      (level === 0 && pathname !== "/games") ||
      gameState === GameState.PLAYING ||
      gameState === GameState.START
    )
      return <div className="stars">{memoizedStars}</div>;
  };

  const { level, highScore } = snakeStats;

  if (!hasLoaded) {
    return <body>{children}</body>;
  }
  return (
    <body>
      <Header
        shouldDisplayResetIcon={highScore > 0}
        reset={reset}
        isResetDisabled={highScore > 0 && level === 0}
      />

      {renderLevelBackground()}
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
      </div>
      <Footer />
    </body>
  );
};

export default StarsLayout;
