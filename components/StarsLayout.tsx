"use client";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { LevelWinBackgrounds } from "@/constants/snake";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import MilkyWay from "@/components/MilkyWay";
import LorenzAttractor from "@/components/LorenzAttractor2";
import LorenzAttractor2 from "@/components/LorenzAttractor2";
import PostProcess from "@/components/PostProcess";
import GameOver from "@/components/GameOver";
import Galaxy from "@/components/NightSky";
import NightSky from "@/components/NightSky";
import IcelandicSky from "@/components/IcelandicSky";
import Playground from "@/components/Particles";
// import Nehe2_19 from "@/components/Nehe19Works";
// import Nehe2_19 from "@/components/nehe2_19";

const NUM_STARS: number = 100;

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

const StarsLayout: FC<{ children: ReactNode }> = ({ children }): JSX.Element => {
  const pathname = usePathname();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [levelWin, setLevelWin, removeValue] = useLocalStorage<string>("levelWin", "0");
  const [background, setBackground] = useState("night-sky");
  useEffect(() => {
    setBackground(LevelWinBackgrounds[("level_" + levelWin) as keyof typeof LevelWinBackgrounds]);
  }, [levelWin]);
  const shouldDisplayResetIcon =
    background !== LevelWinBackgrounds["level_0"] && pathname !== "/games";
  console.log(background);
  const className = pathname === "/games" ? "night-sky" : background;
  return (
    <body className={className}>
      <Header shouldDisplayResetIcon={shouldDisplayResetIcon} />
      {background === LevelWinBackgrounds["level_2"] && (
        <>
          <div className="stars"></div>
          <div className="aurora">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </>
      )}
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
      <div className="stars">
        {generateStars()}
        <LorenzAttractor />
        {/*<IcelandicSky/>*/}
        {/*<NightSky/>*/}
        {/*<Playground />*/}
        {/*<PostProcess/>*/}
        {/*<Nehe2_19/>*/}
        {/*<IcelandicSky/>*/}
        {/*<LorenzAttractor2/>*/}
        {/*<NightSky/>*/}
        {/*<GameOver/>*/}
      </div>

      {children}
    </body>
  );
};

export default StarsLayout;
