import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gift, Sparkles } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import CoinIcon from './CoinIcon';
import { useLanguage } from '@/hooks/useLanguage';

interface LootBoxProps {
  onThemeReceived: (theme: string) => void;
}

const themes = {
  normal: [
    'forest-theme', 'ocean-theme', 'sunset-theme', 'purple-theme',
    'pink-theme', 'blue-theme', 'green-theme', 'orange-theme'
  ],
  anime: [
    'naruto-theme', 'one-piece-theme', 'dragon-ball-theme', 'attack-titan-theme'
  ],
  country: [
    'turkey-theme', 'japan-theme', 'usa-theme', 'brazil-theme', 'germany-theme'
  ],
  team: [
    'galatasaray-theme', 'fenerbahce-theme', 'besiktas-theme', 'trabzonspor-theme',
    'barcelona-theme', 'real-madrid-theme', 'manchester-united-theme'
  ]
};

const LootBox = ({ onThemeReceived }: LootBoxProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showResult, setShowResult] = useState<string | null>(null);
  const { stats, updateCoins, userStats } = useGameStore();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const openLootBox = async () => {
    const cost = 200;
    const currentCoins = isAuthenticated ? userStats?.coin_balance || 0 : stats.coinBalance;
    
    if (currentCoins < cost) {
      toast({
        title: t('shop.insufficientCoins'),
        description: "MasterLoot BOX için 200 coin gerekli.",
        variant: "destructive",
      });
      return;
    }

    setIsOpening(true);
    
    // Animate box opening
    setTimeout(() => {
      // Determine reward rarity
      const random = Math.random() * 100;
      let selectedTheme = '';
      
      if (random < 5) {
        // 5% Country theme
        const countryThemes = themes.country;
        selectedTheme = countryThemes[Math.floor(Math.random() * countryThemes.length)];
      } else if (random < 15) {
        // 10% Team theme  
        const teamThemes = themes.team;
        selectedTheme = teamThemes[Math.floor(Math.random() * teamThemes.length)];
      } else if (random < 30) {
        // 15% Anime theme
        const animeThemes = themes.anime;
        selectedTheme = animeThemes[Math.floor(Math.random() * animeThemes.length)];
      } else {
        // 70% Normal theme
        const normalThemes = themes.normal;
        selectedTheme = normalThemes[Math.floor(Math.random() * normalThemes.length)];
      }

      setShowResult(selectedTheme);
      setIsOpening(false);
      updateCoins(-cost);
      onThemeReceived(selectedTheme);
      
      toast({
        title: "MasterLoot BOX Açıldı!",
        description: `Yeni tema kazandınız: ${selectedTheme}`,
      });
    }, 3000);
  };

  if (showResult) {
    return (
      <Card className="p-6 text-center bg-gradient-primary animate-scale-in">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold mb-2 text-primary-foreground">
          Tebrikler!
        </h3>
        <p className="text-lg text-primary-foreground mb-4">
          Yeni tema kazandınız:
        </p>
        <div className="text-xl font-bold text-primary-foreground mb-6 bg-white/20 rounded-lg p-3">
          {showResult}
        </div>
        <Button 
          onClick={() => setShowResult(null)}
          className="btn-gaming"
        >
          Tamam
        </Button>
      </Card>
    );
  }

  if (isOpening) {
    return (
      <Card className="p-6 text-center bg-gradient-gaming">
        <div className="animate-spin text-6xl mb-4">🎁</div>
        <h3 className="text-2xl font-bold mb-4 text-foreground">
          MasterLoot BOX Açılıyor...
        </h3>
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30">
      <div className="text-4xl mb-4">🎁</div>
      <h3 className="text-xl font-bold mb-2 text-foreground flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        MasterLoot BOX
        <Sparkles className="w-5 h-5 text-yellow-400" />
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Rastgele tema kazanın!
      </p>
      
      {/* Drop rates */}
      <div className="text-xs text-muted-foreground mb-4 space-y-1">
        <div>🌍 Ülke Teması: %5</div>
        <div>⚽ Takım Teması: %10</div>
        <div>🎨 Normal Tema: %70</div>
        <div>🎌 Anime Teması: %15</div>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-lg font-bold text-foreground mb-4">
        200 <CoinIcon className="w-5 h-5" />
      </div>
      
      <Button 
        onClick={openLootBox}
        className="btn-gaming w-full"
        disabled={isAuthenticated ? (userStats?.coin_balance || 0) < 200 : stats.coinBalance < 200}
      >
        <Gift className="w-4 h-4 mr-2" />
        Kutuyu Aç!
      </Button>
    </Card>
  );
};

export default LootBox;