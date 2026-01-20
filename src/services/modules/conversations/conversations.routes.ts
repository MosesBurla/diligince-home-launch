import { API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}`;

// Conversations Routes
export const conversationsRoutes = {
    base: `${BASE_PATH}/messages`,
    conversations: `${BASE_PATH}/messages/conversations`,
    createConversation: `${BASE_PATH}/messages/conversation`,
    updateConversation: (id: string) => `${BASE_PATH}/messages/conversation/${id}`,
    quotationConversation: (quotationId: string) => `${BASE_PATH}/messages/conversation/quotation/${quotationId}`,
    messages: `${BASE_PATH}/messages`,
    markRead: `${BASE_PATH}/messages/mark-read`,
} as const;
