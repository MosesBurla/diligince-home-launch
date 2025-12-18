import React from 'react';
import { X, Bot, Sparkles, Minus, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatbotHeaderProps {
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onExpand: () => void;
}

export const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({ 
  isMinimized,
  onClose,
  onMinimize,
  onExpand,
}) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        isMinimized ? "rounded-2xl cursor-pointer" : "rounded-t-2xl",
        isMinimized && "hover:opacity-95 transition-opacity"
      )}
      onClick={isMinimized ? onExpand : undefined}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/95 to-brand-primary" />
      
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
      
      {/* Content */}
      <div className="relative flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          {/* Bot Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="w-4.5 h-4.5 text-white" />
            </div>
            {/* Online Indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-brand-primary" />
          </div>
          
          {/* Title */}
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-white font-semibold text-sm">Diligince AI</h3>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <p className="text-white/60 text-[10px]">
              {isMinimized ? "Click to expand" : "Procurement Assistant"}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {isMinimized ? (
            // Expand button when minimized
            <button
              onClick={(e) => { e.stopPropagation(); onExpand(); }}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 
                         flex items-center justify-center transition-colors"
              title="Expand"
            >
              <ChevronUp className="w-3.5 h-3.5 text-white" />
            </button>
          ) : (
            // Minimize button when open
            <button
              onClick={onMinimize}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 
                         flex items-center justify-center transition-colors"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5 text-white" />
            </button>
          )}
          
          {/* Close button - always visible */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 
                       flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
