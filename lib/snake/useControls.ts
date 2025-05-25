import React, { useEffect, useState, useCallback } from "react";
import { isOppositeDirection } from "./game";
import { Position } from "@/types";

type Direction = { x: number; y: number };
const DIRECTION_TEXT = {
  LEFT: "left",
  UP: "up",
  DOWN: "down",
  RIGHT: "right",
} as const;
type DIRECTION_TEXT = (typeof DIRECTION_TEXT)[keyof typeof DIRECTION_TEXT];

const directionMap: Record<DIRECTION_TEXT, Direction> = {
  [DIRECTION_TEXT.LEFT]: { x: -1, y: 0 },
  [DIRECTION_TEXT.RIGHT]: { x: 1, y: 0 },
  [DIRECTION_TEXT.UP]: { x: 0, y: -1 },
  [DIRECTION_TEXT.DOWN]: { x: 0, y: 1 },
};

export function useControls() {
  const [direction, setDirection] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [startXY, setStartXY] = useState<Position | { x: null; y: null }>({
    x: null,
    y: null,
  });

  const setDirectionFromEvents = useCallback((dirText: DIRECTION_TEXT) => {
    const newDir = directionMap[dirText];
    setDirection((prev) => (isOppositeDirection(newDir, prev) ? prev : newDir));
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setStartXY({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  }, []);

  // Touch move
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (startXY?.x === null || startXY?.y === null) return;

      const diffX = e.touches[0].clientX - startXY?.x;
      const diffY = e.touches[0].clientY - startXY?.y;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        setDirectionFromEvents(diffX > 0 ? DIRECTION_TEXT.RIGHT : DIRECTION_TEXT.LEFT);
      } else {
        setDirectionFromEvents(diffY > 0 ? DIRECTION_TEXT.DOWN : DIRECTION_TEXT.UP);
      }

      setStartXY({ x: null, y: null });
    },
    [startXY, setDirectionFromEvents],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          setDirectionFromEvents(DIRECTION_TEXT.LEFT);
          break;
        case "ArrowRight":
          setDirectionFromEvents(DIRECTION_TEXT.RIGHT);
          break;
        case "ArrowUp":
          setDirectionFromEvents(DIRECTION_TEXT.UP);
          break;
        case "ArrowDown":
          setDirectionFromEvents(DIRECTION_TEXT.DOWN);
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setDirectionFromEvents]);

  return { direction, handleTouchStart, handleTouchMove };
}
