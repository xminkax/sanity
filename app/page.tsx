"use client";
import React from "react";
import Hero from "@/components/Hero";
import Panel from "@/components/Panel";

const welcomeTexts: string[] = ["Hello world", "I am Monika", "I enjoy coding"];
const aboutMe = {
  title: "About me",
  button: { label: "Resume", url: "Link" },
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
  button: { label: "Play", url: "Link" },
  texts: [
    'I started my coding journey in <a class="panel__link" href=""\n' +
      ">Pascal</a> and\n" +
      "          Ui journey with OpenGL while learning <a\n" +
      '            href="" class="panel__link">NeHe</a> tutorials. One of my early attempts was to create\n' +
      "          a Snake game in Pascal and Windows screensaver in OpenGL to animate particles effect. That was a long time\n" +
      "          ago.",
    "I wanted to remind myself of these times and recreate those projects using today's\n" +
      "          technologies to see how it feels. Are you curious?",
  ],
};

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero welcomeTexts={welcomeTexts} />
      <Panel texts={aboutMe.texts} title={aboutMe.title} button={aboutMe.button} />
      <Panel texts={snake.texts} title={snake.title} button={snake.button} />
    </main>
  );
}
