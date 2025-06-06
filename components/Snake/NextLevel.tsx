import React from "react";

interface NextLevelProps {
  resetGame: () => void;
  handleNextLevel: () => void;
  nextLevel: number;
}

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
    "The Lorenz attractor guides your path now, its butterfly wings carving chaos into elegant symmetry.",
  ],
  level_5: [
    "A new world awaits. Get ready to venture through the stars and beyond. Coming soon...",
  ],
};

export default function handleNextLevel({ resetGame, handleNextLevel, nextLevel }: NextLevelProps) {
  return (
    <div
      className={`game-over-mobile flex flex-col items-center justify-center md:h-full mt-44 px-3 mb-14`}
    >
      <h1
        className={`sm:text-5xl text-3xl uppercase  mb-8 font-bold text-center text-shadow ${nextLevel === 4 ? "text-[#9a6faf]" : "text-[#F0E6D2]"}`}
      >
        Level:{nextLevel - 1} cleared
      </h1>
      {dictionary[("level_" + (nextLevel - 1)) as keyof typeof dictionary].map((item, _) => (
        <p
          key={_}
          className={`${nextLevel === 4 ? "text-[#493552]" : "text-[#F0E6D2]"} max-w-xl sm:text-lg text-sm text-center mb-2`}
        >
          {item}
        </p>
      ))}
      <div className="flex flex-col items-stretch gap-2">
        <button
          onClick={handleNextLevel}
          className="mt-6 px-6 py-3 snake__btn--next-level text-2xl focus-ring"
        >
          Level {nextLevel}
        </button>
        <button
          onClick={resetGame}
          className="mt-6 px-6 py-3 snake__btn--reset text-2xl focus-ring"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
