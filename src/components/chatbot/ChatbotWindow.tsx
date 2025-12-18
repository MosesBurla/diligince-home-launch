import React from 'react';
import { ChatMessage } from './types';
import { ChatbotHeader } from './ChatbotHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { cn } from '@/lib/utils';
import { ChatWindowState } from './DiliginceChatbot';

interface ChatbotWindowProps {
  windowState: ChatWindowState;
  messages: ChatMessage[];
  isTyping: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onExpand: () => void;
  onSendMessage: (message: string) => void;
}

export const ChatbotWindow: React.FC<ChatbotWindowProps> = ({
  windowState,
  messages,
  isTyping,
  onClose,
  onMinimize,
  onExpand,
  onSendMessage,
}) => {
  if (windowState === 'closed') return null;
  
  const isMinimized = windowState === 'minimized';
  
  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col",
        // Position - closer to FAB when minimized
        isMinimized 
          ? "bottom-[88px] right-6 top-auto left-auto max-sm:bottom-[72px] max-sm:right-4"
          : "bottom-24 right-6 max-sm:bottom-20 max-sm:right-3 max-sm:left-3 max-sm:w-auto",
        // Smooth transition for minimize/expand
        "transition-all duration-300 ease-out",
        // Background, border, shadow ONLY when open (not minimized)
        !isMinimized && [
          "bg-background border border-border rounded-2xl",
          "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_25px_-5px_rgba(21,59,96,0.15)]",
        ],
        // Conditional sizing based on state
        isMinimized 
          ? "w-[280px] max-sm:w-[200px]" 
          : "w-[380px] h-[520px] max-sm:h-[450px]",
        // Animation on initial open
        !isMinimized && "animate-scale-in origin-bottom-right"
      )}
    >
      {/* Header - always visible */}
      <ChatbotHeader 
        isMinimized={isMinimized}
        onClose={onClose}
        onMinimize={onMinimize}
        onExpand={onExpand}
      />
      
      {/* Messages & Input - hidden when minimized with smooth transition */}
      <div 
        className={cn(
          "flex flex-col flex-1 overflow-hidden transition-all duration-300",
          isMinimized ? "h-0 opacity-0" : "h-auto opacity-100"
        )}
      >
        <ChatMessageList 
          messages={messages}
          isTyping={isTyping}
          onSuggestedAction={onSendMessage}
        />
        
        <ChatInput 
          onSend={onSendMessage}
          disabled={isTyping}
        />
      </div>
    </div>
  );
};
