"use client";
import "@/app/globals.css";
import React, {useRef, useEffect, useState, useCallback} from "react";
import Image from "next/image";
import Gesture from "../public/gesture.svg";
import {
  GameState,
  levelWinTexts,
  levelWinBackgrounds,
  MOBILE_SIZE_CANCAS,
} from "@/constants/snake";

const SNAKE_COLOR = "#3acfd5";
const FOOD_COLOR = "#fed1c7";

const generateFoodPosition = (canvasWidth, canvasHeight, unitSize, snake) => {
  return {
    x: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize,
    y: Math.floor(Math.random() * (canvasHeight / unitSize)) * unitSize,
  };
};

export default function SnakeGame({
                                    gameState,
                                    win,
                                    startGame,
                                    gameOver,
                                    restartGame,
                                    levelWin = 1,
                                  }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasConfig, setCanvasConfig] = useState(null);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [counter, setCounter] = useState<number>(0);
  const [snake, setSnake] = useState<{ x: number; y: number }[]>();
  const [food, setFood] = useState<{
    x: number;
    y: number;
  }>({x: 0, y: 0});
  const [direction, setDirection] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  useEffect(() => {
    let unitSize = 15;
    let numberOfCells = 18;
    let width = unitSize * 22;
    let height = unitSize * numberOfCells;
    const defaultSnakePosition = 8;
    if (window.innerWidth > MOBILE_SIZE_CANCAS) {
      unitSize = 22;
      numberOfCells = 30;
      width = unitSize * 50;
      height = unitSize * numberOfCells;
    }
    setCanvasConfig({width, height, unitSize});
    setSnake([{x: defaultSnakePosition * unitSize, y: defaultSnakePosition * unitSize}]);
    //todo add check that it doesn't exist
    setFood(
      generateFoodPosition(width, height, unitSize, {
        x: defaultSnakePosition * unitSize,
        y: defaultSnakePosition * unitSize,
      }),
    );
  }, []);

  const updateSnake = useCallback(() => {
    const {width, height, unitSize} = canvasConfig;
    const newSnakeHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    //wall collision
    if (
      newSnakeHead.x === width ||
      newSnakeHead.y === height ||
      newSnakeHead.x === -unitSize ||
      newSnakeHead.y === -unitSize
    ) {
      gameOver();
      return;
    }

    //snake collision
    if (snake.some((unit) => newSnakeHead.x === unit.x && newSnakeHead.y === unit.y)) {
      gameOver();
    }

    //eats food
    if (newSnakeHead.x === food.x && newSnakeHead.y === food.y) {
      setSnake((prev) => [newSnakeHead, ...prev]);
      setShouldAnimate(true);
      setFood(generateFoodPosition(width, height, unitSize, snake));
      setCounter(counter + 1);
    } else {
      setSnake((prev) => {
        const newSnake = [newSnakeHead, ...prev];
        newSnake.pop();
        return newSnake;
      });
    }
  }, [counter, direction.x, direction.y, food.x, food.y, snake, canvasConfig, gameOver]);

  function isOppositeDirection(val1, val2) {
    if ((val1.x < 0 && val2.x > 0) || (val1.x > 0 && val2.x < 0)) {
      return true;
    }
    if ((val1.y < 0 && val2.y > 0) || (val1.y > 0 && val2.y < 0)) {
      return true;
    }
    return false;
  }

  const setDirectionFromEvents = useCallback(
    (directionText) => {
      const {unitSize} = canvasConfig;
      let directionTemp;
      switch (directionText) {
        case "left":
          directionTemp = {x: -unitSize, y: 0};
          break;
        case "right":
          directionTemp = {x: unitSize, y: 0};
          break;
        case "up":
          directionTemp = {x: 0, y: -unitSize};
          break;
        case "down":
          directionTemp = {x: 0, y: unitSize};
          break;
      }

      setDirection((prev) => {
        if (isOppositeDirection(directionTemp, prev)) {
          return prev;
        }
        return directionTemp;
      });
    },
    [canvasConfig],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (gameState !== GameState.PLAYING) {
        return;
      }
      switch (event.key) {
        case "ArrowLeft":
          setDirectionFromEvents("left");
          break;
        case "ArrowRight":
          setDirectionFromEvents("right");
          break;
        case "ArrowUp":
          setDirectionFromEvents("up");
          break;
        case "ArrowDown":
          setDirectionFromEvents("down");
          break;
      }
    },
    [gameState, setDirectionFromEvents],
  );

  const paint = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;
    if (!canvasConfig) {
      return;
    }
    const {width, height, unitSize} = canvasConfig;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      snake.forEach((unit) => {
        ctx.fillStyle = SNAKE_COLOR;
        ctx.fillRect(unit.x, unit.y, unitSize, unitSize);
      });
    }
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(food.x, food.y, unitSize, unitSize);
  }, [gameState, canvasConfig, food.x, food.y, snake]);

  useEffect(() => {
    paint();

    if (counter === 3) {
      paint();
      win();
    }
  }, [snake, food, counter, paint, win]);

  const handleTouchMove = (event) => {
    if (!startX || !startY) return;

    const diffX = event.touches[0].clientX - startX;
    const diffY = event.touches[0].clientY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      setDirectionFromEvents(diffX > 0 ? "right" : "left");
    } else {
      setDirectionFromEvents(diffY > 0 ? "down" : "up");
    }

    setStartX(null);
    setStartY(null);
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [gameState, onKeyDown]);

  useEffect(() => {
    if (shouldAnimate) {
      const myReference = canvasRef.current;
      myReference.style.backgroundColor = "#0d0d0d";
      setTimeout(() => {
        myReference.style.backgroundColor = "#000000";
      }, 200);
      setShouldAnimate(false);
    }
  }, [shouldAnimate]);

  useEffect(() => {
    if (direction.x === 0 && direction.y === 0) {
      return;
    }
    const interval = setInterval(() => {
      updateSnake();
    }, 180);
    return () => {
      clearInterval(interval);
    };
  }, [direction, snake, updateSnake]);

  const handleTouchStart = (event) => {
    // event.preventDefault();
    setStartX(event.touches[0].clientX);
    setStartY(event.touches[0].clientY);
  };

  return (
    <div>
      <div style={{marginLeft: "1rem"}}>{counter}</div>
      <div style={{zIndex: 2, position: "relative"}}>
        {canvasConfig && (
          <canvas
            className="canvas-snake"
            ref={canvasRef}
            width={canvasConfig.width}
            height={canvasConfig.height}
            style={{
              border: "0.2rem solid",
              borderRadius: "10px",
              borderImage: "linear-gradient(to right, #3acfd5 0%, #3a4ed5 100%) 1",
              touchAction: "none",
              backgroundColor: "black",
              zIndex: 2,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          />
        )}
        {canvasConfig && gameState === GameState.MENU && (
          <div className="overlay">
            <button
              className=" btn-snake px-6 py-3 font-bold text-2xl transition duration-300
            uppercase home"
              onClick={startGame}
            >
              Play
            </button>
            <Image className="icon-gesture" src={Gesture} alt="Gesture how to play"/>
          </div>
        )}
        {gameState === GameState.WIN && (
          <div className="overlay">
            <div className="text-snake">
              <h1 className="uppercase font-bold text-4xl sm:text-5xl md:text-5xl mb-2">
                Congrats!
              </h1>
              <p className="font-bold md:text-4xl">
                {levelWinTexts[levelWinBackgrounds[levelWin]]}
              </p>
            </div>
            <button
              className="home btn-snake px-6 py-3 text-white font-bold text-2xl rounded-lg shadow-md hover:bg-[#32b8bd] transition duration-300
            uppercase"
              onClick={() => {
                startGame();
              }}
            >
              Level 2
            </button>
            <button
              className="home btn-snake px-6 py-3 text-white font-bold text-2xl rounded-lg shadow-md hover:bg-[#32b8bd] transition duration-300
            uppercase"
              onClick={restartGame}
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
