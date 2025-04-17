"use client";
import "@/app/globals.css";
import React, {useRef, useEffect, useState, useCallback} from "react";
import {MOBILE_SIZE_CANCAS, calculateTotalScore} from "@/constants/snake";
import Gesture from "@/public/gesture.svg";

const SNAKE_COLOR = "#3acfd5";
const FOOD_COLOR = "#ffb3b3";
const LEVEL_SPEED = 20;

const generateFoodPosition = (
  canvasWidth: number,
  canvasHeight: number,
  unitSize: number,
  snake
): {
  x: number;
  y: number;
} => {
  const pos = {
    x: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize,
    y: Math.floor(Math.random() * (canvasHeight / unitSize)) * unitSize,
  };
  if(snake && snake.some((unit) => pos.x === unit.x && pos.y === unit.y)) {
    return generateFoodPosition(canvasWidth, canvasHeight, unitSize, snake);
  }
  return pos;
};

type props = {
  win: (counter: number) => void;
  gameOver: () => void;
  level: number;
  highScore: number;
};

export default function SnakeGame({win, gameOver, level, score, highScore}: props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasConfig, setCanvasConfig] = useState<{
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
  }>({x: 0, y: 0});
  const [direction, setDirection] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [pendingWin, setPendingWin] = useState(false);

  const isWin = () => counter === calculateTotalScore(level);

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
    setCanvasConfig({width, height, unitSize});
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
    setFood(generateFoodPosition(width, height, unitSize, snake));
  }, []);

  const updateSnake = useCallback(() => {
    if (!canvasConfig) {
      return;
    }
    if (!snake || snake.length === 0) return;
    const {width, height, unitSize} = canvasConfig;
    const newSnakeHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
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
  }, [counter, direction.x, direction.y, food.x, food.y, snake, canvasConfig, gameOver]);

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

  const setDirectionFromEvents = useCallback(
    (directionText: DirectionText) => {
      if (!canvasConfig) {
        return;
      }
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
    if (!canvasConfig) {
      return;
    }
    const {width, height, unitSize} = canvasConfig;
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
    if (!ctx) {
      return;
    }
    if (!isWin()) {
      ctx.fillStyle = FOOD_COLOR;
      ctx.fillRect(food.x, food.y, unitSize, unitSize);
    }
  }, [canvasConfig, food.x, food.y, snake]);

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
    <div className="flex flex-col justify-center h-screen ">
      <div className="flex py-6 justify-self-start">
        <div style={{marginRight: "2rem"}} className="text-[wheat] uppercase">
          Score: {counter}/{calculateTotalScore(level)}
        </div>
        <div style={{marginRight: "2rem"}} className="text-[wheat] uppercase">
          High score: {highScore}
        </div>
        <div style={{marginRight: "2rem"}} className="text-[wheat] uppercase">
          Level: {level}
        </div>
      </div>
      <div style={{zIndex: 2, position: "relative"}}>
        {canvasConfig && (
          <div>
            <canvas
              className="panel"
              style={{
                touchAction: "none",
                overflow: "hidden"
              }}
              ref={canvasRef}
              width={canvasConfig.width}
              height={canvasConfig.height}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            />
            {level === 1 && (
              <div
                className={`overlay ${
                  direction.x === 0 && direction.y === 0 ? "opacity-100" : "snake-animated-gesture"
                }`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                <Gesture
                  className="w-[200px] h-[200px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"/>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
