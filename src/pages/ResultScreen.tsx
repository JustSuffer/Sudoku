import { useLocation, useNavigate } from 'react-router-dom';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Clock, Star, Home, RotateCcw } from 'lucide-react';
import { Difficulty } from '@/types/game';

interface ResultState {
  time: number;
  difficulty: Difficulty;
  isNewRecord: boolean;
  experience: number;
}

const ResultScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stats } = useGameStore();
  
  const state = location.state as ResultState;
  if (!state) {
    navigate('/');
    return null;
  }

  const { time, difficulty, isNewRecord, experience } = state;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-orange-500';
      case 'expert': return 'text-red-500';
      default: return 'text-primary';
    }
  };

  const getDifficultyLabel = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'Kolay';
      case 'medium': return 'Orta';
      case 'hard': return 'Zor';
      case 'expert': return 'Uzman';
      default: return 'Bilinmeyen';
    }
  };

  const calculateRating = (time: number, difficulty: Difficulty) => {
    const perfectTimes = { easy: 180, medium: 300, hard: 480, expert: 720 };
    const perfectTime = perfectTimes[difficulty];
    
    if (time <= perfectTime) return 3;
    if (time <= perfectTime * 1.5) return 2;
    return 1;
  };

  const rating = calculateRating(time, difficulty);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl z-10">
        {/* Success Animation */}
        <div className="text-center mb-8 level-up">
          <div className="text-8xl mb-4">
            {isNewRecord ? '🏆' : '🎉'}
          </div>
          <h1 className="text-5xl font-black mb-4 text-foreground">
            {isNewRecord ? 'YENİ REKOR!' : 'TEBRİKLER!'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {getDifficultyLabel(difficulty)} seviyeyi başarıyla tamamladın!
          </p>
        </div>

        {/* Results Card */}
        <Card className="p-8 mb-8 bg-card/90 backdrop-blur-sm border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Time Results */}
            <div className="text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-foreground">Süren</h3>
              <div className="text-4xl font-black text-primary mb-4">
                {formatTime(time)}
              </div>
              {stats.bestTimes[difficulty] && stats.bestTimes[difficulty] !== time && (
                <p className="text-sm text-muted-foreground">
                  Rekor: {formatTime(stats.bestTimes[difficulty])}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="text-center">
              <Star className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-foreground">Performans</h3>
              <div className="flex justify-center mb-4">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-8 h-8 ${
                      i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {rating === 3 ? 'Mükemmel!' : rating === 2 ? 'İyi!' : 'Tamamlandı!'}
              </p>
            </div>
          </div>

          {/* Experience Gained */}
          <div className="mt-8 p-6 bg-gradient-primary rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="text-2xl">⚡</div>
              <span className="text-xl font-bold text-primary-foreground">
                +{experience} Deneyim Kazandın!
              </span>
            </div>
            <div className="text-sm text-primary-foreground/80">
              Seviye {stats.currentLevel} • {stats.experience}/{stats.currentLevel * 100} Deneyim
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6 mb-8 bg-card/80 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4 text-center text-foreground">İstatistikler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.gamesPlayed}</div>
              <div className="text-sm text-muted-foreground">Toplam Oyun</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.gamesWon}</div>
              <div className="text-sm text-muted-foreground">Kazanılan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {Math.round((stats.gamesWon / Math.max(stats.gamesPlayed, 1)) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Başarı Oranı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.gamesUntilBoss}</div>
              <div className="text-sm text-muted-foreground">Boss'a Kalan</div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate(`/game/${difficulty}`)}
            className="btn-gaming flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Tekrar Oyna
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="btn-secondary-gaming flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Ana Menü
          </Button>
        </div>

        {/* Level Up Notice */}
        {stats.experience >= stats.currentLevel * 100 && (
          <Card className="mt-6 p-6 bg-gradient-gaming text-center border-warning">
            <div className="text-4xl mb-2">🎊</div>
            <h3 className="text-xl font-bold text-warning-foreground mb-2">
              SEVİYE ATLADIN!
            </h3>
            <Button 
              onClick={() => navigate('/level-up')}
              className="btn-boss"
            >
              Seviye Atlama Ekranını Gör
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;