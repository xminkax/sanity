import { Press_Start_2P } from "next/font/google";
import React from "react";

type MenuProps = {
  startGame: () => void; // Type it explicitly
};

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
export default function Menu({ startGame }: MenuProps) {
  return (
    <div
      className={`game-over-mobile flex flex-col items-center justify-center h-screen ${pressStart2P.className}`}
    >
      <h1
        className="text-5xl uppercase  mb-8 font-bold text-center text-[wheat]"
        style={{ textShadow: "2px 2px 0px rgba(224, 181, 173, 0.8)" }}
      >
        Snake
      </h1>
      <p className="text-[#F0E6D2] max-w-xl mb-4 text-lg text-center">
        Step into my memories and come beneath a sky of forgotten effects. Each win reveals the sky in motion.
      </p>
      <div className="flex flex-col items-stretch gap-2">
        <button onClick={startGame} className="mt-6 px-6 py-3 next-level-btn text-2xl">
          Play
        </button>
      </div>
    </div>
  );
}
