import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, User, Settings, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGameStore } from '@/hooks/useGameStore';
import CoinIcon from '@/components/CoinIcon';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { stats, userStats } = useGameStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="p-8 bg-card/80 backdrop-blur-sm text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-4">Giriş Gerekli</h2>
          <p className="text-muted-foreground mb-6">
            Bu sayfayı görüntülemek için lütfen giriş yapın.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/auth')} className="btn-gaming">
              Giriş Yap
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="btn-secondary-gaming">
              Ana Menü
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-4xl mx-auto">
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
              <User className="w-8 h-8" />
              PROFİL
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2">
            <CoinIcon className="w-6 h-6" />
            <span className="font-bold text-xl text-foreground">
              {userStats?.coin_balance || 0}
            </span>
          </div>
        </div>

        {/* User Info */}
        <Card className="mb-8 p-6 bg-card/80 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {user?.email?.split('@')[0] || 'Oyuncu'}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
            
            <div className="flex items-center justify-center gap-2 text-lg">
              <Crown className="w-5 h-5 text-warning" />
              <span className="font-bold text-foreground">Seviye {userStats?.current_level || 1}</span>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="mb-8 p-6 bg-card/80 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-foreground mb-4 text-center">İstatistikler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userStats?.total_games_played || 0}</div>
              <div className="text-sm text-muted-foreground">Toplam Oyun</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{userStats?.total_games_won || 0}</div>
              <div className="text-sm text-muted-foreground">Kazanılan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{userStats?.total_experience || 0}</div>
              <div className="text-sm text-muted-foreground">Deneyim</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{userStats?.games_until_boss || 5}</div>
              <div className="text-sm text-muted-foreground">Boss'a Kalan</div>
            </div>
          </div>
        </Card>

        {/* Best Times */}
        <Card className="mb-8 p-6 bg-card/80 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-foreground mb-4 text-center">En İyi Süre Rekorları</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['easy', 'medium', 'hard', 'expert'].map((difficulty) => {
              const times = userStats?.best_times as any;
              const time = times?.[difficulty] || 0;
              const formatTime = (seconds: number) => {
                if (!seconds) return '--:--';
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
              };

              return (
                <div key={difficulty} className="text-center">
                  <div className="text-lg font-bold text-foreground">{formatTime(time)}</div>
                  <div className="text-sm text-muted-foreground capitalize">{difficulty}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Settings Section */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-foreground mb-4 text-center">Ayarlar</h3>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full btn-secondary-gaming"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5 mr-2" />
              Oyun Ayarları
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Görünen İsim</label>
                <input 
                  type="text" 
                  className="w-full p-2 rounded-lg bg-input border border-border text-foreground"
                  placeholder="İsminizi girin"
                  defaultValue={user?.email?.split('@')[0] || ''}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Avatar URL</label>
                <input 
                  type="url" 
                  className="w-full p-2 rounded-lg bg-input border border-border text-foreground"
                  placeholder="Avatar URL'si"
                />
              </div>
            </div>
            
            <Button className="w-full btn-gaming">
              Değişiklikleri Kaydet
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileScreen;