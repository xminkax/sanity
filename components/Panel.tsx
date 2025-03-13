import React from "react";
import {Space_Mono} from 'next/font/google'

const rajdhani = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
});

interface Props {
  texts: string[];
  title: string;
  button: {
    label: string;
    url: string;
  };
}

const Panel: React.FC<Props> = ({texts, title, button}) => {
  return <section
    className={`sm:p-6 p-4 panel relative backdrop-blur-lg backdrop-filter sm:mb-12 mb-7 flex flex-col fade-in mx-4 el max-w-[48rem] self-center`}>
    <h2 className="sm:my-4 my-2 md:text-4xl sm:text-3xl text-2xl font-bold leading-8 text-center">{title}</h2>
    {
      // eslint-disable-next-line react/no-unescaped-entities
      texts.map((item, key) => (
        <p key={key}
           className={`text-textColor sm:my-4 my-3 sm:text-base text-sm panel__description ${rajdhani.className}`}
           dangerouslySetInnerHTML={{__html: item}}/>)
      )
    }
    <div className="justify-center flex my-4">
      <a href="" className="home__btn--secondary">{button.label}</a>
    </div>
    <div className="border-beam"/>
  </section>
}

export default Panel;
