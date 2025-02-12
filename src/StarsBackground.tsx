"use client";
import React, {useState} from "react";

const NUM_STARS: number = 120;

interface StarStyle {
  width: string;
  height: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  top: string;
}

const lala = () => {
  let starStyle: StarStyle[] = [];

  Array.from({length: NUM_STARS}).map((_, index) => {
    const size = Math.random() * 20 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 10 + 10;
    const transform = Math.random() + 100;

    starStyle.push({
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}vw`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      top: `${transform}px`,
    });
  });

  return starStyle;
}

const naan = lala();

const generateStars = (): JSX.Element[] => {
  const [isClicked, setIsClicked] = useState(null)
  return naan.map((_, index) => {

    const classNames = ['star', index % 10 === 0 ? ' yellow-star' : ''];
    if (isClicked && index === isClicked) {
      classNames.push(" star-hover");
    }
    return (
      <div
        onClick={(event) => setIsClicked(event.currentTarget.attributes.getNamedItem("data-key")?.value)}
        data-key={index}
        key={index}
        className={classNames.join("")}
        style={_}
      ></div>
    );
  });
};

const StarsBackground: React.FC = (): JSX.Element => {
  return (
    <div className="stars-container">
      {generateStars()}
    </div>
  );
};

export default StarsBackground;
