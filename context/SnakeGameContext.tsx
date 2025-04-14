'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import {GameState} from "@/constants/snake";

// 1. Types
export type GameState = 'menu' | 'playing' | 'game_over' | 'win';

interface GameStateContextType {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
}

// 2. Create context
const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

// 3. Provider props
type GameStateProviderProps ={
  children: ReactNode;
}

// 4. GameStateProvider component
export const GameStateProvider: React.FC<GameStateProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);

  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};

// 5. Hook
export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};