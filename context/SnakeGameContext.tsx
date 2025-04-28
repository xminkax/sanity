"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { GameState } from "@/constants/snake";

interface GameStateContextType {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

type GameStateProviderProps = {
  children: ReactNode;
};

export const GameStateProvider: React.FC<GameStateProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);

  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
