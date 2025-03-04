"use client";
import SnakeGame from "@/src/SnakeGame";
import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useLocalStorage} from 'usehooks-ts'
import GameOver from "@/src/GameOver";
import {GameState} from "@/constants/snake";

export default function Games() {
  const [levelWin, setLevelWin] = useLocalStorage<string>('levelWin', null);
  const [level, setLevel] = useState<number>(levelWin ? Number(levelWin) + 1 : 1);
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "8rem",
      }}
    >
      {gameState === GameState.MENU &&
        <AnimatePresence mode="wait">
          <motion.div
            key={GameState.MENU}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 1}}
            transition={{duration: 0.2}}
          ><SnakeGame gameState={GameState.MENU} level={level} startGame={() => setGameState(GameState.PLAYING)}/>
          </motion.div>
        </AnimatePresence>}
      {gameState === GameState.PLAYING &&
        <AnimatePresence mode="wait">
          <motion.div
            key={GameState.PLAYING}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 1}}
            transition={{duration: 2}}
          ><SnakeGame gameState={GameState.PLAYING} level={level} gameOver={() => setGameState(GameState.GAME_OVER)}
                      win={() => {
                        setLevelWin(level);
                        setGameState(GameState.WIN);
                      }}/></motion.div>
        </AnimatePresence>}
      {gameState === GameState.WIN &&
        <AnimatePresence mode="wait">
          <motion.div
            key={GameState.WIN}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 1}}
            transition={{duration: 3}}
          ><SnakeGame gameState={GameState.WIN} nextLevel={() => setLevel(level + 1)}
                      startGame={() => setGameState(GameState.PLAYING)}
                      level={level}
                      restartGame={() => setGameState(GameState.MENU)}/></motion.div>
        </AnimatePresence>}
      {gameState === GameState.GAME_OVER &&
        <AnimatePresence mode="wait">
          <motion.div
            key={GameState.GAME_OVER}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 1}}
            transition={{duration: 3}}
          ><GameOver gameState={GameState.GAME_OVER} restartGame={() => setGameState(GameState.PLAYING)}/></motion.div>
        </AnimatePresence>}
    </div>
  );
}
