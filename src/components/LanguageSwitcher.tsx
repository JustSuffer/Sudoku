import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Language = 'tr' | 'en';

const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('tr');

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'tr' ? 'en' : 'tr');
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