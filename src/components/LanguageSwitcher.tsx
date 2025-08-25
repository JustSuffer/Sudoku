import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const { currentLanguage, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(currentLanguage === 'tr' ? 'en' : 'tr');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`${className} btn-secondary-gaming font-bold border-2`}
    >
      {currentLanguage.toUpperCase()} | {currentLanguage === 'tr' ? 'EN' : 'TR'}
    </Button>
  );
};

export default LanguageSwitcher;