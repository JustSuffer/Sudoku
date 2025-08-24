import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Crown, Star, Zap, Gift, Home } from 'lucide-react';

const LevelUpScreen = () => {
  const navigate = useNavigate();
  const { stats } = useGameStore();
  const [showAnimation, setShowAnimation] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const levelUpBenefits = [
    {
      icon: '💪',
      title: 'Güç Artışı',
      description: 'Puzzle çözme hızın arttı!'
    },
    {
      icon: '🎯',
      title: 'Hassasiyet',
      description: 'Hata yapma olasılığın azaldı!'
    },
    {
      icon: '⚡',
      title: 'Bonus Deneyim',
      description: 'Artık daha fazla deneyim kazanıyorsun!'
    },
    {
      icon: '🎁',
      title: 'Yeni Yetenekler',
      description: 'Özel ipucu sistemi açıldı!'
    }
  ];

  useEffect(() => {
    // Animate through steps
    const timer = setTimeout(() => {
      if (currentStep < levelUpBenefits.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setShowAnimation(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentStep, levelUpBenefits.length]);

  const getUnlockedFeatures = (level: number) => {
    const features = [];
    if (level >= 5) features.push('Hızlı İpucu Sistemi');
    if (level >= 10) features.push('Boss Fight Bonus Damage');
    if (level >= 15) features.push('Zamanlama Bonusu');
    if (level >= 20) features.push('Master Mod Açılışı');
    return features;
  };

  const unlockedFeatures = getUnlockedFeatures(stats.currentLevel);

  return (
    <div className="min-h-screen bg-gradient-gaming flex items-center justify-center p-4">
      {/* Particle Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          >
            {Math.random() > 0.5 ? '⭐' : '✨'}
          </div>
        ))}
      </div>

      <div className="w-full max-w-3xl z-10">
        {/* Main Level Up Animation */}
        <div className="text-center mb-8 level-up">
          <div className="text-8xl mb-6 glow-animation">
            <Crown className="w-32 h-32 text-warning mx-auto" />
          </div>
          <h1 className="text-6xl font-black mb-4 text-foreground glow-animation">
            SEVİYE ATLADIN!
          </h1>
          <div className="text-4xl font-bold text-primary mb-2">
            Seviye {stats.currentLevel}
          </div>
          <p className="text-xl text-muted-foreground">
            Tebrikler! Yeni güçler kazandın!
          </p>
        </div>

        {/* Experience Progress */}
        <Card className="p-6 mb-8 bg-card/95 backdrop-blur-sm border-primary/30">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-foreground mb-2">Deneyim İlerlemesi</h3>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg text-muted-foreground">Önceki</div>
                <div className="text-2xl font-bold text-foreground">{stats.currentLevel - 1}</div>
              </div>
              <div className="text-4xl">➡️</div>
              <div className="text-center">
                <div className="text-lg text-muted-foreground">Şimdi</div>
                <div className="text-3xl font-black text-primary">{stats.currentLevel}</div>
              </div>
            </div>
            <Progress value={100} className="h-4 mb-2" />
            <div className="text-sm text-muted-foreground">
              {stats.experience}/{stats.currentLevel * 100} deneyim
            </div>
          </div>
        </Card>

        {/* Benefits Animation */}
        <Card className="p-6 mb-8 bg-card/95 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-center mb-6 text-foreground flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-warning" />
            Yeni Yetenekler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {levelUpBenefits.map((benefit, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-500 ${
                  index <= currentStep || !showAnimation
                    ? 'bg-gradient-primary border-primary/30 scale-100 opacity-100'
                    : 'bg-secondary/10 border-secondary/20 scale-95 opacity-50'
                }`}
                style={{
                  transitionDelay: `${index * 200}ms`,
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{benefit.icon}</div>
                  <h4 className="font-bold text-lg mb-2 text-primary-foreground">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-primary-foreground/80">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Unlocked Features */}
        {unlockedFeatures.length > 0 && (
          <Card className="p-6 mb-8 bg-gradient-secondary border-secondary/30">
            <h3 className="text-2xl font-bold text-center mb-4 text-secondary-foreground flex items-center justify-center gap-2">
              <Gift className="w-6 h-6" />
              Açılan Özellikler
            </h3>
            <div className="space-y-3">
              {unlockedFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-secondary-foreground/10 rounded-lg"
                >
                  <Zap className="w-5 h-5 text-warning" />
                  <span className="font-semibold text-secondary-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Next Level Preview */}
        <Card className="p-6 mb-8 bg-card/80 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-center mb-4 text-foreground">
            Sıradaki Seviye
          </h3>
          <div className="text-center">
            <div className="text-3xl font-black text-muted-foreground mb-2">
              Seviye {stats.currentLevel + 1}
            </div>
            <div className="text-lg text-muted-foreground mb-4">
              {(stats.currentLevel + 1) * 100} deneyim gerekli
            </div>
            <Progress 
              value={(stats.experience / ((stats.currentLevel + 1) * 100)) * 100} 
              className="h-3"
            />
            <div className="text-sm text-muted-foreground mt-2">
              {stats.experience}/{(stats.currentLevel + 1) * 100}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')}
            className="btn-gaming text-lg px-8 py-4"
          >
            🎮 Oyuna Devam
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/settings')}
            className="btn-secondary-gaming flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Ana Menü
          </Button>
        </div>

        {/* Motivational Message */}
        <Card className="mt-6 p-4 bg-gradient-gaming/50 text-center border-warning/30">
          <div className="text-2xl mb-2">🔥</div>
          <p className="text-lg font-semibold text-foreground">
            {stats.currentLevel < 10 
              ? "Harika gidiyorsun! Devam et!" 
              : stats.currentLevel < 20
              ? "Artık gerçek bir Sudoku ustası oluyorsun!"
              : "Efsane seviyedesin! Boss'lar seni bekliyor!"
            }
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LevelUpScreen;