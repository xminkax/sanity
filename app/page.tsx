"use client";
import React from "react";
import {Space_Mono} from 'next/font/google'
import Hero from "@/src/Hero"
import Panel from "@/src/Panel"

export const rajdhani = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
})

const welcomeTexts: string[] = ["Hello world", "I am Monika", "I enjoy coding"];
const aboutMe = {
  title: "About me",
  button: {text: "Resume", link: "Link"},
  texts: ['I am a software engineer with 12+ years professional experience.',
    'I am passionate about developing applications that simplify people\'s everyday\n' +
    '            lives.',
    'I like a detective part. The adrenalin that comes when bug is successfully\n' +
    '      debugged and\n' +
    '      found.', 'What engage me are discussions with colleagues to find the best solution\n' +
    '      at\n' +
    '      the time.']
};
const snake = {
  title: "Snake game",
  button: {text: "Play", link: "Link"},
  texts: ['I started my coding journey in <a href=""\n' +
  '                                                                          className="animated-underline">pascal</a> and\n' +
  '          Ui journey with opengl while learning <a\n' +
  '            href="" className="animated-underline">nehe</a> tutorials. One of my attempts was to create\n' +
  '          a snake game in pascal and windows screen saver in opengl to animate particles effect. It was a long time\n' +
  '          ago.',
    'I wanted to remind myself these time and create it with today\'s\n' +
    '          technologies to see how it feels. Are you curious?']
};

export default function Home() {
  return (
    <main className="flex flex-col mt-40">
      <Hero welcomeTexts={welcomeTexts}/>
      <Panel texts={aboutMe.texts} title={aboutMe.title} button={aboutMe.button}/>
      <Panel texts={snake.texts} title={snake.title} button={snake.button}/>
    </main>
  );
}
