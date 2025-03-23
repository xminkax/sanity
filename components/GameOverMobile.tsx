import { Press_Start_2P } from "next/font/google";
import React, { useEffect, useState } from "react";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
export default function GameOverMobile() {
  return (
    <div
      className={`game-over-mobile flex flex-col items-center justify-center h-screen ${pressStart2P.className}`}
    >
      {/* Smooth Pixelated Game Over Text */}
      <h1
        className="text-6xl uppercase  mb-8 font-bold text-center text-[wheat]"
        style={{ textShadow: "2px 2px 0px rgba(224, 181, 173, 0.8)" }}
      >
        Game over
      </h1>
      {/*<div className="animate-snake">~~~~~~~~~🐍</div>*/}
      <button className="mt-6 px-6 py-3 reset-btn text-2xl">Restart</button>
    </div>
  );
}
