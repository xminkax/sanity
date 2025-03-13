"use client";
import React, {FC, ReactNode, useEffect, useState} from "react";
import {useLocalStorage} from "usehooks-ts";
import {motion, AnimatePresence} from "framer-motion";
import {levelWinBackgrounds} from "@/constants/snake";
import {usePathname} from "next/navigation";

const NUM_STARS: number = 100;

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

    return (
      <div
        key={index}
        className={["star", index % 20 === 0 ? " yellow-star" : ""].join("")}
        style={starStyle}
      ></div>
    );
  });
};

const StarsBackground: FC<{ children: ReactNode }> = ({children}): JSX.Element => {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [levelWin, setLevelWin, removeValue] = useLocalStorage<string>("levelWin", "level_0");
  const [background, setBackground] = useState("night-sky");
  useEffect(() => {
    setBackground("night-sky");
  }, [levelWin]);
  return (
    <body className={background}>
    <header className="flex mb-10" style={{alignItems: "center", justifyContent: "center"}}>
      <ul className="flex" style={{alignItems: "center", justifyContent: "center"}}>
        <li>Games</li>
        <li>About</li>
        <li>Resume</li>
        {/*<li><Image className="cv" src={CV} alt="cv" /></li>*/}
      </ul>
      {background && pathname !== "/games" && (
        <AnimatePresence mode="sync">
          <motion.div
            className="flex"
            key="next-level"
            style={{
              position: "absolute",
              right: "20px",
            }}
          >
            <button
              onClick={removeValue}
              className="px-4 py-2 bg-gray-800 text-white rounded-2xl shadow-lg hover:bg-gray-700 active:bg-gray-900 transition-all duration-200 border border-gray-600"
            >
              Reset BG
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </header>
    {background === levelWinBackgrounds["level_2"] && (
      <>
        <div className="stars"></div>
        <div className="aurora">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </>
    )}
    {background === levelWinBackgrounds["level_0"] && <div className="stars">{generateStars()}</div>}

    {children}
    </body>
  );
};

export default StarsBackground;
