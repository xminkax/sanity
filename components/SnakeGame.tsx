"use client";
import "@/app/globals.css";
import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Gesture from "../public/gesture.svg";
import {
  GameState,
  levelWinTexts,
  LevelWinBackgrounds,
  MOBILE_SIZE_CANCAS,
} from "@/constants/snake";

const SNAKE_COLOR = "#3acfd5";
const FOOD_COLOR = "#ffb3b3";
const LEVEL_SPEED = 20;
const SCORE_LEVEL_MULTIPLICATOR = 3;

const generateFoodPosition = (canvasWidth, canvasHeight, unitSize) => {
  return {
    x: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize,
    y: Math.floor(Math.random() * (canvasHeight / unitSize)) * unitSize,
  };
};

export default function SnakeGame({ gameState, win, startGame, gameOver, level }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasConfig, setCanvasConfig] = useState(null);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [counter, setCounter] = useState<number>(0);
  const [snake, setSnake] = useState<{ x: number; y: number }[]>();
  const [food, setFood] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
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
      unitSize = 24;
      numberOfCells = 25;
      width = unitSize * 50;
      height = unitSize * numberOfCells;
    }
    setCanvasConfig({ width, height, unitSize });
    setSnake([
      {
        x: defaultSnakePosition * unitSize,
        y: defaultSnakePosition * unitSize,
      },
      {
        x: defaultSnakePosition * unitSize - unitSize,
        y: defaultSnakePosition * unitSize,
      },
      {
        x: defaultSnakePosition * unitSize - 2 * unitSize,
        y: defaultSnakePosition * unitSize,
      },
    ]);
    //todo add check that it doesn't exist
    setFood(
      generateFoodPosition(width, height, unitSize, {
        x: defaultSnakePosition * unitSize,
        y: defaultSnakePosition * unitSize,
      }),
    );
  }, []);

  const updateSnake = useCallback(() => {
    const { width, height, unitSize } = canvasConfig;
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
      const { unitSize } = canvasConfig;
      let directionTemp;
      switch (directionText) {
        case "left":
          directionTemp = { x: -unitSize, y: 0 };
          break;
        case "right":
          directionTemp = { x: unitSize, y: 0 };
          break;
        case "up":
          directionTemp = { x: 0, y: -unitSize };
          break;
        case "down":
          directionTemp = { x: 0, y: unitSize };
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
    const { width, height, unitSize } = canvasConfig;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = SNAKE_COLOR;
      ctx.fillRect(snake[0].x, snake[0].y, unitSize, unitSize);

      ctx.strokeStyle = SNAKE_COLOR;
      ctx.lineWidth = 4; // Border thickness
      ctx.strokeRect(snake[0].x, snake[0].y, unitSize, unitSize);

      ctx.fillStyle = "wheat"; // Eye color
      const eyeSize = 4;
      const eyeOffsetX = 7;
      const eyeOffsetY = 7;

      // Left eye
      ctx.beginPath();
      ctx.strokeStyle = "black"; // Border color for the eyes
      ctx.lineWidth = 1;
      ctx.arc(snake[0].x + eyeOffsetX, snake[0].y + eyeOffsetY, eyeSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Right eye
      ctx.beginPath();
      ctx.arc(snake[0].x + unitSize - eyeOffsetX, snake[0].y + eyeOffsetY, eyeSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      snake.forEach((unit, index) => {
        if (index > 0) {
          ctx.fillStyle = index === 0 ? "wheat" : SNAKE_COLOR;
          ctx.fillRect(unit.x, unit.y, unitSize, unitSize);
        }
      });
    }
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(food.x, food.y, unitSize, unitSize);

    ctx.backgroundColor = "#111111";
  }, [gameState, canvasConfig, food.x, food.y, snake]);

  useEffect(() => {
    paint();

    if (counter === SCORE_LEVEL_MULTIPLICATOR * level) {
      // paint();
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
      // myReference.style.backgroundColor = "#202020";
      setShouldAnimate(false);
    }
  }, [shouldAnimate]);

  useEffect(() => {
    if (direction.x === 0 && direction.y === 0) {
      return;
    }
    const interval = setInterval(
      () => {
        updateSnake();
      },
      120 - LEVEL_SPEED * level,
    );
    return () => {
      clearInterval(interval);
    };
  }, [direction, snake, updateSnake, level]);

  const handleTouchStart = (event) => {
    // event.preventDefault();
    setStartX(event.touches[0].clientX);
    setStartY(event.touches[0].clientY);
  };

  return (
    <div className="flex flex-col justify-center h-screen ">
      <div className="flex py-6 justify-self-start">
        <div style={{ marginRight: "2rem" }} className="text-[wheat] uppercase">
          Score:{counter}/{SCORE_LEVEL_MULTIPLICATOR * level}
        </div>
        <div style={{ marginRight: "2rem" }} className="text-[wheat] uppercase">
          Level:{level}
        </div>
      </div>
      <div style={{ zIndex: 2, position: "relative" }}>
        {canvasConfig && (
          <canvas
            className="panel"
            ref={canvasRef}
            width={canvasConfig.width}
            height={canvasConfig.height}
            style={{
              // border: "8px solid",
              // borderImage: "linear-gradient(to right, wheat 0%, wheat 100%) 1",
              // touchAction: "none",
              // backgroundColor: "rgba(182, 255, 198, 1)",
              // zIndex: 2,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          />
        )}
        {canvasConfig && gameState === GameState.MENU && (
          <div className="overlay">
            <button className="retro-button btn-snake" onClick={startGame}>
              Play
            </button>
            <Image className="icon-gesture" src={Gesture} alt="Gesture how to play" />
          </div>
        )}
      </div>
    </div>
  );
}
