import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChatMessage } from './types';
// Switch between button variants by changing the import:
// import { ChatbotButton } from './ChatbotButton'; // Original solid button
import { ChatbotButtonGlass as ChatbotButton } from './ChatbotButtonGlass'; // Glassy button
import { ChatbotWindow } from './ChatbotWindow';
import { sendChatMessage, generateMessageId } from './chatbotService';

export type ChatWindowState = 'closed' | 'minimized' | 'open';

export const DiliginceChatbot: React.FC = () => {
  const [windowState, setWindowState] = useState<ChatWindowState>('closed');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Attention animation state
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Derived state for compatibility
  const isOpen = windowState === 'open' || windowState === 'minimized';
  
  // Clear messages only when fully closing (not minimizing)
  useEffect(() => {
    if (windowState === 'closed') {
      const timer = setTimeout(() => {
        setMessages([]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [windowState]);
  
  // Speech bubble animation - stops permanently after first open
  useEffect(() => {
    if (isOpen || hasBeenOpened) {
      return;
    }
    
    const runBubbleCycle = () => {
      setShowBubble(true);
      animationTimeoutRef.current = setTimeout(() => {
        setShowBubble(false);
      }, 3000);
    };
    
    const initialDelay = setTimeout(runBubbleCycle, 5000);
    const interval = setInterval(runBubbleCycle, 8000);
    
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isOpen, hasBeenOpened]);
  
  // Shake animation - runs forever, only pauses while chat is open
  useEffect(() => {
    if (isOpen) {
      return;
    }
    
    const runShakeCycle = () => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    };
    
    const initialDelay = setTimeout(runShakeCycle, 5000);
    const interval = setInterval(runShakeCycle, 8000);
    
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [isOpen]);
  
  const handleToggle = useCallback(() => {
    if (windowState === 'closed') {
      // User is opening the chat - stop animation permanently
      setHasBeenOpened(true);
      setShowBubble(false);
      setIsShaking(false);
      setWindowState('open');
    } else {
      // Close completely when clicking FAB while open/minimized
      setWindowState('closed');
    }
  }, [windowState]);
  
  const handleClose = useCallback(() => {
    setWindowState('closed');
  }, []);
  
  const handleMinimize = useCallback(() => {
    setWindowState('minimized');
  }, []);
  
  const handleExpand = useCallback(() => {
    setWindowState('open');
  }, []);
  
  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Get AI response
      const response = await sendChatMessage(content, messages);
      
      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get chat response:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);
  
  return (
    <>
      {/* Floating Button with attention animation */}
      <ChatbotButton 
        isOpen={isOpen} 
        onClick={handleToggle}
        isShaking={isShaking}
        showBubble={showBubble}
      />
      
      {/* Chat Window */}
      <ChatbotWindow
        windowState={windowState}
        messages={messages}
        isTyping={isTyping}
        onClose={handleClose}
        onMinimize={handleMinimize}
        onExpand={handleExpand}
        onSendMessage={handleSendMessage}
      />
    </>
  );
};
