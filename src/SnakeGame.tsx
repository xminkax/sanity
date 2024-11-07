'use client';
import "@/app/globals.css";
import React, {useRef, useEffect, useState, useCallback} from "react";

const unitSize = 20;
const numberOfCells = 20;
const canvasWidth = unitSize * numberOfCells;
const canvasHeight = unitSize * numberOfCells;
export default function SnakeGame() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [counter, setCounter] = useState<number>(0);
    const [snake, setSnake] = useState<{ x: number; y: number }[]>(
        [{x: 8 * unitSize, y: 8 * unitSize}]);
    const [food, setFood] = useState<{ x: number; y: number }>(
        {
            x: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize,
            y: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize
        });
    const [direction, setDirection] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

    const [isGameOn, setIsGameOn] = useState<boolean>(false);

    const startGame = () => {
        setDirection({x: unitSize, y: 0});
        setIsGameOn(true);
    }

    const resetSnake = () => {
        setDirection({x: 0, y: 0});
        setSnake([{x: 8 * unitSize, y: 8 * unitSize}]);
    }

    const updateSnake = useCallback(() => {
        const snakeHead = snake[0];
        const newSnakeHead = {
            x: snake[0].x + (direction.x),
            y: snake[0].y + (direction.y)
        };

        //wall collision
        if (newSnakeHead.x === canvasWidth
            || newSnakeHead.y === canvasHeight
            || newSnakeHead.x === -unitSize || newSnakeHead.y === -unitSize) {
            alert('Game Over');
            resetSnake();
            setIsGameOn(false);
            return;
        }

        //snake collision
        if (snake.some(unit => newSnakeHead.x === unit.x && newSnakeHead.y === unit.y)) {
            alert('Game Over');
            resetSnake();
            setIsGameOn(false);
        }

        //eats food
        if (newSnakeHead.x === food.x && newSnakeHead.y === food.y) {
            setSnake((prev) => [
                newSnakeHead,
                ...prev,
            ]);
            setShouldAnimate(true);
            setFood({
                x: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize,
                y: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize
            });
            setCounter(counter + 1);
        } else {
            setSnake((prev) => {
                const newSnake = [newSnakeHead, ...prev];
                newSnake.pop(); // Remove the last segment
                return newSnake;
            });
        }

    }, [counter, direction.x, direction.y, food.x, food.y, snake]);

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if (!isGameOn) {
            return;
        }
        switch (event.key) {
            case "ArrowLeft":
                setDirection({x: -unitSize, y: 0});
                break;
            case "ArrowRight":
                setDirection({x: unitSize, y: 0});
                break;
            case "ArrowUp":
                setDirection({x: 0, y: -unitSize});
                break;
            case "ArrowDown":
                setDirection({x: 0, y: unitSize});
                break;
        }
    }, [isGameOn]);

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

        if (counter === 5) {
            paint();
            setIsGameOn(false);
            setCounter(0);
            // //todo add list of sayings with a random selection
            alert("You reached the first level, congratulations! Here is a nice saying for today: It is the same life, whether we spend it laughing or crying.")
            resetSnake();
        }

    }, [snake, food, counter, paint]);

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isGameOn, onKeyDown]);

    useEffect(() => {
        if (shouldAnimate) {
            const myReference = canvasRef.current // The DOM element
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

    return <div>
        <div style={{paddingBottom: '1rem', display: "flex", justifyContent: "left", alignItems: "center"}}>
            <button className="btn btn-blue" onClick={startGame}>Start the game</button>
            <div style={{marginLeft: "1rem"}}>{counter}</div>
        </div>
        <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{
                border: "0.2rem solid",
                borderImage: "linear-gradient(to right, #3acfd5 0%, #3a4ed5 100%) 1",
            }}
        />
    </div>
}