import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-2 animate-fade-in">
      {/* Animated Brain Avatar */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center animate-think-glow">
        <BrainCircuit className="w-4 h-4 text-purple-500 animate-think" />
      </div>
      
      {/* Thinking Text with Dots */}
      <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">Thinking</span>
        <div className="flex items-center gap-0.5">
          <span 
            className="w-1 h-1 bg-purple-500/70 rounded-full animate-bounce"
            style={{ animationDelay: '0ms', animationDuration: '600ms' }}
          />
          <span 
            className="w-1 h-1 bg-blue-500/70 rounded-full animate-bounce"
            style={{ animationDelay: '150ms', animationDuration: '600ms' }}
          />
          <span 
            className="w-1 h-1 bg-cyan-500/70 rounded-full animate-bounce"
            style={{ animationDelay: '300ms', animationDuration: '600ms' }}
          />
        </div>
      </div>
    </div>
  );
};
