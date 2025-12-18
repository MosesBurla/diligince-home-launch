import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from './types';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { SuggestedActions } from './SuggestedActions';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isTyping: boolean;
  onSuggestedAction: (message: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isTyping,
  onSuggestedAction,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);
  
  const hasMessages = messages.length > 0;
  
  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-4"
    >
      {!hasMessages && !isTyping ? (
        <SuggestedActions onActionClick={onSuggestedAction} />
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
        </div>
      )}
    </div>
  );
};
