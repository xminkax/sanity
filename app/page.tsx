"use client";
import React from "react";

const welcomeTexts: string[] = ["Hello world", "Ahoj svet", "I am monika", "I enjoy coding"];

export default function Home() {
  return (
    <main className="h-screen">
      <section className="flex justify-center flex-col h-full items-center p-16">
        <div className="typewriter">
          {welcomeTexts.map((item: string, key: number) => (
            <h1
              key={item}
              className="font-bold text-4xl sm:text-6xl"
              style={{
                maxWidth: `calc(${item.length} * 1ch)`,
                animation: `typing 3s steps(${item.length * 2}, end), ${key + 1 === welcomeTexts.length ? "slideLastElement 3s forwards" : "slide 3s 1"}, blink-caret .6s step-end infinite`,
                animationDelay: `${key * 3}s`,
              }}
            >
              {item}
            </h1>
          ))}
        </div>
        <div className="sm:py-10 py-8">
          <p className="mt-6 sm:text-3xl text-2xl leading-8 text-center">
            Can you see the yellow star?
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
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
