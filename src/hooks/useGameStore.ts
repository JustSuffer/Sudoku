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
  setTheme: (theme: Theme) => void;
  updateStats: (updates: Partial<GameStats>) => void;
  addExperience: (points: number) => void;
  levelUp: () => void;
  decrementBossCounter: () => void;
  resetBossCounter: () => void;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setUserStats: (userStats: UserStats | null) => void;
  updateCoins: (amount: number) => void;
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
      decrementBossCounter: () =>
        set((state) => ({
          stats: {
            ...state.stats,
            gamesUntilBoss: Math.max(0, state.stats.gamesUntilBoss - 1),
          },
        })),
      resetBossCounter: () =>
        set((state) => ({
          stats: { ...state.stats, gamesUntilBoss: 5 },
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
    }),
    {
      name: 'sudoku-game-store',
    }
  )
);