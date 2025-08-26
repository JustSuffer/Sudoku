import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameStats, Theme, Difficulty, UserStats } from '@/types/game';
import { User, Session } from '@supabase/supabase-js';

interface GameStore {
  theme: Theme;
  stats: GameStats;
  user: User | null;
  session: Session | null;
  userStats: UserStats | null;
  difficultyStats: Record<Difficulty, { gamesPlayed: number; gamesUntilBoss: number }>;
  setTheme: (theme: Theme) => void;
  updateStats: (updates: Partial<GameStats>) => void;
  addExperience: (points: number) => void;
  levelUp: () => void;
  decrementBossCounter: (difficulty: Difficulty) => void;
  resetBossCounter: (difficulty: Difficulty) => void;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setUserStats: (userStats: UserStats | null) => void;
  updateCoins: (amount: number) => void;
  syncCoinsWithAuth: () => void;
}

const initialStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalTime: 0,
  bestTimes: {
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0,
  },
  currentLevel: 1,
  experience: 0,
  gamesUntilBoss: 5,
  coinBalance: 50,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      stats: initialStats,
      user: null,
      session: null,
      userStats: null,
      difficultyStats: {
        easy: { gamesPlayed: 0, gamesUntilBoss: 5 },
        medium: { gamesPlayed: 0, gamesUntilBoss: 5 },
        hard: { gamesPlayed: 0, gamesUntilBoss: 5 },
        expert: { gamesPlayed: 0, gamesUntilBoss: 5 },
      },
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      updateStats: (updates) =>
        set((state) => ({
          stats: { ...state.stats, ...updates },
        })),
      addExperience: (points) =>
        set((state) => {
          const newExp = state.stats.experience + points;
          const expNeeded = state.stats.currentLevel * 100;
          
          if (newExp >= expNeeded) {
            return {
              stats: {
                ...state.stats,
                experience: newExp - expNeeded,
                currentLevel: state.stats.currentLevel + 1,
              },
            };
          }
          
          return {
            stats: { ...state.stats, experience: newExp },
          };
        }),
      levelUp: () =>
        set((state) => ({
          stats: {
            ...state.stats,
            currentLevel: state.stats.currentLevel + 1,
            experience: 0,
          },
        })),
      decrementBossCounter: (difficulty: Difficulty) =>
        set((state) => ({
          difficultyStats: {
            ...state.difficultyStats,
            [difficulty]: {
              ...state.difficultyStats[difficulty],
              gamesPlayed: state.difficultyStats[difficulty].gamesPlayed + 1,
              gamesUntilBoss: Math.max(0, state.difficultyStats[difficulty].gamesUntilBoss - 1),
            },
          },
        })),
      resetBossCounter: (difficulty: Difficulty) =>
        set((state) => ({
          difficultyStats: {
            ...state.difficultyStats,
            [difficulty]: {
              ...state.difficultyStats[difficulty],
              gamesUntilBoss: 5,
            },
          },
        })),
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setUserStats: (userStats) => set({ userStats }),
      updateCoins: (amount) =>
        set((state) => ({
          stats: {
            ...state.stats,
            coinBalance: Math.max(0, state.stats.coinBalance + amount),
          },
          userStats: state.userStats ? {
            ...state.userStats,
            coin_balance: Math.max(0, state.userStats.coin_balance + amount),
          } : null,
        })),
      syncCoinsWithAuth: () =>
        set((state) => {
          if (state.userStats && state.stats.coinBalance > 0) {
            // When user logs in, preserve their local coins by adding to database coins
            return {
              userStats: {
                ...state.userStats,
                coin_balance: state.userStats.coin_balance + state.stats.coinBalance,
              },
              stats: {
                ...state.stats,
                coinBalance: state.userStats.coin_balance + state.stats.coinBalance,
              },
            };
          }
          return state;
        }),
    }),
    {
      name: 'sudoku-game-store',
    }
  )
);