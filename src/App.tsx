import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { useAuth } from "@/hooks/useAuth";
import MainMenu from "./pages/MainMenu";
import GameScreen from "./pages/GameScreen";
import ResultScreen from "./pages/ResultScreen";
import SettingsScreen from "./pages/SettingsScreen";
import BossFightScreen from "./pages/BossFightScreen";
import LevelUpScreen from "./pages/LevelUpScreen";
import AuthScreen from "./pages/AuthScreen";
import ShopScreen from "./pages/ShopScreen";
import ProfileScreen from "./pages/ProfileScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { theme } = useGameStore();
  
  // Initialize auth
  useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/game/:difficulty" element={<GameScreen />} />
            <Route path="/result" element={<ResultScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/boss-fight" element={<BossFightScreen />} />
            <Route path="/level-up" element={<LevelUpScreen />} />
            <Route path="/auth" element={<AuthScreen />} />
            <Route path="/shop" element={<ShopScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
