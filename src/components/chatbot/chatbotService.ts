import { ChatMessage } from './types';

// API Configuration
const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL;
const CHATBOT_API_KEY = import.meta.env.VITE_CHATBOT_API_KEY;

interface ChatbotApiResponse {
  answer: string;
  sources: string[];
}

/**
 * Send chat message to the Diligince AI API
 */
export const sendChatMessage = async (
  query: string,
  _conversationHistory?: ChatMessage[]
): Promise<string> => {
  if (!CHATBOT_API_URL || !CHATBOT_API_KEY) {
    throw new Error('Chatbot API configuration is missing');
  }

  const response = await fetch(CHATBOT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': CHATBOT_API_KEY,
    },
    body: JSON.stringify({ question: query }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: ChatbotApiResponse = await response.json();
  return data.answer;
};

/**
 * Generate unique message ID
 */
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
