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
import {GameState} from "@/constants/snake";

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

const StarsLayout: FC<{ children: ReactNode }> = ({children}): JSX.Element => {
  const {gameState, setGameState} = useGameState();
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

  // console.log(snakeStats, 'layout');
  const {level} = snakeStats;
  return (
    <body>
    <Header shouldDisplayResetIcon={false}/>

    {hasLoaded && level === 0 && pathname !== "/games" &&
      <div className="stars">
        {/*{generateStars()}*/}
        {/*<Stars/>*/}
        <LorenzAttractor/>
      </div>
    }
    {hasLoaded && (gameState === GameState.PLAYING || gameState === GameState.START) && <div className="stars">{generateStars()}</div>}
    {hasLoaded && level === 1 && (pathname !== "/games" || (pathname === "/games" && gameState === GameState.NEXT_LEVEL)) &&
      <div><Aurora/></div>
    }
    {hasLoaded && level === 2 && (pathname !== "/games" || (pathname === "/games" && gameState === GameState.NEXT_LEVEL)) &&
      <Particles/>
    }
    {hasLoaded && level === 3 && (pathname !== "/games" || (pathname === "/games" && gameState === GameState.NEXT_LEVEL)) &&
      <Nebula/>
    }

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