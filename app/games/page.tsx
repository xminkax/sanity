"use client";
import SnakeGame from "@/src/SnakeGame";
import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
// import {useLocalStorage} from "@/hooks/useLocalStorage";
import { useLocalStorage } from 'usehooks-ts'
import NextLevel from "@/src/NextLevel";
import GameOver from "@/src/GameOver";
import {useTheme} from "@/context/ThemeContext";

const GAME_STATE_START = 1;
const GAME_STATE_PLAY = 2;
const GAME_STATE_NEXT_LEVEL = 3;
const GAME_STATE_GAME_OVER = 4;
export default function Games() {
  // const [level, setLevel] = useLocalStorage<string>("level", "1");
  // const [gameState, setGameState] = useState(1);
  const [value, setValue] = useLocalStorage('level', 1)

  // const {theme, setTheme} = useTheme();
  const getGameState = () => {
    if (value === 3) {
      // setLevel("2");
      // setTheme("iceland_sky");
      //add use context for background
      return <AnimatePresence mode="wait">
        <motion.div
          key="next-level"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 1}}
          transition={{duration: 3}}
        ><SnakeGame gameState={(state) => setValue(state)} isNextLevel={true}/></motion.div>
      </AnimatePresence>
    }
    if (value === 4) {
      return <AnimatePresence mode="wait">
        <motion.div
          key="game-over"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 1}}
          transition={{duration: 1}}

        ><GameOver gameState={(state) => setValue(state)}/></motion.div>
      </AnimatePresence>
    }
    if (value === 2) {
      return <AnimatePresence mode="wait">
        <motion.div
          key="snake-play"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 1}}
          transition={{duration: 1}}
        ><SnakeGame gameState={(state) => setValue(state)} shouldStartGame={true}/></motion.div>
      </AnimatePresence>
    }
    return <AnimatePresence mode="wait">
      <motion.div
        key="snake"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 1}}
        transition={{duration: 1}}
      ><SnakeGame gameState={(state) => setValue(state)} isGameStart={false}/></motion.div>
    </AnimatePresence>
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "8rem",
      }}
    >
      {/*<GameOver/>*/}
      {getGameState()}
    </div>
  );
}
