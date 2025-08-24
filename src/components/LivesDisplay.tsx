import { Heart } from 'lucide-react';

interface LivesDisplayProps {
  lives: number;
  maxLives?: number;
  className?: string;
}

const LivesDisplay = ({ lives, maxLives = 3, className = "" }: LivesDisplayProps) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: maxLives }, (_, index) => (
        <Heart
          key={index}
          className={`w-6 h-6 transition-all duration-300 ${
            index < lives
              ? 'text-red-500 fill-red-500 scale-100'
              : 'text-muted-foreground/30 scale-75'
          }`}
        />
      ))}
    </div>
  );
};

export default LivesDisplay;