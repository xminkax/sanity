"use client";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { LevelWinBackgrounds } from "@/constants/snake";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import MilkyWay from "@/components/MilkyWay";

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
  const className = pathname === "/games" ? "games" : background;
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
      {background === LevelWinBackgrounds["level_0"] && pathname !== "/games" && (
        <div className="stars">{generateStars()}</div>
      )}
      {background === LevelWinBackgrounds["level_2"] && (
        <div className="stars">
          <div className="sky">
            <div className="star-snake"></div>
          </div>
          {generateStars()}
        </div>
      )}
      {background === LevelWinBackgrounds["level_1"] && (
        <div className="stars"><MilkyWay/></div>
      )}


      {children}
    </body>
  );
};

export default StarsLayout;
