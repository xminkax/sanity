import React from "react";

const NUM_STARS = 70; // Number of stars

const generateStars = () => {
    return Array.from({length: NUM_STARS}).map((_, index) => {
        const size = Math.random() * 2 + 2; // Size between 1px and 3px
        const left = Math.random() * 100; // Position in viewport width (vw)
        const delay = Math.random() * 5; // Staggered animation delay
        const duration = Math.random() * 5 + 3; // Animation speed (3s - 8s)

        return (
            <div
                key={index}
                className="star"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}vw`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                }}
            ></div>
        );
    });
};

const StarsBackground = () => {
    return <div className="stars-container">{generateStars()}</div>;
};

export default StarsBackground;