"use client";
import React from "react";

const welcomeTexts: string[] = ["Hello world", "I am Monika", "I enjoy coding"];

export default function Home() {
  return (
    <main className="h-screen">
      <section className="flex justify-center flex-col h-full items-center">
        <div className="typewriter">
          {welcomeTexts.map((item: string, key: number) => (
            <h1
              key={item}
              className="font-bold text-4xl sm:text-5xl md:text-7xl"
              style={{
                maxWidth: `calc(${item.length} * 1ch)`,
                animation: `typing 4s steps(${Math.floor(item.length * 2)}, end), blink-caret .6s step-end infinite, 
                ${
                  key + 1 === welcomeTexts.length ? `slideLastElement 4s forwards` : `slide 4s 1`
                }`,
                animationDelay: `${key * 4}s`,
              }}
            >
              {item}
            </h1>
          ))}
        </div>
        <div className="md:py-14 sm:py-11 py-6">
          <p className="my-4 md:text-4xl sm:text-3xl text-2xl leading-8 text-center">
            Can you see the yellow star?
          </p>
          <div className="mt-8 sm:mt-12 flex items-center justify-center gap-x-6">
            <a
              onClick={() => alert("coming soon")}
              href="#"
              className="inline-block px-6 py-3 text-white font-semibold text-lg bg-gradient-to-r from-indigo-800 via-purple-700 to-indigo-900 rounded-lg transform transition-all hover:scale-105 hover:from-purple-800 hover:via-indigo-700 hover:to-purple-900"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
