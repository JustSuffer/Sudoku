import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Home, Moon, Sun, Volume2, VolumeX, Trash2 } from 'lucide-react';
import { useState } from 'react';

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { theme, setTheme, stats, updateStats } = useGameStore();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const resetProgress = () => {
    updateStats({
      gamesPlayed: 0,
      gamesWon: 0,
      totalTime: 0,
      bestTimes: {
        easy: 0,
        medium: 0,
        hard: 0,
        expert: 0,
      },
      currentLevel: 1,
      experience: 0,
      gamesUntilBoss: 5,
    });
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="btn-secondary-gaming"
          >
            <Home className="w-4 h-4 mr-2" />
            Ana Menü
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground">Ayarlar</h1>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Theme Settings */}
        <Card className="p-6 mb-6 bg-card/90 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4 text-foreground">Tema Ayarları</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-foreground">Tema Seçimi</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-2 ${theme === 'light' ? 'btn-gaming' : 'btn-secondary-gaming'}`}
                >
                  <Sun className="w-4 h-4" />
                  Açık
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-2 ${theme === 'dark' ? 'btn-gaming' : 'btn-secondary-gaming'}`}
                >
                  <Moon className="w-4 h-4" />
                  Koyu
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-primary rounded-lg">
              <div className="text-sm text-primary-foreground">
                {theme === 'dark' ? (
                  '🌙 Koyu tema: Siyah arka plan + Altın detaylar + Gri tonlar'
                ) : (
                  '☀️ Açık tema: Beyaz arka plan + Açık yeşil + Açık mor detaylar'
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Sound Settings */}
        <Card className="p-6 mb-6 bg-card/90 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4 text-foreground">Ses Ayarları</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-foreground" />
                ) : (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                )}
                <Label className="text-base font-medium text-foreground">Ses Efektleri</Label>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
            
            {soundEnabled && (
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">Ses Seviyesi</Label>
                <div className="px-4">
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  %{volume[0]}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Game Statistics */}
        <Card className="p-6 mb-6 bg-card/90 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4 text-foreground">Oyun İstatistikleri</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-secondary-foreground">{stats.currentLevel}</div>
              <div className="text-sm text-secondary-foreground/80">Mevcut Seviye</div>
            </div>
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-secondary-foreground">{stats.gamesWon}</div>
              <div className="text-sm text-secondary-foreground/80">Toplam Zafer</div>
            </div>
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-secondary-foreground">
                {Math.round((stats.gamesWon / Math.max(stats.gamesPlayed, 1)) * 100)}%
              </div>
              <div className="text-sm text-secondary-foreground/80">Başarı Oranı</div>
            </div>
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-secondary-foreground">
                {Math.floor(stats.totalTime / 60)}
              </div>
              <div className="text-sm text-secondary-foreground/80">Toplam Dakika</div>
            </div>
          </div>

          {/* Best Times */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">En İyi Süreler</h4>
            {Object.entries(stats.bestTimes).map(([difficulty, time]) => (
              <div key={difficulty} className="flex justify-between items-center py-2 px-4 bg-accent rounded">
                <span className="capitalize text-foreground">
                  {difficulty === 'easy' ? 'Kolay' : 
                   difficulty === 'medium' ? 'Orta' : 
                   difficulty === 'hard' ? 'Zor' : 'Uzman'}
                </span>
                <span className="font-mono text-foreground">
                  {time > 0 ? `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}` : '--:--'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6 bg-card/90 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4 text-foreground">Veri Yönetimi</h3>
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Trash2 className="w-5 h-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-destructive mb-1">İlerlemeyi Sıfırla</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tüm oyun ilerlemeni, istatistikleri ve rekorları sıfırlar. Bu işlem geri alınamaz.
                  </p>
                  {!showResetConfirm ? (
                    <Button 
                      variant="destructive"
                      onClick={() => setShowResetConfirm(true)}
                      className="text-sm"
                    >
                      İlerlemeyi Sıfırla
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="destructive"
                        onClick={resetProgress}
                        className="text-sm"
                      >
                        Evet, Sıfırla
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setShowResetConfirm(false)}
                        className="text-sm"
                      >
                        İptal
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsScreen;