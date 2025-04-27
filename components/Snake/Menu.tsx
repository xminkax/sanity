import React from "react";

type MenuProps = {
  startGame: () => void;
};

export default function Menu({ startGame }: MenuProps) {
  return (
    <div
      className={`game-over-mobile flex flex-col items-center justify-center md:h-screen md:mt-0 mt-44`}
    >
      <h1 className="sm:text-5xl text-3xl uppercase  mb-8 font-bold text-center text-[wheat] text-shadow">
        Snake
      </h1>
      <p className="text-[#F0E6D2] max-w-xl mb-4 sm:text-lg text-sm text-center px-2">
        Step into my memories and come beneath a sky of forgotten effects. Each win reveals the sky
        in motion.
      </p>
      <div className="flex flex-col items-stretch gap-2">
        <button
          onClick={startGame}
          className="mt-6 px-6 py-3 snake__btn--next-level text-2xl focus-ring"
        >
          Play
        </button>
      </div>
    </div>
  );
}
