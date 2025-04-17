import {Press_Start_2P} from "next/font/google";
import React from "react";

type props = {
  resetGame: () => void;
  handleNextLevel: () => void;
  nextLevel: number;
};

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const dictionary = {
  level_1: ["You have entered the Aurora Borealis. Time slows. Stop and observe."],
  level_2: [
    "You have entered the space and the comete has arrived.",
    "No sound, no music. Only silence and stars.",
    "Wish something, not out loud, not with words. Just wish.",
  ],
  level_3: [
    "Drift through the vast expanse of the cosmos, where swirling nebulae and shifting clouds paint the fabric of space.",
  ],
  level_4: [
    "A new world awaits. Get ready to venture through the stars and beyond. Coming soon...",
  ],
};

export default function handleNextLevel({resetGame, handleNextLevel, nextLevel}: props) {
  return (
    <div
      className={`game-over-mobile flex flex-col items-center justify-center h-screen ${pressStart2P.className}`}
    >
      <h1
        className={`sm:text-5xl text-3xl uppercase  mb-8 font-bold text-center ${nextLevel === 4 ? "text-[#9a6faf]": "text-[#F0E6D2]"}`}
        style={{ textShadow: "2px 2px 0px rgba(224, 181, 173, 0.8)" }}
      >
        Level:{nextLevel - 1} cleared
      </h1>
      {dictionary["level_" + (nextLevel - 1)].map((item, _) => (
        <p key={_} className={`px-2 ${nextLevel === 4 ? "text-[#493552]": "text-[#F0E6D2]"} max-w-xl sm:text-lg text-sm text-center mb-2`}>
          {item}
        </p>
      ))}
      <div className="flex flex-col items-stretch gap-2">
        <button onClick={handleNextLevel} className="mt-6 px-6 py-3 next-level-btn text-2xl">
          Level {nextLevel}
        </button>
        <button onClick={resetGame} className="mt-6 px-6 py-3 reset-btn text-2xl">
          Reset
        </button>
      </div>
    </div>
  );
}
