import React from 'react';
import { Instagram } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6';
      case 'lg': return 'w-10 h-10';
      default: return 'w-8 h-8';
    }
  };

  const getTextClass = () => {
    switch (size) {
      case 'sm': return 'text-lg';
      case 'lg': return 'text-2xl';
      default: return 'text-xl';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${getSizeClass()} bg-gradient-to-tr from-purple-600 to-pink-500 rounded-lg p-1.5 text-white`}>
        <Instagram className="w-full h-full" />
      </div>
      {showText && (
        <span className={`font-bold ${getTextClass()} bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500`}>
          Instaclone
        </span>
      )}
    </div>
  );
};

export default Logo;