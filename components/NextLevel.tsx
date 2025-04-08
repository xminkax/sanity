import { Press_Start_2P } from "next/font/google";
import React, { useEffect, useState } from "react";

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
export default function handleNextLevel({ resetGame, handleNextLevel, nextLevel }: props) {
  return (
    <div
      className={`game-over-mobile flex flex-col items-center justify-center h-screen ${pressStart2P.className}`}
    >
      {nextLevel && <span>Level {nextLevel}</span>}
      <h1
        className="text-6xl uppercase  mb-8 font-bold text-center text-[wheat]"
        style={{ textShadow: "2px 2px 0px rgba(224, 181, 173, 0.8)" }}
      >
        Level up
      </h1>
      <h2 className="text-[#F0E6D2] max-w-xl text-center">
        You will see soon shooting star, wish something.
      </h2>
      <div className="flex flex-col items-stretch gap-2">
        <button onClick={handleNextLevel} className="mt-6 px-6 py-3 next-level-btn text-2xl">
          Next level
        </button>
        <button onClick={resetGame} className="mt-6 px-6 py-3 reset-btn text-2xl">
          Reset
        </button>
      </div>
    </div>
  );
}
