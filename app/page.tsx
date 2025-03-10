"use client";
import React from "react";
import {Space_Mono} from 'next/font/google'
import Terminal from "@/src/Terminal";

export const rajdhani = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
})

const welcomeTexts: string[] = ["Hello world", "I am Monika", "I enjoy coding"];

export default function Home() {
  return (
    <main className="h-screen flex flex-col mt-40">
      <section className="flex justify-center flex-col items-center">
        <div className="typewriter">
          {welcomeTexts.map((item: string, key: number) => (
            <h1
              key={item}
              className="font-bold text-4xl sm:text-5xl md:text-7xl"
              style={{
                maxWidth: `calc(${item.length} * 1ch)`,
                animation: `typing 3s steps(${Math.floor(item.length * 2)}, end), blink-caret .6s step-end infinite, 
                ${key + 1 === welcomeTexts.length ? `slideLastElement 3s forwards` : `slide 3s 1`}`,
                animationDelay: `${key * 3 + 0.5}s`,
              }}
            >
              {item}
            </h1>
          ))}
        </div>
        <div className="animated-text  md:py-14 sm:py-11 py-6">
          <p className="my-4 md:text-4xl sm:text-3xl text-2xl leading-8 text-center">
            Can you see the yellow star?
          </p>
          <div className="mt-8 sm:mt-12 flex items-center justify-center gap-x-6">
            <a
              onClick={() => alert("coming soon")}
              href="#"
              className="inline-block home px-6 py-3 font-bold text-2xl shadow-md transition duration-300
            learn-more"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>
      <section
        className={`card animated-gradient-border mb-10 flex flex-col ${rajdhani.className} animated-text mx-4`}
        style={{maxWidth: "48rem", alignSelf: "center"}}>
        <div className="inner p-6">
          <h2 className="my-4 md:text-4xl sm:text-3xl text-4xl font-bold leading-8 text-center">About me</h2>
          <p className="my-4 description">I am a software engineer with 12+ years professional experience.</p>
          <p className="my-4 description">I am passionate about developing applications that simplify people's everyday
            lives.</p>
          <p className="my-4 description">I like a detective part. The adrenalin that comes when bug is successfully
            debugged and
            found.</p>
          <p className="mt-4 mb-8 description">What engage me are discussions with colleagues to find the best solution
            at
            the time.</p>
          <div className="justify-center flex mb-8">
            <button className="home home-btn-description text-2xl">Resume</button>
          </div>
        </div>
      </section>
      <section
        className={`flex justify-center items-center mb-10 card animated-gradient-border animated-text mx-4 ${rajdhani.className}`}
        style={{maxWidth: "48rem", alignSelf: "center"}}>
        <div className="inner">
          <h2 className="my-4 md:text-4xl sm:text-3xl text-4xl font-bold leading-8 text-center">Snake Game</h2>
          <p className="my-4 description">I started my coding journey in <a href=""
                                                                            className="animated-underline">pascal</a> and
            Ui journey with opengl while learning <a
              href="" className="animated-underline">nehe</a> tutorials. One of my attempts was to create
            a snake game in pascal and windows screen saver in opengl to animate particles effect. It was a long time ago.
          </p>
          <p className="mt-4 mb-8 description">I wanted to remind myself these time and create it with today's technologies to see how it feels. Are you curious?</p>
          <div className="justify-center flex mb-8">
            <button className="home home-btn-description text-2xl">Play</button>
          </div>
        </div>
      </section>

      {/*<section*/}
      {/*  className={`flex justify-center items-center mx-auto mb-10 card mb-60 example-1 animated-text ${rajdhani.className}`}*/}
      {/*  style={{color: "#BCC8D0", maxWidth: "46rem"}}>*/}
      {/*  <div className="inner">*/}
      {/*    <h2 className="my-4 md:text-4xl sm:text-3xl text-4xl font-bold leading-8 text-center">Snake Game</h2>*/}
      {/*    <p>I started my coding journey in pascal and Ui journey with opengl. I had an attempt to create snake game in*/}
      {/*      pascal and windows screen saver in opengl to animate particles effect. It was a long time ago. So I thought*/}
      {/*      it*/}
      {/*      could be fun to create it with modern tools. So here it is. You can play and explore different attributes of*/}
      {/*      night sky as you clear levels.</p>*/}
      {/*    <button>Play</button>*/}
      {/*  </div>*/}
      {/*</section>*/}
      <div>footer</div>
    </main>
  );
}
