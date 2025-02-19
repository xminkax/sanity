import React from "react";

const NUM_STARS: number = 100;

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
    const size = Math.random() * 6 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 10 + 10;
    const transform = Math.random() + 100;

    const starStyle = {
      left: Math.random() * 100 + "vw",
      animationDelay: Math.random() * 3 + "s",
      top: Math.random() * 100 + "vh"
    };


    return (
      <>
        <div
          key={index}
          className={['star', index % 20 === 0 ? ' yellow-star' : ''].join("")}
          style={starStyle}
        ></div>
      </>
    );
  });
};

const StarsBackground: React.FC = (): JSX.Element => {
  return (
    <>
      <div className="stars">
        {generateStars()}
      </div>
      <div className="aurora"></div>
    </>
  );
};

export default StarsBackground;
