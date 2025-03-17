"use client";
import React, {FC, ReactNode, useEffect, useState} from "react";
import {useLocalStorage} from "usehooks-ts";
import {LevelWinBackgrounds} from "@/constants/snake";
import {usePathname} from "next/navigation";
import logo from "../app/icon.svg";
import undo from "../public/undo.svg";
import Image from 'next/image';
import Link from 'next/link';


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
  const scrollToSection = () => {
    const section = document.getElementById('about-me');
    if (section) {
      window.scrollTo({
        top: section.offsetTop, // Adjust for margin offset
        behavior: 'smooth', // Smooth scroll
      });
    }
  };

  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [levelWin, setLevelWin, removeValue] = useLocalStorage<string>("levelWin", "level_0");
  const [background, setBackground] = useState("night-sky");
  useEffect(() => {
    setBackground(LevelWinBackgrounds[levelWin as keyof typeof LevelWinBackgrounds]);

  }, [levelWin]);
  return (
    <body className={background}>
    <header className="header flex items-center justify-between sm:px-4 px-2 sm:text-lg text-sm  fixed top-0 w-full z-10 backdrop-blur-md sm:h-[4rem] h-[3.4rem]">
      <div className="">
        <Link href="/"> <Image
          className="sm:w-full w-[2rem]"
          priority
          src={logo}
          alt="logo to go on the homepage"
        /></Link>

      </div>

      <nav className="flex justify-center flex-1 ">
        <ul className="flex justify-center sm:space-x-6 space-x-3">
          <li>Games</li>
          <li> <a onClick={scrollToSection}>About</a></li>
          <li>Resume</li>
        </ul>
      </nav>

      {background && pathname !== "/games" && (
        <div className="ml-auto">
          <button className="image-button">
            <Image
              className="sm:w-full w-[2rem]"
              priority
              src={undo}
              alt="reset background"
            />
          </button>
        </div>)}
    </header>
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
    {background === LevelWinBackgrounds["level_0"] && (
      <div className="stars">{generateStars()}</div>
    )}

    {children}
    </body>
  );
};

export default StarsBackground;
