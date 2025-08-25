import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Crown, User, Settings, Trophy, Zap, LogIn, LogOut, ShoppingBag } from 'lucide-react';
import { Difficulty } from '@/types/game';
import { useAuth } from '@/hooks/useAuth';
import sudokuLogo from '@/assets/sudoku-logo.png';
import CoinIcon from '@/components/CoinIcon';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AdModal from '@/components/AdModal';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

const MainMenu = () => {
  const navigate = useNavigate();
  const { stats, userStats } = useGameStore();
  const { isAuthenticated, user, signOut } = useAuth();
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  const difficulties: { key: Difficulty; label: string; labelEn: string; description: string; descriptionEn: string; icon: string }[] = [
    { key: 'easy', label: 'Kolay', labelEn: 'Easy', description: '35 boş hücre', descriptionEn: '35 empty cells', icon: '🟢' },
    { key: 'medium', label: 'Orta', labelEn: 'Medium', description: '45 boş hücre', descriptionEn: '45 empty cells', icon: '🟡' },
    { key: 'hard', label: 'Zor', labelEn: 'Hard', description: '55 boş hücre', descriptionEn: '55 empty cells', icon: '🟠' },
    { key: 'expert', label: 'Uzman', labelEn: 'Expert', description: '65 boş hücre', descriptionEn: '65 empty cells', icon: '🔴' },
  ];

  const handleDifficultySelect = (difficulty: Difficulty) => {
    if (stats.gamesUntilBoss === 1) {
      navigate('/boss-fight', { state: { difficulty } });
    } else {
      navigate(`/game/${difficulty}`);
    }
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      toast({
        title: currentLanguage === 'tr' ? "Giriş Gerekli" : "Login Required",
        description: t('profile.loginRequired'),
        variant: "destructive",
      });
      return;
    }
    navigate('/profile');
  };

  const handleCoinClick = () => {
    setIsAdModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4">
      {/* Language Switcher - Top Right */}
      <div className="fixed top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full float-animation"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/20 rounded-lg float-animation" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-primary-glow/20 rounded-full float-animation" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-4xl z-10">
        {/* Header with Logo and Auth */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-6">
            <img 
              src={sudokuLogo} 
              alt="Sudoku Logo" 
              className="w-24 h-24 hover-scale animate-fade-in"
            />
            
            {/* Auth Section */}
            <div className="flex flex-col items-center gap-2">
              {isAuthenticated ? (
                <>
                  <div 
                    className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 cursor-pointer hover:scale-105 transition-all"
                    onClick={handleCoinClick}
                  >
                    <CoinIcon className="w-5 h-5" />
                    <span className="font-bold text-foreground">
                      {userStats?.coin_balance || 0}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={signOut}
                    className="btn-secondary-gaming"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Çıkış
                  </Button>
                </>
              ) : (
                <>
                  <div 
                    className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 cursor-pointer hover:scale-105 transition-all"
                    onClick={handleCoinClick}
                  >
                    <CoinIcon className="w-5 h-5" />
                    <span className="font-bold text-foreground">
                      {stats.coinBalance}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/auth')}
                    className="btn-secondary-gaming"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Giriş
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            SUDOKU MASTER
          </h1>
          
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <div>Seviye: {stats.currentLevel}</div>
            <div>Oyun: {stats.gamesWon}/{stats.gamesPlayed}</div>
            <div>Boss: {stats.gamesUntilBoss} kaldı</div>
          </div>
        </div>

        {/* Player Stats */}
        <Card className="mb-8 p-6 bg-card/80 backdrop-blur-sm border-primary/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Crown className="w-8 h-8 text-primary mb-2" />
              <span className="text-2xl font-bold text-foreground">{stats.currentLevel}</span>
              <span className="text-sm text-muted-foreground">{t('main.level')}</span>
            </div>
            <div className="flex flex-col items-center">
              <Trophy className="w-8 h-8 text-secondary mb-2" />
              <span className="text-2xl font-bold text-foreground">{stats.gamesWon}</span>
              <span className="text-sm text-muted-foreground">Kazanılan</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-8 h-8 text-warning mb-2" />
              <span className="text-2xl font-bold text-foreground">{stats.experience}</span>
              <span className="text-sm text-muted-foreground">{t('main.experience')}</span>
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
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  {currentLanguage === 'tr' ? difficulty.label : difficulty.labelEn}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {currentLanguage === 'tr' ? difficulty.description : difficulty.descriptionEn}
                </p>
                <Button className="btn-gaming w-full">
                  {currentLanguage === 'tr' ? 'Başla' : 'Start'}
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

        {/* Shop Button */}
        <Card className="mb-8 p-4 bg-card/80 backdrop-blur-sm text-center hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => navigate('/shop')}>
          <Button className="btn-gaming w-full text-xl py-4 flex items-center justify-center gap-3">
            <ShoppingBag className="w-6 h-6" />
            {t('main.shop')}
            <div className="text-sm bg-warning text-warning-foreground px-2 py-1 rounded-full">
              Yeni!
            </div>
          </Button>
        </Card>

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
            onClick={handleProfileClick}
          >
            <User className="w-5 h-5" />
            {t('main.profile')}
          </Button>
        </div>
      </div>

      {/* Ad Modal */}
      <AdModal isOpen={isAdModalOpen} onClose={() => setIsAdModalOpen(false)} />
    </div>
  );
};

export default MainMenu;