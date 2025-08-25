import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { useAuth } from '@/hooks/useAuth';
import CoinIcon from '@/components/CoinIcon';
import { useToast } from '@/hooks/use-toast';

interface ThemeItem {
  id: string;
  name: string;
  price: number;
  preview: string;
  category: 'normal' | 'special';
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
  const { toast } = useToast();
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const themes: ThemeItem[] = [
    // Normal themes (250 coins)
    { id: 'ocean', name: 'Okyanus', price: 250, preview: '🌊', category: 'normal', colors: { primary: '200 100% 50%', secondary: '220 100% 60%', background: '190 100% 40%' } },
    { id: 'forest', name: 'Orman', price: 250, preview: '🌲', category: 'normal', colors: { primary: '120 60% 50%', secondary: '100 50% 40%', background: '140 70% 30%' } },
    { id: 'sunset', name: 'Gün Batımı', price: 250, preview: '🌅', category: 'normal', colors: { primary: '20 100% 60%', secondary: '40 100% 50%', background: '350 100% 50%' } },
    { id: 'midnight', name: 'Gece Yarısı', price: 250, preview: '🌙', category: 'normal', colors: { primary: '240 50% 30%', secondary: '260 60% 20%', background: '220 70% 15%' } },
    
    // Special team themes (500 coins)
    { id: 'galatasaray', name: 'Galatasaray', price: 500, preview: '🦁', category: 'special', colors: { primary: '45 100% 50%', secondary: '0 100% 50%', background: '45 100% 40%' } },
    { id: 'fenerbahce', name: 'Fenerbahçe', price: 500, preview: '🐦', category: 'special', colors: { primary: '55 100% 50%', secondary: '240 100% 50%', background: '55 100% 40%' } },
    { id: 'besiktas', name: 'Beşiktaş', price: 500, preview: '🦅', category: 'special', colors: { primary: '0 0% 0%', secondary: '0 0% 100%', background: '0 0% 20%' } },
    { id: 'barcelona', name: 'Barcelona', price: 500, preview: '⚽', category: 'special', colors: { primary: '220 100% 50%', secondary: '0 100% 50%', background: '220 100% 40%' } },
    { id: 'realmadrid', name: 'Real Madrid', price: 500, preview: '👑', category: 'special', colors: { primary: '0 0% 100%', secondary: '45 100% 50%', background: '0 0% 90%' } },
    { id: 'turkey', name: 'Türkiye', price: 500, preview: '🇹🇷', category: 'special', colors: { primary: '0 100% 50%', secondary: '0 0% 100%', background: '0 100% 40%' } },
    { id: 'france', name: 'Fransa', price: 500, preview: '🇫🇷', category: 'special', colors: { primary: '240 100% 50%', secondary: '0 100% 50%', background: '240 100% 40%' } },
  ];

  const currentCoins = isAuthenticated ? userStats?.coin_balance || 0 : stats.coinBalance;

  const handlePurchase = (theme: ThemeItem) => {
    if (currentCoins < theme.price) {
      toast({
        title: "Yetersiz Coin",
        description: `Bu tema için ${theme.price} coin gerekli. Mevcut: ${currentCoins}`,
        variant: "destructive",
      });
      return;
    }

    if (purchasedItems.includes(theme.id)) {
      toast({
        title: "Zaten Satın Alındı",
        description: "Bu temayı zaten satın aldınız!",
        variant: "destructive",
      });
      return;
    }

    updateCoins(-theme.price);
    setPurchasedItems(prev => [...prev, theme.id]);
    
    toast({
      title: "Satın Alma Başarılı!",
      description: `${theme.name} teması satın alındı. Profil sayfasından uygulayabilirsiniz.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="btn-secondary-gaming"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Menü
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <ShoppingBag className="w-8 h-8" />
              MAĞAZA
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2">
            <CoinIcon className="w-6 h-6" />
            <span className="font-bold text-xl text-foreground">{currentCoins}</span>
          </div>
        </div>

        {/* Normal Themes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Normal Temalar (250 <CoinIcon className="w-5 h-5 inline" />)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {themes.filter(theme => theme.category === 'normal').map((theme) => (
              <Card key={theme.id} className="p-6 bg-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                <div className="text-center space-y-4">
                  <div className="text-6xl">{theme.preview}</div>
                  <h3 className="text-xl font-bold text-foreground">{theme.name}</h3>
                  
                  {/* Theme Preview */}
                  <div 
                    className="w-full h-16 rounded-lg border-2 border-primary/20"
                    style={{
                      background: `linear-gradient(135deg, hsl(${theme.colors.primary}), hsl(${theme.colors.secondary}))`
                    }}
                  ></div>
                  
                  <div className="flex items-center justify-center gap-2 text-lg font-bold">
                    <span>{theme.price}</span>
                    <CoinIcon className="w-5 h-5" />
                  </div>
                  
                  <Button 
                    onClick={() => handlePurchase(theme)}
                    className={`w-full ${purchasedItems.includes(theme.id) ? 'btn-secondary-gaming' : 'btn-gaming'}`}
                    disabled={purchasedItems.includes(theme.id)}
                  >
                    {purchasedItems.includes(theme.id) ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Satın Alındı
                      </>
                    ) : (
                      'Satın Al'
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Special Themes */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Özel Takım Temaları (500 <CoinIcon className="w-5 h-5 inline" />)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.filter(theme => theme.category === 'special').map((theme) => (
              <Card key={theme.id} className="p-6 bg-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 border-2 border-warning/50">
                <div className="text-center space-y-4">
                  <div className="text-6xl">{theme.preview}</div>
                  <h3 className="text-xl font-bold text-foreground">{theme.name}</h3>
                  <div className="text-sm text-warning font-semibold">✨ ÖZEL TEMA ✨</div>
                  
                  {/* Theme Preview */}
                  <div 
                    className="w-full h-20 rounded-lg border-2 border-warning/30"
                    style={{
                      background: `linear-gradient(135deg, hsl(${theme.colors.primary}), hsl(${theme.colors.secondary}))`
                    }}
                  ></div>
                  
                  <div className="flex items-center justify-center gap-2 text-lg font-bold text-warning">
                    <span>{theme.price}</span>
                    <CoinIcon className="w-5 h-5" />
                  </div>
                  
                  <Button 
                    onClick={() => handlePurchase(theme)}
                    className={`w-full ${purchasedItems.includes(theme.id) ? 'btn-secondary-gaming' : 'btn-gaming'}`}
                    disabled={purchasedItems.includes(theme.id)}
                  >
                    {purchasedItems.includes(theme.id) ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Satın Alındı
                      </>
                    ) : (
                      'Satın Al'
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopScreen;