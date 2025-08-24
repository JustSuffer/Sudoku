import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Home, LogIn, UserPlus } from 'lucide-react';
import { useEffect } from 'react';

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: "Hesap Zaten Mevcut",
              description: "Bu email adresi ile zaten bir hesap bulunuyor. Giriş yapmayı deneyin.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Kayıt Hatası",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Kayıt Başarılı!",
            description: "Hesabınız oluşturuldu. Email adresinizi kontrol edin.",
          });
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Giriş Hatası",
              description: "Email veya şifre hatalı. Lütfen tekrar deneyin.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Giriş Hatası",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Hoş Geldiniz!",
            description: "Başarıyla giriş yaptınız.",
          });
          window.location.href = '/';
        }
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="btn-secondary-gaming"
          >
            <Home className="w-4 h-4 mr-2" />
            Ana Menü
          </Button>
        </div>

        <Card className="p-8 bg-card/90 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp 
                ? 'Yeni hesap oluşturun ve 100 coin kazanın!' 
                : 'Hesabınıza giriş yapın'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full btn-gaming"
              disabled={loading}
            >
              {loading ? (
                'Lütfen bekleyin...'
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Hesap Oluştur
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Giriş Yap
                    </>
                  )}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
            >
              {isSignUp 
                ? 'Zaten hesabınız var mı? Giriş yapın' 
                : 'Hesabınız yok mu? Hesap oluşturun'
              }
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthScreen;