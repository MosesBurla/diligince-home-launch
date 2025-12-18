import React from 'react';
import { Bot, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatbotButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed z-50 bottom-6 right-6",
        "w-14 h-14 rounded-full",
        "bg-gradient-to-br from-brand-primary to-brand-primary/90",
        "text-white shadow-strong",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:scale-105",
        "active:scale-95",
        "max-sm:bottom-4 max-sm:right-4 max-sm:w-12 max-sm:h-12"
      )}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {/* AI Gradient Glow Ring - only when closed */}
      {!isOpen && (
        <>
          {/* Rotating gradient border */}
          <div 
            className="absolute inset-[-3px] rounded-full opacity-80"
            style={{ 
              background: 'conic-gradient(from 0deg, hsl(270, 91%, 65%), hsl(217, 91%, 60%), hsl(187, 85%, 53%), hsl(217, 91%, 60%), hsl(270, 91%, 65%))',
              animation: 'spin 3s linear infinite'
            }}
          />
          {/* Inner background to create ring effect */}
          <div className="absolute inset-[1px] rounded-full bg-gradient-to-br from-brand-primary to-brand-primary/90" />
          {/* Outer glow */}
          <div className="absolute inset-[-8px] rounded-full animate-ai-glow opacity-70" />
        </>
      )}
      
      {/* Single centered icon */}
      <div className={cn(
        "relative z-10 flex items-center justify-center",
        "transition-transform duration-300",
        isOpen && "rotate-90"
      )}>
        {isOpen ? (
          <X className="w-6 h-6 max-sm:w-5 max-sm:h-5" />
        ) : (
          <Bot className="w-6 h-6 max-sm:w-5 max-sm:h-5" />
        )}
      </div>
    </button>
  );
};
