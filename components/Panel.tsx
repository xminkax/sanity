import React from "react";
import {rajdhani} from "@/app/page";

const Panel: React.FC<> = ({texts, title, button}) => {
  return <section
    className={`p-6 panel panel1 relative mb-10 flex flex-col ${rajdhani.className} animated-text mx-4 el`}
    style={{maxWidth: "48rem", alignSelf: "center"}}>
    <h2 className="my-4 md:text-4xl sm:text-3xl text-4xl font-bold leading-8 text-center">{title}</h2>
    {
      // eslint-disable-next-line react/no-unescaped-entities
      texts.map((item, key) => (
        <p key={key} className="my-4 description"  dangerouslySetInnerHTML={{ __html: item }}/>)
      )
    }
    <div className="justify-center flex mb-8">
      <button className="home home-btn-description text-2xl">{button.text}</button>
    </div>
    <div
      className="absolute inset-0 [border:calc(var(--border-width)*1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:animate-border-beam after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))] z-[-1]"
      style={{
        animation: 'border-beam calc(var(--duration)*1s) infinite linear',
        '--anchor': '90',
        '--border-width': '1',
        '--color-from': 'rgb(254, 209, 199)',
        '--color-to': 'rgb(240, 150, 132)',
        '--delay': '-0s',
        '--duration': '15',
        '--size': '200'
      }}
    ></div>
  </section>
}

export default Panel;
