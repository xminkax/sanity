import React from "react";

const NUM_STARS = 120; // Number of stars

const generateStars = () => {
    return Array.from({length: NUM_STARS}).map((_, index) => {
        const size = Math.random() * 4 + 2; // Size between 1px and 3px
        const left = Math.random() * 100; // Position in viewport width (vw)
        const delay = Math.random() * 10; // Staggered animation delay
        const duration = Math.random() * 10 + 10; // Animation speed (3s - 8s)
        const transform = Math.random() + 100;

        return (

            <div key={index}
                 className={['star', index % 10 === 0 ? ' yellow-star' : ''].join("")}
                 style={{
                     width: `${size}px`,
                     height: `${size}px`,
                     left: `${left}vw`,
                     animationDuration: `${duration}s`,
                     animationDelay: `${delay}s`,
                     top: transform
                 }}
            ></div>

        )
            ;
    });
};

const StarsBackground = () => {
    return <div className="stars-container">{generateStars()}
        <div>;a;a;a</div>
    </div>;
};

export default StarsBackground;