import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from './types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={cn(
        "flex items-start gap-2 animate-fade-in",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div 
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
          isUser 
            ? "bg-brand-primary text-white" 
            : "bg-brand-primary/10"
        )}
      >
        {isUser ? (
          <User className="w-3 h-3" />
        ) : (
          <Bot className="w-3 h-3 text-brand-primary" />
        )}
      </div>
      
      {/* Message Bubble */}
      <div 
        className={cn(
          "max-w-[85%] rounded-xl px-2.5 py-1.5",
          isUser 
            ? "bg-brand-primary text-white rounded-tr-sm" 
            : "bg-muted text-foreground rounded-tl-sm"
        )}
      >
        {isUser ? (
          <p className="text-[11px] leading-snug whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="chat-prose">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        
        {/* Timestamp */}
        <p 
          className={cn(
            "text-[9px] mt-0.5 opacity-40",
            isUser ? "text-right" : "text-left"
          )}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
