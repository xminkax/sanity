"use client"
import React from "react";
// import useLocalStorage from "@/hooks/useLocalStorage";
import {useLocalStorage} from 'usehooks-ts';
import {motion, AnimatePresence} from "framer-motion";
// import {useLocalStorage} from "@/hooks/useLocalStorage";

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

const StarsBackground: React.FC = ({
                                     children
                                   }: {
  children: React.ReactNode
}): JSX.Element => {
  // const [level] = useLocalStorage<string>("level", "");

  const [value, setValue, removeValue] = useLocalStorage('level', 1);
  console.log(value, "level");
  const getBackground = (level) => {
    switch (level) {
      case 3:
        return 'iceland_sky';
      default:
        return "night_sky";
    }
  }
  const theme = getBackground(value);
  // const theme = "night_sky";
  return <body className={theme}>
  <header className="flex" style={{alignItems: "center", justifyContent: "center"}}>
    <ul className="flex" style={{alignItems: "center", justifyContent: "center"}}>
      <li>Games</li>
      <li>About</li>
      <li>CV</li>
    </ul>
    {value !== 1 && value !== 4 && <AnimatePresence mode="sync">
      <motion.div
        className="flex"
        key="next-level"
        style={{
          position: "absolute",
          right: "20px"
        }}
        // initial={{opacity: 1}}
        // animate={{opacity: 1}}
        // exit={{opacity: 1}}
        // transition={{duration: 0}}
      >
        <button
          onClick={removeValue}
          className="px-4 py-2 bg-gray-800 text-white rounded-2xl shadow-lg hover:bg-gray-700 active:bg-gray-900 transition-all duration-200 border border-gray-600"
        >
          Reset game
        </button>
      </motion.div>
    </AnimatePresence>
    }
  </header>
  {theme === "iceland_sky" &&
    <>
      <div className="stars"></div>
      <div className="aurora">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  }
  {theme === "night_sky" &&
    <div className="stars">{generateStars()}</div>
  }

  {children}
  </body>;
};

export default StarsBackground;
