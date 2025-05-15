"use client";
import "@/app/globals.css";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { calculateTotalScore, generateFoodPosition } from "@/lib/snake/game";
import Gesture from "@/public/gesture.svg";
import { orbitron } from "@/lib/fonts";
import { useCanvasSetup } from "@/lib/snake/useCanvasSetup";
import { useControls } from "@/lib/snake/useControls";
import { Position } from "@/interfaces";

const SNAKE_COLOR = "#3acfd5";
const FOOD_COLOR = "#ffb3b3";
const LEVEL_SPEED = 20;

interface SnakeProps {
  win: (counter: number) => void;
  gameOver: (counter: number) => void;
  score: number;
  level: number;
  highScore: number;
}

export default function SnakeGame({ win, gameOver, level, score, highScore }: SnakeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [counter, setCounter] = useState<number>(score);
  const [snake, setSnake] = useState<Position[] | null>(null);
  const [food, setFood] = useState<Position>({ x: 0, y: 0 });
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const { canvasConfigRef } = useCanvasSetup(canvasRef, snakeRef, foodRef, setSnake, setFood);
  const { direction, handleTouchStart, handleTouchMove } = useControls();

  const [pendingWin, setPendingWin] = useState(false);

  const isWin = () => counter === calculateTotalScore(level);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

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
      gameOver(counter);
      return;
    }

    //snake collision
    if (!isWin() && snake.some((unit) => newSnakeHead.x === unit.x && newSnakeHead.y === unit.y)) {
      gameOver(counter);
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

  useEffect(() => {
    let animationFrameId: number;
    let lastUpdateTime = performance.now();
    const interval = 120 - LEVEL_SPEED * Math.log2(level * 3) - level;

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

  return (
    <div
      className={`${orbitron.className} flex flex-col justify-center items-center md:h-screen md:mt-0 mt-44`}
    >
      <div className="flex sm:py-6 py-4 sm:px-0 sm:text-base text-xs sm:self-start">
        <div className="text-[wheat] uppercase sm:mr-10 mr-4">
          Score: {counter}/{calculateTotalScore(level)}
        </div>
        <div className="text-[wheat] uppercase sm:mr-10 mr-4">
          High score: {highScore < counter ? counter : highScore}
        </div>
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
