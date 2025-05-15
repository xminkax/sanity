"use client";
import React from "react";
import Hero from "@/components/Homepage/Hero";
import Panel from "@/components/Homepage/Panel";

const welcomeTexts: string[] = ["Hello world", "I am Monika", "I enjoy coding"];
const aboutMe = {
  title: "About me",
  button: { label: "Resume", url: "/resume" },
  texts: [
    "I am a software engineer with over 12 years of professional experience.",
    "I am passionate about developing applications that simplify people's everyday lives.",
    "I like the detective part of the job. The adrenaline rush that comes when a bug is successfully\n" +
      "      debugged and\n" +
      "      fixed.",
    "What engages me the most are discussions with colleagues to find the best solution\n" +
      "      at\n" +
      "      the time.",
  ],
};
const snake = {
  title: "Snake game",
  button: { label: "Play", url: "/games", isInternal: true },
  texts: [
    'I started my coding journey in <a class="panel__link focus-ring" target="_blank" href="https://en.wikipedia.org/wiki/Pascal_(programming_language)"\n' +
      '>Pascal</a> and UI part with <a class="panel__link focus-ring" target="_blank" href="https://www.opengl.org/">OpenGL</a> while learning <a\n' +
      '            class="panel__link focus-ring" href="https://nehe.gamedev.net/tutorial/lessons_01__05/22004/" target="_blank">NeHe</a> tutorials. One of my early attempts was to create\n' +
      "          a Snake game in Pascal and Windows screensaver in OpenGL to animate particle effects. That was a long time\n" +
      "          ago.",
    "I wanted to remind myself of these times and recreate those projects using today's\n" +
      "          technologies. Are you curious?",
  ],
};

export default function Home() {
  return (
    <>
      <Hero welcomeTexts={welcomeTexts} />
      <Panel texts={aboutMe.texts} title={aboutMe.title} button={aboutMe.button} />
      <Panel texts={snake.texts} title={snake.title} button={snake.button} isOffsetAnimation />
    </>
  );
}
