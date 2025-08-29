import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, X, Gift } from 'lucide-react';
import CoinIcon from './CoinIcon';
import { useGameStore } from '@/hooks/useGameStore';
import { useToast } from '@/hooks/use-toast';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdModal = ({ isOpen, onClose }: AdModalProps) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const { updateCoins } = useGameStore();
  const { toast } = useToast();

  const watchAd = () => {
    setIsWatchingAd(true);
    
    // Simulate ad watching
    setTimeout(() => {
      updateCoins(20);
      setIsWatchingAd(false);
      toast({
        title: "Coin Kazandınız!",
        description: "Reklam izlediğiniz için 20 coin kazandınız.",
        variant: "default",
      });
      onClose();
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Ücretsiz Coin Kazan
          </DialogTitle>
        </DialogHeader>
        
        {!isWatchingAd ? (
          <Card className="p-6 text-center space-y-4">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-bold text-foreground">
              Reklam İzleyerek Coin Kazan!
            </h3>
            <p className="text-muted-foreground">
              Reklam izleyerek 20 coin kazanabilirsiniz!
            </p>
            
            <div className="flex items-center justify-center gap-2 bg-primary/10 rounded-lg p-3">
              <span className="text-lg font-bold">+20</span>
              <CoinIcon className="w-6 h-6" />
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button onClick={watchAd} className="btn-gaming flex items-center gap-2">
                <Play className="w-4 h-4" />
                Reklamı İzle
              </Button>
              <Button onClick={onClose} variant="outline" className="btn-secondary-gaming">
                <X className="w-4 h-4" />
                İptal
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 text-center space-y-4">
            <div className="text-4xl animate-spin">⏳</div>
            <h3 className="text-xl font-bold text-foreground">
              Reklam Oynatılıyor...
            </h3>
            <p className="text-muted-foreground">
              Lütfen bekleyin, reklam bittikten sonra coin'leriniz hesabınıza eklenecek
            </p>
            <div className="w-full bg-secondary/20 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-100 animate-pulse"
                style={{ width: '33%' }}
              ></div>
            </div>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}; //use ad modal


export default AdModal;