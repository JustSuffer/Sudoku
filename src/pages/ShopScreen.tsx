import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/hooks/useGameStore';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Coins } from 'lucide-react';
import CoinIcon from '@/components/CoinIcon';
import { useToast } from '@/hooks/use-toast';

interface ThemeItem {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  preview: string;
  category: 'basic' | 'neon' | 'anime' | 'teams' | 'countries';
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

const ShopScreen = () => {
  const navigate = useNavigate();
  const { stats, updateCoins, userStats } = useGameStore();
  const { isAuthenticated } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const themes: ThemeItem[] = [
    // Basic themes (250 coins)
    { id: 'purple', name: 'Mor Tema', nameEn: 'Purple Theme', price: 250, preview: '🟣', category: 'basic', colors: { primary: '280 50% 60%', secondary: '280 70% 40%', background: '280 40% 80%' } },
    { id: 'green', name: 'Yeşil Tema', nameEn: 'Green Theme', price: 250, preview: '🟢', category: 'basic', colors: { primary: '120 60% 50%', secondary: '120 80% 30%', background: '120 40% 80%' } },
    { id: 'blue', name: 'Mavi Tema', nameEn: 'Blue Theme', price: 250, preview: '🔵', category: 'basic', colors: { primary: '220 70% 60%', secondary: '220 90% 40%', background: '220 50% 80%' } },
    { id: 'red', name: 'Kırmızı Tema', nameEn: 'Red Theme', price: 250, preview: '🔴', category: 'basic', colors: { primary: '0 70% 60%', secondary: '0 90% 40%', background: '0 50% 80%' } },
    { id: 'orange', name: 'Turuncu Tema', nameEn: 'Orange Theme', price: 250, preview: '🟠', category: 'basic', colors: { primary: '30 80% 60%', secondary: '30 100% 40%', background: '30 60% 80%' } },
    
    // Neon themes (350 coins)
    { id: 'neon-pink', name: 'Neon Pembe', nameEn: 'Neon Pink', price: 350, preview: '💗', category: 'neon', colors: { primary: '320 100% 70%', secondary: '320 100% 50%', background: '320 80% 20%' } },
    { id: 'neon-cyan', name: 'Neon Cyan', nameEn: 'Neon Cyan', price: 350, preview: '💙', category: 'neon', colors: { primary: '180 100% 70%', secondary: '180 100% 50%', background: '180 80% 20%' } },
    { id: 'neon-lime', name: 'Neon Yeşil', nameEn: 'Neon Lime', price: 350, preview: '💚', category: 'neon', colors: { primary: '80 100% 70%', secondary: '80 100% 50%', background: '80 80% 20%' } },
    { id: 'neon-orange', name: 'Neon Turuncu', nameEn: 'Neon Orange', price: 350, preview: '🧡', category: 'neon', colors: { primary: '30 100% 70%', secondary: '30 100% 50%', background: '30 80% 20%' } },
    
    // Anime themes (350 coins)
    { id: 'anime-sakura', name: 'Sakura', nameEn: 'Sakura', price: 350, preview: '🌸', category: 'anime', colors: { primary: '330 60% 80%', secondary: '330 80% 60%', background: '330 40% 90%' } },
    { id: 'anime-ocean', name: 'Anime Okyanus', nameEn: 'Anime Ocean', price: 350, preview: '🌊', category: 'anime', colors: { primary: '200 70% 70%', secondary: '200 90% 50%', background: '200 50% 90%' } },
    { id: 'anime-sunset', name: 'Anime Gün Batımı', nameEn: 'Anime Sunset', price: 350, preview: '🌅', category: 'anime', colors: { primary: '20 80% 70%', secondary: '20 100% 50%', background: '20 60% 90%' } },
    { id: 'anime-forest', name: 'Anime Orman', nameEn: 'Anime Forest', price: 350, preview: '🌲', category: 'anime', colors: { primary: '140 60% 70%', secondary: '140 80% 50%', background: '140 40% 90%' } },
    
    // Team themes (500 coins)
    { id: 'galatasaray', name: 'Galatasaray', nameEn: 'Galatasaray', price: 500, preview: '🦁', category: 'teams', colors: { primary: '45 100% 50%', secondary: '0 100% 50%', background: '45 100% 40%' } },
    { id: 'fenerbahce', name: 'Fenerbahçe', nameEn: 'Fenerbahçe', price: 500, preview: '🐦', category: 'teams', colors: { primary: '55 100% 50%', secondary: '240 100% 50%', background: '55 100% 40%' } },
    { id: 'besiktas', name: 'Beşiktaş', nameEn: 'Beşiktaş', price: 500, preview: '🦅', category: 'teams', colors: { primary: '0 0% 0%', secondary: '0 0% 100%', background: '0 0% 20%' } },
    { id: 'barcelona', name: 'Barcelona', nameEn: 'Barcelona', price: 500, preview: '⚽', category: 'teams', colors: { primary: '220 100% 50%', secondary: '0 100% 50%', background: '220 100% 40%' } },
    { id: 'realmadrid', name: 'Real Madrid', nameEn: 'Real Madrid', price: 500, preview: '👑', category: 'teams', colors: { primary: '0 0% 100%', secondary: '45 100% 50%', background: '0 0% 90%' } },
    
    // Country themes (500 coins)
    { id: 'turkey', name: 'Türkiye', nameEn: 'Turkey', price: 500, preview: '🇹🇷', category: 'countries', colors: { primary: '0 100% 50%', secondary: '0 0% 100%', background: '0 100% 40%' } },
    { id: 'france', name: 'Fransa', nameEn: 'France', price: 500, preview: '🇫🇷', category: 'countries', colors: { primary: '240 100% 50%', secondary: '0 100% 50%', background: '240 100% 40%' } },
  ];

  const currentCoins = isAuthenticated ? userStats?.coin_balance || 0 : stats.coinBalance;

  const handlePurchase = (theme: ThemeItem) => {
    if (currentCoins < theme.price) {
      toast({
        title: t('shop.insufficientCoins'),
        description: `${currentLanguage === 'tr' ? 'Bu tema için' : 'Required:'} ${theme.price} ${currentLanguage === 'tr' ? 'coin gerekli. Mevcut:' : 'coins. Current:'} ${currentCoins}`,
        variant: "destructive",
      });
      return;
    }

    if (purchasedItems.includes(theme.id)) {
      toast({
        title: currentLanguage === 'tr' ? 'Zaten Satın Alındı' : 'Already Purchased',
        description: currentLanguage === 'tr' ? 'Bu temayı zaten satın aldınız!' : 'You already own this theme!',
        variant: "destructive",
      });
      return;
    }

    updateCoins(-theme.price);
    setPurchasedItems(prev => [...prev, theme.id]);
    toast({
      title: t('shop.purchased'),
      description: currentLanguage === 'tr' ? `${theme.name} satın alındı!` : `${theme.nameEn} purchased!`,
    });
  };

  const categoryNames = {
    basic: currentLanguage === 'tr' ? 'Temel Temalar' : 'Basic Themes',
    neon: currentLanguage === 'tr' ? 'Neon Temalar' : 'Neon Themes',
    anime: currentLanguage === 'tr' ? 'Anime Temalar' : 'Anime Themes',
    teams: currentLanguage === 'tr' ? 'Takım Temaları' : 'Team Themes',
    countries: currentLanguage === 'tr' ? 'Ülke Temaları' : 'Country Themes',
  };

  const groupedThemes = themes.reduce((acc, theme) => {
    if (!acc[theme.category]) {
      acc[theme.category] = [];
    }
    acc[theme.category].push(theme);
    return acc;
  }, {} as Record<string, ThemeItem[]>);

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="btn-secondary-gaming"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('shop.back')}
          </Button>
          
          <h1 className="text-3xl font-bold text-center text-foreground">
            {t('shop.title')}
          </h1>

          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2">
            <CoinIcon className="w-6 h-6" />
            <span className="font-bold text-foreground text-lg">
              {currentCoins}
            </span>
          </div>
        </div>

        {/* Theme Categories */}
        <div className="space-y-8">
          {Object.entries(groupedThemes).map(([category, categoryThemes]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                {categoryNames[category as keyof typeof categoryNames]}
                <Badge variant="secondary" className="text-sm">
                  {categoryThemes[0].price} <CoinIcon className="w-3 h-3 ml-1" />
                </Badge>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryThemes.map((theme) => (
                  <Card key={theme.id} className="p-4 bg-card/90 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                    <div className="text-center space-y-3">
                      <div className="text-4xl mb-2">{theme.preview}</div>
                      <h3 className="font-bold text-lg text-foreground">
                        {currentLanguage === 'tr' ? theme.name : theme.nameEn}
                      </h3>
                      
                      {/* Theme Preview */}
                      <div 
                        className="w-full h-16 rounded-lg border-2 border-border"
                        style={{
                          background: `linear-gradient(135deg, hsl(${theme.colors.primary}), hsl(${theme.colors.secondary}))`
                        }}
                      />
                      
                      <div className="flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground">
                        <span>{theme.price}</span>
                        <CoinIcon className="w-4 h-4" />
                      </div>
                      
                      <Button
                        onClick={() => handlePurchase(theme)}
                        className={`w-full ${purchasedItems.includes(theme.id) ? 'btn-secondary-gaming' : 'btn-gaming'}`}
                        disabled={purchasedItems.includes(theme.id) || currentCoins < theme.price}
                      >
                        {purchasedItems.includes(theme.id) 
                          ? t('shop.owned')
                          : t('shop.buy')
                        }
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Ad Section */}
        <Card className="mt-8 p-6 bg-card/90 backdrop-blur-sm text-center">
          <div className="text-4xl mb-4">📺</div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {currentLanguage === 'tr' ? 'Coin Kazanmak için Reklam İzle!' : 'Watch Ads to Earn Coins!'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {currentLanguage === 'tr' ? 'Ana menüdeki coin simgesine tıklayarak reklam izleyebilirsiniz.' : 'Click the coin icon in the main menu to watch ads.'}
          </p>
          <div className="flex items-center justify-center gap-2 bg-primary/10 rounded-lg p-3 max-w-xs mx-auto">
            <span className="text-lg font-bold">+20</span>
            <CoinIcon className="w-5 h-5" />
            <span className="text-sm">{currentLanguage === 'tr' ? 'reklam başına' : 'per ad'}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ShopScreen;