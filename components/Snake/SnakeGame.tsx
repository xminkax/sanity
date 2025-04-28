"use client";
import "@/app/globals.css";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { calculateTotalScore } from "@/constants/snake";
import Gesture from "@/public/gesture.svg";
import resolveConfig from "tailwindcss/resolveConfig";
import { orbitron } from "@/lib/fonts";
import tailwindConfig from "../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);

const SNAKE_COLOR = "#3acfd5";
const FOOD_COLOR = "#ffb3b3";
const LEVEL_SPEED = 20;

const generateFoodPosition = (
  canvasWidth: number,
  canvasHeight: number,
  unitSize: number,
  snake: { x: number; y: number }[],
): {
  x: number;
  y: number;
} => {
  const pos = {
    x: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize,
    y: Math.floor(Math.random() * (canvasHeight / unitSize)) * unitSize,
  };
  if (snake && snake.some((unit) => pos.x === unit.x && pos.y === unit.y)) {
    return generateFoodPosition(canvasWidth, canvasHeight, unitSize, snake);
  }
  return pos;
};

interface SnakeProps {
  win: (counter: number) => void;
  gameOver: () => void;
  score: number;
  level: number;
  highScore: number;
}

const parseScreensConfig = (value: string) => parseInt(value, 10);

export default function SnakeGame({ win, gameOver, level, score, highScore }: SnakeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasConfigPrevRef = useRef<{
    width: number;
    height: number;
    unitSize: number;
  } | null>(null);
  const canvasConfigRef = useRef<{
    width: number;
    height: number;
    unitSize: number;
  } | null>(null);
  //todo join to one
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  // const [startY, setStartY] = useState(null);
  const [counter, setCounter] = useState<number>(score);
  const [snake, setSnake] = useState<{ x: number; y: number }[]>();
  const [food, setFood] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);

  const [direction, setDirection] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [pendingWin, setPendingWin] = useState(false);

  const isWin = () => counter === calculateTotalScore(level);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const setupCanvas = useCallback(() => {
    let unitSize;

    const UNITS_WIDE = 31;
    const UNITS_TALL = 24;

    if (window.innerWidth >= parseScreensConfig(fullConfig.theme.screens.xl)) {
      // Desktop
      unitSize = 28;
    } else if (window.innerWidth >= parseScreensConfig(fullConfig.theme.screens.md)) {
      // Tablet
      unitSize = 22;
    } else {
      // Mobile
      unitSize = 12;
    }

    if (canvasConfigPrevRef.current?.unitSize === unitSize && snakeRef.current) {
      return;
    }

    const width = unitSize * UNITS_WIDE;
    const height = unitSize * UNITS_TALL;
    canvasConfigPrevRef.current = { height: 0, unitSize: 0, width: 0, ...canvasConfigRef.current };
    canvasConfigRef.current = { width, height, unitSize };

    const defaultSnakePosition = 8;

    if (!snakeRef.current) {
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
      setFood(generateFoodPosition(width, height, unitSize, snakeRef.current ?? []));
    } else {
      const prevUnitSize = canvasConfigPrevRef.current?.unitSize;
      setSnake(() => {
        const newSnake = snakeRef.current?.map(({ x, y }) => ({
          x: (x / prevUnitSize) * unitSize,
          y: (y / prevUnitSize) * unitSize,
        }));
        return newSnake;
      });

      setFood(() => {
        const newFood = {
          x: Math.floor((foodRef.current.x / prevUnitSize) * unitSize),
          y: Math.floor((foodRef.current.y / prevUnitSize) * unitSize),
        };
        return newFood;
      });
    }
  }, []);

  useEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          setupCanvas();
          resizeTimeout = null;
        }, 200); // 200ms throttle delay
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, [setupCanvas]);

  const updateSnake = useCallback(() => {
    if (!canvasConfigRef.current) {
      return;
    }
    if (!snake || snake.length === 0) return;
    const { width, height, unitSize } = canvasConfigRef.current;
    const newSnakeHead = {
      x: snake[0].x + direction.x * unitSize,
      y: snake[0].y + direction.y * unitSize,
    };

    //wall collision
    if (
      !isWin() &&
      (newSnakeHead.x === width ||
        newSnakeHead.y === height ||
        newSnakeHead.x === -unitSize ||
        newSnakeHead.y === -unitSize)
    ) {
      gameOver();
      return;
    }

    //snake collision
    if (!isWin() && snake.some((unit) => newSnakeHead.x === unit.x && newSnakeHead.y === unit.y)) {
      gameOver();
    }

    //eats food
    if (newSnakeHead.x === food.x && newSnakeHead.y === food.y) {
      setSnake((prev) => [newSnakeHead, ...(prev ?? [])]);
      setCounter((prevCount) => prevCount + 1);
      setFood(generateFoodPosition(width, height, unitSize, snake));
    } else {
      setSnake((prev) => {
        const newSnake = [newSnakeHead, ...(prev ?? [])];
        newSnake.pop();
        return newSnake;
      });
    }
  }, [snake, direction.x, direction.y, food.x, food.y, gameOver]);

  type Direction = { x: number; y: number };
  type DirectionText = "left" | "right" | "up" | "down";

  function isOppositeDirection(val1: Direction, val2: Direction): boolean {
    if (val1.x < 0 && val2.x === 0 && val2.y === 0) {
      return true; //can't start left
    }
    if ((val1.x < 0 && val2.x > 0) || (val1.x > 0 && val2.x < 0)) {
      return true;
    }
    return (val1.y < 0 && val2.y > 0) || (val1.y > 0 && val2.y < 0);
  }

  const setDirectionFromEvents = useCallback((directionText: DirectionText) => {
    let directionTemp;
    switch (directionText) {
      case "left":
        directionTemp = { x: -1, y: 0 };
        break;
      case "right":
        directionTemp = { x: 1, y: 0 };
        break;
      case "up":
        directionTemp = { x: 0, y: -1 };
        break;
      case "down":
        directionTemp = { x: 0, y: 1 };
        break;
    }

    setDirection((prev) => {
      if (isOppositeDirection(directionTemp, prev)) {
        return prev;
      }
      return directionTemp;
    });
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
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
    [setDirectionFromEvents],
  );

  const paint = useCallback(() => {
    if (!snake || snake.length === 0) return;
    if (!canvasConfigRef.current) {
      return;
    }
    const { width, height, unitSize } = canvasConfigRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = SNAKE_COLOR;
      ctx.fillRect(snake[0].x, snake[0].y, unitSize, unitSize);

      ctx.strokeStyle = SNAKE_COLOR;
      ctx.lineWidth = 4; // Border thickness
      ctx.strokeRect(snake[0].x, snake[0].y, unitSize, unitSize);

      ctx.fillStyle = "wheat"; // Eye color
      const eyeSize = 0.16 * unitSize;
      const eyeOffsetX = 0.3 * unitSize;
      const eyeOffsetY = 0.3 * unitSize;

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
    if (!ctx) {
      return;
    }
    if (!isWin()) {
      ctx.fillStyle = FOOD_COLOR;
      ctx.fillRect(food.x, food.y, unitSize, unitSize);
    }
  }, [food.x, food.y, snake]);

  //to eat last food after collision detected
  useEffect(() => {
    paint();
    if (pendingWin) {
      setPendingWin(false);
      win(counter);
    }
  }, [snake, food, pendingWin, paint]);

  const handleTouchMove = (event: React.TouchEvent) => {
    event.preventDefault();
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
  }, [onKeyDown]);

  useEffect(() => {
    let animationFrameId: number;
    let lastUpdateTime = performance.now();
    const interval = 120 - LEVEL_SPEED * level;

    const tick = (now: number) => {
      const elapsed = now - lastUpdateTime;

      if (elapsed > interval) {
        lastUpdateTime = now;
        updateSnake();

        if (isWin()) {
          setPendingWin(true);
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    if (direction.x !== 0 || direction.y !== 0) {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction, updateSnake, level]);

  const handleTouchStart = (event: React.TouchEvent) => {
    event.preventDefault();
    setStartX(event.touches[0].clientX);
    setStartY(event.touches[0].clientY);
  };
  return (
    <div
      className={`${orbitron.className} flex flex-col justify-center items-center md:h-screen md:mt-0 mt-44`}
    >
      <div className="flex sm:py-6 py-4 sm:px-0 sm:text-base text-xs sm:self-start">
        <div className="text-[wheat] uppercase sm:mr-10 mr-4">
          Score: {counter}/{calculateTotalScore(level)}
        </div>
        <div className="text-[wheat] uppercase sm:mr-10 mr-4">High score: {highScore}</div>
        <div className="text-[wheat] uppercase sm:mr-10">Level: {level}</div>
      </div>
      <div className="relative z-2">
        {canvasConfigRef.current && (
          <div>
            <canvas
              className="panel touch-none overflow-hidden"
              ref={canvasRef}
              width={canvasConfigRef.current?.width}
              height={canvasConfigRef.current?.height}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            />
            {level === 1 && (
              <div
                className={`absolute top-0 left-0 w-full h-full backdrop-blur-[10px] z-30 touch-none overflow-hidden ${
                  direction.x === 0 && direction.y === 0 ? "opacity-100" : "snake__animated-gesture"
                }`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                <Gesture className="sm:w-[200px] sm:h-[200px] w-[150px] h-[150px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
