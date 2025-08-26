import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skull, Zap, Clock, Crown } from 'lucide-react';
import { Difficulty, BossFight } from '@/types/game';

const BossFightScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stats, resetBossCounter } = useGameStore();
  
  const { difficulty } = (location.state as { difficulty: Difficulty }) || { difficulty: 'medium' };
  
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(true);

  // Boss fight time limits based on difficulty
  const getTimeLimit = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 210; // 3 minutes 30 seconds
      case 'medium': return 480; // 8 minutes
      case 'hard': return 900; // 15 minutes
      case 'expert': return 1200; // 20 minutes
      default: return 300;
    }
  };

  // Boss fight data
  const bossFights: BossFight[] = [
    {
      id: 'shadow-master',
      title: 'Gölge Efendisi',
      description: 'Karanlık güçlerle dolu bu challenge\'da her hata seni geri götürür!',
      timeLimit: getTimeLimit(difficulty),
      difficulty: difficulty,
      specialRules: ['Her hata 10 saniye ceza', 'Sadece 3 hata hakkın var', 'İpucu yok!']
    },
    {
      id: 'time-wraith',
      title: 'Zaman Hayaleti', 
      description: 'Zamanla yarış! Süre azaldıkça puzzle daha da zorlaşır.',
      timeLimit: getTimeLimit(difficulty),
      difficulty: difficulty,
      specialRules: ['Süre azaldıkça hızlan', 'Son 60 saniyede ekstra zorluk', 'Bonus puan sistemi']
    },
    {
      id: 'puzzle-demon',
      title: 'Puzzle Şeytanı',
      description: 'En zorlu boss! Çoklu puzzle sistemi ile gerçek ustalığını göster.',
      timeLimit: getTimeLimit(difficulty),
      difficulty: difficulty,
      specialRules: ['3 puzzle aynı anda', 'Her puzzle farklı zorluk', 'Toplam süre sınırı']
    }
  ];

  const currentBoss = bossFights[Math.floor(Math.random() * bossFights.length)];

  useEffect(() => {
    if (showCountdown) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setShowCountdown(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showCountdown]);

  const startBossFight = () => {
    resetBossCounter(difficulty);
    navigate(`/game/${difficulty}`, { 
      state: { 
        isBossFight: true, 
        boss: currentBoss,
        timeLimit: currentBoss.timeLimit 
      } 
    });
  };

  const skipBossFight = () => {
    resetBossCounter(difficulty);
    navigate(`/game/${difficulty}`);
  };

  if (showCountdown) {
    return (
      <div className="min-h-screen bg-gradient-gaming flex items-center justify-center">
        <div className="text-center boss-entrance">
          <div className="text-9xl mb-8 animate-pulse">👹</div>
          <h1 className="text-6xl font-black mb-4 text-foreground">
            Boss Fight Başlatılıyor
          </h1>
          <div className="text-8xl font-black text-warning">
            {countdown}
          </div>
          <p className="text-xl text-muted-foreground mt-4">
            Hazırlan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen boss-fight-bg p-4">
      {/* Dramatic Themed Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Dragon/Viking/King themed background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-destructive/20 rounded-full animate-ping"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-warning/20 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-primary/20 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        
        {/* Flame symbols */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-10 animate-pulse">🔥</div>
        <div className="absolute bottom-1/4 left-1/4 text-6xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>⚔️</div>
        <div className="absolute top-1/2 left-1/8 text-6xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>👑</div>
        <div className="absolute top-3/4 right-1/8 text-6xl opacity-10 animate-pulse" style={{ animationDelay: '3s' }}>🐉</div>
      </div>

      <div className="max-w-4xl mx-auto z-10 relative">
        {/* Boss Introduction */}
        <Card className="mb-8 p-8 bg-card/95 backdrop-blur-sm border-destructive/30 boss-entrance">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4">👹</div>
            <h1 className="text-4xl font-black mb-2 text-foreground">
              {currentBoss.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {currentBoss.description}
            </p>
          </div>

          {/* Boss Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <Skull className="w-8 h-8 text-destructive mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">Boss Level</div>
              <div className="text-2xl font-black text-destructive">
                {stats.currentLevel + 2}
              </div>
            </div>
            
            <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
              <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">Süre Sınırı</div>
              <div className="text-2xl font-black text-warning">
                {Math.floor(currentBoss.timeLimit / 60)}:{(currentBoss.timeLimit % 60).toString().padStart(2, '0')}
              </div>
            </div>
            
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">Zorluk</div>
              <div className="text-2xl font-black text-primary capitalize">
                {difficulty === 'easy' ? 'Kolay' : 
                 difficulty === 'medium' ? 'Orta' : 
                 difficulty === 'hard' ? 'Zor' : 'Uzman'}
              </div>
            </div>
          </div>

          {/* Special Rules */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-center text-foreground flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-warning" />
              Özel Kurallar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentBoss.specialRules?.map((rule, index) => (
                <div key={index} className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-sm font-semibold text-foreground">{rule}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Preview */}
          <div className="mb-8 p-6 bg-gradient-primary rounded-lg">
            <h3 className="text-xl font-bold text-center mb-4 text-primary-foreground">
              Boss'u Yenersen
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center text-primary-foreground">
                <div className="text-3xl mb-2">💎</div>
                <div className="font-bold">x3 Deneyim</div>
                <div className="text-sm opacity-80">Normal puanın 3 katı</div>
              </div>
              <div className="text-center text-primary-foreground">
                <div className="text-3xl mb-2">🏆</div>
                <div className="font-bold">Boss Unvanı</div>
                <div className="text-sm opacity-80">Özel profil rozeti</div>
              </div>
              <div className="text-center text-primary-foreground">
                <div className="text-3xl mb-2">⭐</div>
                <div className="font-bold">Prestij Puanı</div>
                <div className="text-sm opacity-80">Liderlik tablosunda</div>
              </div>
            </div>
          </div>

          {/* Player Power */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-foreground">Güç Seviyesi</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-foreground">Oyuncu Seviyesi</span>
                <span className="font-bold text-primary">{stats.currentLevel}</span>
              </div>
              <Progress value={(stats.currentLevel / (stats.currentLevel + 2)) * 100} className="h-3" />
              <div className="text-center text-sm text-muted-foreground">
                Boss seviye {stats.currentLevel + 2} - Sen seviye {stats.currentLevel}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={startBossFight}
              className="btn-boss text-xl px-12 py-4"
            >
              ⚔️ SAVAŞA BAŞLA!
            </Button>
            <Button 
              variant="outline"
              onClick={skipBossFight}
              className="btn-secondary-gaming"
            >
              Normal Oyuna Geç
            </Button>
          </div>
        </Card>

        {/* Warning */}
        <Card className="p-4 bg-destructive/10 border-destructive/20 text-center">
          <div className="flex items-center justify-center gap-2 text-destructive">
            <Skull className="w-5 h-5" />
            <span className="font-semibold">
              Bu bir Boss Fight! Kaybedersen progress kaybetmezsin ama ödül de alamazsın.
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BossFightScreen;