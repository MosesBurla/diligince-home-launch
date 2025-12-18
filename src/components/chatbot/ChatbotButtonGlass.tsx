import React from 'react';
import { Bot, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatbotButtonGlassProps {
  isOpen: boolean;
  onClick: () => void;
  isShaking?: boolean;
  showBubble?: boolean;
}

export const ChatbotButtonGlass: React.FC<ChatbotButtonGlassProps> = ({ 
  isOpen, 
  onClick,
  isShaking = false,
  showBubble = false
}) => {
  return (
    <>
      {/* Speech Bubble - "Hey, I'm here" */}
      {showBubble && !isOpen && (
        <div 
          className={cn(
            "fixed z-50 bottom-6 right-[5.5rem]",
            "max-sm:bottom-4 max-sm:right-[4.5rem]",
            "whitespace-nowrap",
            "bg-background text-foreground text-sm font-medium",
            "px-4 py-2.5 rounded-full shadow-lg",
            "border border-border/50",
            "animate-bubble-in",
            // Tail pointing to button
            "after:content-[''] after:absolute after:left-full after:top-1/2 after:-translate-y-1/2",
            "after:border-[8px] after:border-transparent after:border-l-background",
            // Shadow on tail
            "before:content-[''] before:absolute before:left-full before:top-1/2 before:-translate-y-1/2",
            "before:border-[9px] before:border-transparent before:border-l-border/30 before:ml-[1px]"
          )}
        >
          <span className="flex items-center gap-1.5">
            Hey, I'm here
            <span className="animate-pulse">👋</span>
          </span>
        </div>
      )}

      <button
        onClick={onClick}
        className={cn(
          "fixed z-50 bottom-6 right-6",
          "w-14 h-14 rounded-full",
          // Glassmorphism effect
          "bg-brand-primary/70 backdrop-blur-xl",
          "border border-white/25",
          "shadow-[0_8px_32px_rgba(21,59,96,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]",
          "text-white",
          "flex items-center justify-center",
          "transition-all duration-300 ease-out",
          "hover:bg-brand-primary/85 hover:scale-105",
          "hover:shadow-[0_12px_40px_rgba(21,59,96,0.5)]",
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
            {/* Inner glassy background to create ring effect */}
            <div className="absolute inset-[1px] rounded-full bg-brand-primary/60 backdrop-blur-xl border border-white/10" />
            {/* Outer glow */}
            <div className="absolute inset-[-8px] rounded-full animate-ai-glow opacity-70" />
          </>
        )}
        
        {/* Single centered icon - larger size */}
        <div className={cn(
          "relative z-10 flex items-center justify-center",
          "transition-transform duration-300",
          isOpen && "rotate-90",
          isShaking && !isOpen && "animate-shake"
        )}>
          {isOpen ? (
            <X className="w-7 h-7 max-sm:w-6 max-sm:h-6" />
          ) : (
            <Bot className="w-7 h-7 max-sm:w-6 max-sm:h-6" />
          )}
        </div>
      </button>
    </>
  );
};
