"use client";
import SnakeGame from "@/src/SnakeGame";
import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import NextLevel from "@/src/NextLevel";
import GameOver from "@/src/GameOver";

const GAME_STATE_START = 1;
const GAME_STATE_PLAY = 2;
const GAME_STATE_NEXT_LEVEL = 3;
const GAME_STATE_GAME_OVER = 4;
export default function Games() {
  const [gameState, setGameState] = useState(1);
  const getGameState = () => {
    if (gameState === 3) {
      //add use context for background
      return <AnimatePresence mode="wait">
        <motion.div
          key="next-level"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 1}}
          transition={{duration: 3}}
        ><SnakeGame gameState={(state) => setGameState(state)} isNextLevel={true} /></motion.div>
      </AnimatePresence>
    }
    if (gameState === 4) {
      return <AnimatePresence mode="wait">
        <motion.div
          key="game-over"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 1}}
          transition={{duration: 1}}

        ><GameOver gameState={(state) => setGameState(state)}/></motion.div>
      </AnimatePresence>
    }
    if (gameState === 2) {
      return <AnimatePresence mode="wait">
        <motion.div
          key="snake-play"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 1}}
          transition={{duration: 1}}
        ><SnakeGame gameState={(state) => setGameState(state)} shouldStartGame={true}/></motion.div>
      </AnimatePresence>
    }
    return <AnimatePresence mode="wait">
      <motion.div
        key="snake"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 1}}
        transition={{duration: 1}}
      ><SnakeGame gameState={(state) => setGameState(state)} isGameStart={false}/></motion.div>
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
