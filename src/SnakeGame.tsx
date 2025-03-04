"use client";
import "@/app/globals.css";
import React, {useRef, useEffect, useState, useCallback} from "react";
import Image from "next/image";
import Gesture from "../public/gesture.svg";
import {GameState, levelWinTexts, levelWinBackgrounds} from "@/constants/snake";

export default function SnakeGame({gameState, nextLevel, win, startGame, gameOver, restartGame, levelWin = 1}) {
  let unitSize = 15;
  let numberOfCells = 18;
  let canvasWidth = unitSize * 22;
  let canvasHeight = unitSize * numberOfCells;
  if (window.innerWidth > 640) {
    unitSize = 20;
    numberOfCells = 27;
    canvasWidth = unitSize * 33;
    canvasHeight = unitSize * numberOfCells;
  }
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [counter, setCounter] = useState<number>(0);
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    {x: 8 * unitSize, y: 8 * unitSize},
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({
    x: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize,
    y: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize,
  });
  const [direction, setDirection] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  const updateSnake = useCallback(() => {
    const newSnakeHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    //wall collision
    if (
      newSnakeHead.x === canvasWidth ||
      newSnakeHead.y === canvasHeight ||
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
      setFood({
        x: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize,
        y: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize,
      });
      setCounter(counter + 1);
    } else {
      setSnake((prev) => {
        const newSnake = [newSnakeHead, ...prev];
        newSnake.pop();
        return newSnake;
      });
    }
  }, [counter, direction.x, direction.y, food.x, food.y, snake]);

  const setDirectionFromEvents = (direction) => {
    switch (direction) {
      case "left":
        setDirection({x: -unitSize, y: 0});
        break;
      case "right":
        setDirection({x: unitSize, y: 0});
        break;
      case "up":
        setDirection({x: 0, y: -unitSize});
        break;
      case "down":
        setDirection({x: 0, y: unitSize});
        break;
    }
  };

  //todo add abstraction for directions
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
    [gameState],
  );

  const paint = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      snake.forEach((unit) => {
        ctx.fillStyle = "#3acfd5";
        ctx.fillRect(unit.x, unit.y, unitSize, unitSize);
      });
    }
    ctx.fillStyle = "#fed1c7";
    ctx.fillRect(food.x, food.y, unitSize, unitSize);
  }, [food.x, food.y, snake]);

  useEffect(() => {
    paint();

    if (counter === 3) {
      paint();
      win();
    }
  }, [snake, food, counter, paint]);

  const handleTouchMove = (event) => {
    // event.preventDefault();
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
    }, 200);
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
      <div style={{zIndex: 2, position: 'relative'}}>
        <canvas
          className="canvas-snake"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            border: "0.2rem solid",
            borderRadius: '10px',
            borderImage: "linear-gradient(to right, #3acfd5 0%, #3a4ed5 100%) 1",
            touchAction: "none",
            backgroundColor: "black",
            zIndex: 2
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        />
        {gameState === GameState.MENU && <div className="overlay">
          <button
            className="home btn-snake px-6 py-3 text-white font-bold text-2xl shadow-md hover:bg-[#32b8bd] transition duration-300
            uppercase"

            onClick={startGame}>
            Play
          </button>
          <Image className="icon-gesture" src={Gesture} alt={""}/>
        </div>}
        {gameState === GameState.WIN && <div className="overlay">
          <div className="text-snake">
            <h1 className="uppercase font-bold text-4xl sm:text-5xl md:text-5xl mb-2">Congrats!</h1>
            <p className="font-bold md:text-4xl">{levelWinTexts[levelWinBackgrounds[levelWin]]}</p>
          </div>
          <button
            className="home btn-snake px-6 py-3 text-white font-bold text-2xl rounded-lg shadow-md hover:bg-[#32b8bd] transition duration-300
            uppercase"

            onClick={() => {
              startGame();
            }}>
            Level 2
          </button>
          <button
            className="home btn-snake px-6 py-3 text-white font-bold text-2xl rounded-lg shadow-md hover:bg-[#32b8bd] transition duration-300
            uppercase"
            onClick={restartGame}>
            Restart
          </button>
        </div>}
      </div>

    </div>
  );
}