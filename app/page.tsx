'use client';
import React from "react";

const welcomeTexts: string[] = [
  "Welcome!",
  "I am monika",
  "I enjoy coding"
]
export default function Home() {
  return (
    <main className="flex justify-center items-center h-screen">
      <section>
        <div className="flex justify-center">
          <div className="typewriter flex-row flex">
            {welcomeTexts.map((item: string) =>
              <h1 key={item} className="font-bold text-4xl sm:text-6xl">
                {item}
              </h1>
            )}
          </div>
        </div>
        <div>
          <p className="mt-6 sm:text-3xl text-2xl leading-8 text-center">Can you see the yellow star?
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a onClick={() => alert("coming soon")} href="#"
               className="inline-block px-6 py-3 text-white font-semibold text-lg bg-gradient-to-r from-indigo-800 via-purple-700 to-indigo-900 rounded-lg transform transition-all hover:scale-105 hover:from-purple-800 hover:via-indigo-700 hover:to-purple-900">
              Learn more</a>
          </div>
        </div>
      </section>
    </main>
  )
    ;
}
