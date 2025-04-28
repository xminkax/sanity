"use client";
import React from "react";
import { rajdhani } from "@/lib/fonts";
import Link from "next/link";

interface PanelProps {
  texts: string[];
  title: string;
  isOffsetAnimation?: boolean;
  button: {
    label: string;
    url: string;
    isInternal?: boolean;
  };
}

const Panel = ({ texts, title, button, isOffsetAnimation = false }: PanelProps) => {
  return (
    <section
      className={`sm:p-6 p-4 panel relative backdrop-blur-[2px] backdrop-filter sm:mb-12 mb-7 flex flex-col fade-in mx-4 el max-w-[48rem] self-center`}
    >
      <h3
        className="sm:my-4 my-2 md:text-4xl sm:text-3xl text-2xl  sm:scroll-mt-28 scroll-mt-20 font-bold leading-8 text-center"
        id={title.toLowerCase().replace(/ /g, "-")}
      >
        {title}
      </h3>
      {
        // eslint-disable-next-line react/no-unescaped-entities
        texts.map((item, key) => (
          <p
            key={key}
            className={`text-textColor sm:my-4 my-3 sm:text-base text-sm panel__description ${rajdhani.className}`}
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))
      }
      <div className="justify-center flex my-4">
        {button?.isInternal && (
          <Link href={button.url} className="home__btn--secondary focus-ring">
            {button.label}
          </Link>
        )}
        {!button?.isInternal && (
          <a href={button.url} className="home__btn--secondary focus-ring">
            {button.label}
          </a>
        )}
      </div>
      {isOffsetAnimation && <div className="border-beam" />}
    </section>
  );
};

export default Panel;
