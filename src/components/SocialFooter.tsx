import { Instagram, Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SocialFooter = () => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center space-y-3 z-50">
      {/* Logo placeholder - will be replaced with actual logo */}
      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
        <img 
          src="/lovable-uploads/10e38595-0258-4647-922c-4296734f29b7.png" 
          alt="IZ Games Logo" 
          className="w-8 h-8 object-contain"
        />
      </div>
      
      {/* Social Media Links */}
      <div className="flex flex-col space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0 hover:bg-pink-500/20 hover:text-pink-500 transition-all duration-200"
          onClick={() => window.open('https://www.instagram.com/izzet_srn/', '_blank')}
        >
          <Instagram className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0 hover:bg-blue-500/20 hover:text-blue-500 transition-all duration-200"
          onClick={() => window.open('https://www.linkedin.com/in/izzetcansorna', '_blank')}
        >
          <Linkedin className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0 hover:bg-gray-500/20 hover:text-gray-500 transition-all duration-200"
          onClick={() => window.open('https://github.com/JustSuffer', '_blank')}
        >
          <Github className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default SocialFooter;