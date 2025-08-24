import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Crown, User, Settings, Trophy, Zap } from 'lucide-react';
import { Difficulty } from '@/types/game';
import sudokuLogo from '@/assets/sudoku-logo.png';

const MainMenu = () => {
  const navigate = useNavigate();
  const { stats } = useGameStore();

  const difficulties: { key: Difficulty; label: string; description: string; icon: string }[] = [
    { key: 'easy', label: 'Kolay', description: '35 boş hücre', icon: '🟢' },
    { key: 'medium', label: 'Orta', description: '45 boş hücre', icon: '🟡' },
    { key: 'hard', label: 'Zor', description: '55 boş hücre', icon: '🟠' },
    { key: 'expert', label: 'Uzman', description: '65 boş hücre', icon: '🔴' },
  ];

  const handleDifficultySelect = (difficulty: Difficulty) => {
    if (stats.gamesUntilBoss === 1) {
      navigate('/boss-fight', { state: { difficulty } });
    } else {
      navigate(`/game/${difficulty}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full float-animation"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/20 rounded-lg float-animation" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-primary-glow/20 rounded-full float-animation" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-4xl z-10">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <img 
            src={sudokuLogo} 
            alt="Sudoku Logo" 
            className="w-64 h-36 mx-auto mb-6 float-animation object-cover rounded-2xl shadow-glow"
          />
          <h1 className="text-6xl font-black mb-4 text-foreground glow-animation">
            SUDOKU MASTER
          </h1>
          <p className="text-xl text-muted-foreground">
            Ultimate puzzle challenge awaits
          </p>
        </div>

        {/* Player Stats */}
        <Card className="mb-8 p-6 bg-card/80 backdrop-blur-sm border-primary/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Crown className="w-8 h-8 text-primary mb-2" />
              <span className="text-2xl font-bold text-foreground">{stats.currentLevel}</span>
              <span className="text-sm text-muted-foreground">Seviye</span>
            </div>
            <div className="flex flex-col items-center">
              <Trophy className="w-8 h-8 text-secondary mb-2" />
              <span className="text-2xl font-bold text-foreground">{stats.gamesWon}</span>
              <span className="text-sm text-muted-foreground">Kazanılan</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-8 h-8 text-warning mb-2" />
              <span className="text-2xl font-bold text-foreground">{stats.experience}</span>
              <span className="text-sm text-muted-foreground">Deneyim</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 text-2xl mb-2">🔥</div>
              <span className="text-2xl font-bold text-foreground">{stats.gamesUntilBoss}</span>
              <span className="text-sm text-muted-foreground">Boss'a</span>
            </div>
          </div>
        </Card>

        {/* Difficulty Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {difficulties.map((difficulty, index) => (
            <Card 
              key={difficulty.key}
              className="p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow bg-card/80 backdrop-blur-sm border-primary/20"
              onClick={() => handleDifficultySelect(difficulty.key)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{difficulty.icon}</div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">{difficulty.label}</h3>
                <p className="text-muted-foreground mb-4">{difficulty.description}</p>
                <Button className="btn-gaming w-full">
                  Başla
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Boss Fight Warning */}
        {stats.gamesUntilBoss === 1 && (
          <Card className="mb-8 p-6 bg-gradient-gaming text-center boss-entrance border-warning">
            <div className="text-5xl mb-4">👹</div>
            <h3 className="text-2xl font-bold mb-2 text-warning-foreground">
              BOSS FIGHT HAZÇRr!
            </h3>
            <p className="text-warning-foreground/80">
              Bir sonraki oyunda epik boss meydan okuması ile karşılaşacaksın!
            </p>
          </Card>
        )}

        {/* Menu Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="secondary"
            className="btn-secondary-gaming flex items-center gap-2"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5" />
            Ayarlar
          </Button>
          <Button 
            variant="outline"
            className="btn-secondary-gaming flex items-center gap-2"
          >
            <User className="w-5 h-5" />
            Profil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;