import React from "react";

const NUM_STARS: number = 120;

interface StarStyle {
  width: string;
  height: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  top: string;
}

const generateStars = (): JSX.Element[] => {
  return Array.from({length: NUM_STARS}).map((_, index) => {
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 10 + 10;
    const transform = Math.random() + 100;

    const starStyle: StarStyle = {
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}vw`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      top: `${transform}px`,
    };

    return (
      <div
        key={index}
        className={['star', index % 10 === 0 ? ' yellow-star' : ''].join("")}
        style={starStyle}
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
