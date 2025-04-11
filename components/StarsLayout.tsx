"use client";
import React, {FC, ReactNode, useEffect, useState} from "react";
import {useLocalStorage} from "usehooks-ts";
import {usePathname} from "next/navigation";
import Header from "@/components/Header";
import LorenzAttractor from "@/components/LorenzAttractor/Index";
import Nebula from "@/components/Nebula/index";
import Stars from "@/components/Stars/index";
// import LorenzAttractor from "@/components/LorenzAttractor";
import GameOver from "@/components/GameOver";
// import NightSky from "@/components/NightSky";
import Aurora from "@/components/Aurora/index";
import Particles from "@/components/Particles";
import {useGameState} from "@/context/SnakeGameContext";
import Panel from "@/components/Panel";

const NUM_STARS: number = 50;

interface StarStyle {
  animationDelay: string;
  top: string;
  left: string;
}

const generateStars = (): JSX.Element[] => {
  return Array.from({length: NUM_STARS}).map((_, index) => {
    const starStyle: StarStyle = {
      left: Math.random() * 100 + "vw",
      animationDelay: Math.random() * 3 + "s" + " 0s",
      top: Math.random() * 100 + "vh",
    };

    return <div key={index} className="star" style={starStyle}></div>;
  });
};

type SnakeStats = {
  level: number;
  highScore: number;
};

const StarsLayout: FC<{ children: ReactNode }> = ({children}): JSX.Element => {
  const { gameState, setGameState } = useGameState();
  const pathname = usePathname();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [snakeStats, setSnakeStats, removeSnakeStats] = useLocalStorage<SnakeStats>("snakeStats", {
    level: 0,
    highScore: 0
  });

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  // const shouldDisplayResetIcon =
  //   background !== LevelWinBackgrounds["level_0"] && pathname !== "/games";
  console.log(gameState, "gameState");

  console.log(snakeStats, 'layout');
  const {level, state} = snakeStats;
  return (
    <body className="">
    <Header shouldDisplayResetIcon={false}/>
    {level === 0 && pathname !== "/games" &&
      <div className="stars">
        {/*{generateStars()}*/}
        {/*<Stars/>*/}
        <LorenzAttractor/>
      </div>
    }
    {gameState === "playing" && <div className="stars">{generateStars()}</div>}
    {level === 1 && (pathname !== "/games" || (pathname === "/games" && gameState === "menu")) &&
      <div><Aurora/>lala</div>
    }
    {level === 2 && (pathname !== "/games" || (pathname === "/games" && gameState !== "game over")) &&
      <Particles/>
    }
    {level === 3 && (pathname !== "/games" || (pathname === "/games" && gameState === "menu"))  &&
      <Nebula/>
    }
    {/*<div className="stars"></div>*/}
    {/*{background === LevelWinBackgrounds["level_0"] && (*/}
    {/*  <div className="stars">{generateStars()}</div>*/}
    {/*)}*/}
    {/*{background === LevelWinBackgrounds["level_2"] && (*/}
    {/*  <div className="stars">*/}
    {/*    <div className="sky">*/}
    {/*      <div className="star-snake"></div>*/}
    {/*    </div>*/}
    {/*    {generateStars()}*/}
    {/*  </div>*/}
    {/*)}*/}
    {/*{background === LevelWinBackgrounds["level_1"] && (*/}
    {/*  <div className="stars"><MilkyWay/></div>*/}
    {/*)}*/}
    {children}
    </body>
  );
};

export default StarsLayout;


// <body className="night-sky">
// <Header shouldDisplayResetIcon={false}/>
// {level === 0 &&
//   <div className="stars">
//     {/*{generateStars()}*/}
//     {/*<Stars/>*/}
//     {/*<LorenzAttractor/>*/}
//   </div>
// }
// {level === 1 &&
//   <Aurora/>
// }
// {level === 2 &&
//   <Particles/>
// }
// {level === 3 &&
//   <Nebula/>
// }