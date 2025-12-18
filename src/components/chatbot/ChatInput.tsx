import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  }, [value]);
  
  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="p-3 bg-muted/30">
      {/* Unified Input Container */}
      <div className="relative flex items-end">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full resize-none rounded-xl bg-background",
            "pl-4 pr-12 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
            "border border-border/50 focus:border-brand-primary/50",
            "focus:outline-none focus:ring-1 focus:ring-brand-primary/20",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          style={{ maxHeight: '100px' }}
        />
        
        {/* Send Button - Inside Input */}
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className={cn(
            "absolute right-2 bottom-1.5",
            "w-8 h-8 rounded-lg flex items-center justify-center",
            "text-brand-primary hover:bg-brand-primary hover:text-white",
            "transition-all duration-200",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-brand-primary"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
