export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type Theme = 'light' | 'dark';

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalTime: number;
  bestTimes: Record<Difficulty, number>;
  currentLevel: number;
  experience: number;
  gamesUntilBoss: number;
}

export interface SudokuCell {
  value: number;
  isFixed: boolean;
  isSelected: boolean;
  isError: boolean;
  hints: number[];
}

export type SudokuBoard = SudokuCell[][];

export interface GameState {
  board: SudokuBoard;
  difficulty: Difficulty;
  startTime: number;
  currentTime: number;
  isComplete: boolean;
  isPaused: boolean;
  selectedCell: { row: number; col: number } | null;
}

export interface BossFight {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  difficulty: Difficulty;
  specialRules?: string[];
}