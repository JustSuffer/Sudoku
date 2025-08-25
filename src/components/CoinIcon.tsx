import { useGameStore } from '@/hooks/useGameStore';

const CoinIcon = ({ className = "w-6 h-6" }: { className?: string }) => {
  const { theme } = useGameStore();
  
  return (
    <div className={`${className} relative flex items-center justify-center`}>
      <div className={`
        w-full h-full rounded-full border-2 flex items-center justify-center font-bold text-xs
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-500 text-black shadow-gaming' 
          : 'bg-gradient-to-br from-green-200 to-purple-200 border-green-400 text-foreground shadow-lg'
        }
        transition-all duration-300 hover:scale-110 cursor-pointer
      `}>
        <span className="tracking-wider font-black">CM</span>
      </div>
    </div>
  );
};

export default CoinIcon;