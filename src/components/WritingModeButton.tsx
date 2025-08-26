import { PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface WritingModeButtonProps {
  isWritingMode: boolean;
  onToggle: () => void;
}

const WritingModeButton = ({ isWritingMode, onToggle }: WritingModeButtonProps) => {
  const { t } = useLanguage();

  return (
    <Button
      onClick={onToggle}
      variant={isWritingMode ? "default" : "outline"}
      size="lg"
      className={`
        writing-mode-button relative transition-all duration-300 
        ${isWritingMode 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105' 
          : 'hover:scale-105'
        }
      `}
    >
      <PenTool className={`w-5 h-5 mr-2 ${isWritingMode ? 'text-white' : ''}`} />
      <span className="font-semibold">
        {t('game.writingMode')}
      </span>
      {isWritingMode && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      )}
    </Button>
  );
};

export default WritingModeButton;