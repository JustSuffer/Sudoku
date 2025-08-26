import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'tr' | 'en';

interface LanguageStore {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  tr: {
    // Main Menu
    'main.title': 'Sudoku Master',
    'main.profile': 'Profil',
    'main.shop': 'Mağaza',
    'main.easy': 'Kolay',
    'main.medium': 'Orta',
    'main.hard': 'Zor',
    'main.expert': 'Uzman',
    'main.level': 'Seviye',
    'main.experience': 'Deneyim',
    'main.coins': 'Coin',
    
    // Game Screen
    'game.mainMenu': 'Ana Menü',
    'game.level': 'Seviye',
    'game.time': 'Süre',
    'game.record': 'Rekor',
    'game.experience': 'Deneyim',
    'game.toBoss': 'Boss\'a',
    'game.hint': 'İpucu',
    'game.writingMode': 'Not Modu',
    'game.paused': 'DURDURULDU',
    'game.continue': 'Devam Et',
    'game.gameOver': 'OYUN BİTTİ!',
    'game.allLivesLost': 'Tüm canlarınızı kaybettiniz!',
    'game.tryAgain': 'Tekrar Dene',
    'game.congratulations': 'TEBRİKLER!',
    'game.completed': 'Puzzle {time} sürede tamamlandı!',
    'game.coinsEarned': '+{coins} coin kazandınız!',
    'game.wrongMove': 'Yanlış Hamle!',
    'game.livesLeft': '{lives} canınız kaldı',
    'game.insufficientCoins': 'Yetersiz Coin',
    'game.hintCost': 'İpucu için 80 coin gerekli.',
    'game.hintUsed': 'İpucu Kullanıldı',
    'game.hintUsedDesc': '80 coin karşılığında bir hücre dolduruldu.',
    
    // Shop
    'shop.title': 'Mağaza',
    'shop.back': 'Geri',
    'shop.buy': 'Satın Al',
    'shop.owned': 'Sahip',
    'shop.insufficientCoins': 'Yetersiz coin!',
    'shop.purchased': 'Tema satın alındı!',
    'shop.categories.basic': 'Temel Temalar',
    'shop.categories.neon': 'Neon Temalar',
    'shop.categories.anime': 'Anime Temalar',
    'shop.categories.teams': 'Takım Temaları',
    'shop.categories.countries': 'Ülke Temaları',
    
    // Profile
    'profile.title': 'Profil',
    'profile.settings': 'Ayarlar',
    'profile.themes': 'Temalar',
    'profile.stats': 'İstatistikler',
    'profile.loginRequired': 'Lütfen bu sekmeyi görmek için giriş yapınız',
    'profile.displayName': 'Görünen İsim',
    'profile.changePhoto': 'Profil Fotoğrafı Değiştir',
    'profile.save': 'Kaydet',
    'profile.apply': 'Uygula',
    'profile.gamesPlayed': 'Oynanan Oyun',
    'profile.gamesWon': 'Kazanılan Oyun',
    'profile.totalTime': 'Toplam Süre',
    'profile.bestTimes': 'En İyi Zamanlar',
    
    // Ad Modal
    'ad.title': 'Reklam İzle',
    'ad.description': 'Reklam izleyerek 20 coin kazanabilirsiniz!',
    'ad.watch': 'Reklam İzle',
    'ad.cancel': 'İptal',
    'ad.earned': 'Coin Kazandınız!',
    'ad.earnedDesc': 'Reklam izlediğiniz için 20 coin kazandınız.',
    
    // Auth
    'auth.login': 'Giriş Yap',
    'auth.signup': 'Kayıt Ol',
    'auth.email': 'E-posta',
    'auth.password': 'Şifre',
    'auth.forgotPassword': 'Şifremi Unuttum',
  },
  en: {
    // Main Menu
    'main.title': 'Sudoku Master',
    'main.profile': 'Profile',
    'main.shop': 'Shop',
    'main.easy': 'Easy',
    'main.medium': 'Medium',
    'main.hard': 'Hard',
    'main.expert': 'Expert',
    'main.level': 'Level',
    'main.experience': 'Experience',
    'main.coins': 'Coins',
    
    // Game Screen
    'game.mainMenu': 'Main Menu',
    'game.level': 'Level',
    'game.time': 'Time',
    'game.record': 'Record',
    'game.experience': 'Experience',
    'game.toBoss': 'To Boss',
    'game.hint': 'Hint',
    'game.writingMode': 'Note Mode',
    'game.paused': 'PAUSED',
    'game.continue': 'Continue',
    'game.gameOver': 'GAME OVER!',
    'game.allLivesLost': 'You lost all your lives!',
    'game.tryAgain': 'Try Again',
    'game.congratulations': 'CONGRATULATIONS!',
    'game.completed': 'Puzzle completed in {time}!',
    'game.coinsEarned': '+{coins} coins earned!',
    'game.wrongMove': 'Wrong Move!',
    'game.livesLeft': '{lives} lives remaining',
    'game.insufficientCoins': 'Insufficient Coins',
    'game.hintCost': '80 coins required for hint.',
    'game.hintUsed': 'Hint Used',
    'game.hintUsedDesc': 'A cell was filled for 80 coins.',
    
    // Shop
    'shop.title': 'Shop',
    'shop.back': 'Back',
    'shop.buy': 'Buy',
    'shop.owned': 'Owned',
    'shop.insufficientCoins': 'Insufficient coins!',
    'shop.purchased': 'Theme purchased!',
    'shop.categories.basic': 'Basic Themes',
    'shop.categories.neon': 'Neon Themes',
    'shop.categories.anime': 'Anime Themes',
    'shop.categories.teams': 'Team Themes',
    'shop.categories.countries': 'Country Themes',
    
    // Profile
    'profile.title': 'Profile',
    'profile.settings': 'Settings',
    'profile.themes': 'Themes',
    'profile.stats': 'Statistics',
    'profile.loginRequired': 'Please log in to view this section',
    'profile.displayName': 'Display Name',
    'profile.changePhoto': 'Change Profile Photo',
    'profile.save': 'Save',
    'profile.apply': 'Apply',
    'profile.gamesPlayed': 'Games Played',
    'profile.gamesWon': 'Games Won',
    'profile.totalTime': 'Total Time',
    'profile.bestTimes': 'Best Times',
    
    // Ad Modal
    'ad.title': 'Watch Ad',
    'ad.description': 'Watch an ad to earn 20 coins!',
    'ad.watch': 'Watch Ad',
    'ad.cancel': 'Cancel',
    'ad.earned': 'Coins Earned!',
    'ad.earnedDesc': 'You earned 20 coins for watching the ad.',
    
    // Auth
    'auth.login': 'Log In',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot Password',
  },
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 'tr',
      setLanguage: (language: Language) => set({ currentLanguage: language }),
      t: (key: string) => {
        const { currentLanguage } = get();
        const translation = translations[currentLanguage][key as keyof typeof translations['tr']];
        return translation || key;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);