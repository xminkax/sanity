import React, { useRef, useEffect, useCallback, useLayoutEffect, MutableRefObject } from "react";
import { generateFoodPosition, parseScreensConfig } from "@/lib/snake/game";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";
import { Position } from "@/types";

const fullConfig = resolveConfig(tailwindConfig);

const UNITS_WIDE = 31;
const UNITS_TALL = 24;

type Canvas = {
  width: number;
  height: number;
  unitSize: number;
};

export function useCanvasSetup(
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  snakeRef: MutableRefObject<Position[] | null>,
  foodRef: MutableRefObject<Position>,
  setSnake: React.Dispatch<React.SetStateAction<Position[] | null>>,
  setFood: React.Dispatch<React.SetStateAction<Position>>,
) {
  const canvasConfigPrevRef = useRef<Canvas | null>(null);
  const canvasConfigRef = useRef<Canvas | null>(null);

  const setupCanvas = useCallback(() => {
    let unitSize;

    if (window.innerWidth >= parseScreensConfig(fullConfig.theme.screens.xl)) {
      // Desktop
      unitSize = 30;
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
        const newSnake = snakeRef.current!.map(({ x, y }) => ({
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
  }, [foodRef, setFood, setSnake, snakeRef]);

  useLayoutEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          setupCanvas();
          resizeTimeout = null;
        }, 200);
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

  return { canvasConfigRef };
}
