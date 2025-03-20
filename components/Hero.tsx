import React from "react";

interface StringListProps {
  welcomeTexts: string[];
}

const Hero: React.FC<StringListProps> = ({ welcomeTexts }) => {
  return (
    <section className="flex justify-center flex-col items-center mt-[8rem] sm:mt-[11rem] mb-[2rem] sm:mb-[3rem]">
      <div className="typewriter relative w-full flex justify-center items-center">
        {welcomeTexts.map((item: string, key: number) => (
          <h1
            key={item}
            className="flex absolute invisible font-bold text-[2.75rem] sm:text-7xl pr-2 border-r-4 border-transparent overflow-hidden whitespace-nowrap mr-0"
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
      <div className=".fade-in sm:py-12 py-6 fade-in">
        <p className={`my-4 mx-1 md:text-4xl sm:text-3xl text-2xl leading-8 text-center`}>
          Can you see the yellow star?
        </p>
        <div className="mt-8 sm:mt-12 mb-1 sm:mb-0 flex items-center justify-center gap-x-6">
          <a
            onClick={(e) => {
              e.preventDefault();
              alert("coming soon");
            }}
            href="#"
            className="home__btn--primary"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
