'use client';
import React, {useEffect, useRef, useState} from "react";

const welcomeTexts: string[] = [
  "Hello world",
  "I am monika",
  "I enjoy coding"
];
let max = 0;
export default function Home() {
  const [widths, setWidths] = useState([0, 0, 0]);
  const elementsRef = useRef([]);

  useEffect(() => {
    // Get the width using offsetWidth
    const elementWidths = elementsRef.current.map(el => el ? el.offsetWidth : 0);
    setWidths(elementWidths);

  }, []);
  return (
    <main className="h-screen">
      <section
        className="flex justify-center flex-col"
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "4rem"
        }}>
        <div className="typewriter">
          {welcomeTexts.map((item: string) =>
            <h1 key={item} className="font-bold text-4xl sm:text-6xl"
                style={{
                  '--characters': item.length,
                }}
            >
              {item}
            </h1>
          )}
        </div>
        <div style={{padding: "4rem"}}>
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
