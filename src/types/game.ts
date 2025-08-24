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
  coinBalance: number;
}

export interface SudokuCell {
  value: number;
  isFixed: boolean;
  isSelected: boolean;
  isError: boolean;
  hints: number[];
  isHighlighted: boolean;
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
  livesRemaining: number;
  hintsUsed: number;
  selectedNumber: number | null;
  sessionId: string | null;
}

export interface UserStats {
  id: string;
  user_id: string;
  coin_balance: number;
  total_games_played: number;
  total_games_won: number;
  total_experience: number;
  current_level: number;
  games_until_boss: number;
  best_times: Record<Difficulty, number>;
  created_at: string;
  updated_at: string;
}

export interface BossFight {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  difficulty: Difficulty;
  specialRules?: string[];
}