import apiService from '@/services/core/api.service';
import { conversationsRoutes } from './conversations.routes';
import type {
    Conversation,
    Message,
    ConversationsResponse,
    MessagesResponse,
    CreateConversationRequest,
    SendMessageRequest,
} from './conversations.types';

class ConversationsService {
    /**
     * Get all conversations for the current user
     */
    async getConversations(params?: { page?: number; limit?: number; type?: string }): Promise<ConversationsResponse> {
        const response = await apiService.get<{ data: ConversationsResponse }>(
            conversationsRoutes.conversations,
            { params }
        );
        return response.data;
    }

    /**
     * Create a new conversation
     */
    async createConversation(data: CreateConversationRequest): Promise<Conversation> {
        const response = await apiService.post<{ data: Conversation }, CreateConversationRequest>(
            conversationsRoutes.createConversation,
            data
        );
        return response.data;
    }

    /**
     * Get or create a conversation for a specific quotation
     */
    async getQuotationConversation(quotationId: string): Promise<Conversation> {
        const response = await apiService.post<{ data: Conversation }, Record<string, never>>(
            conversationsRoutes.quotationConversation(quotationId),
            {}
        );
        return response.data;
    }

    /**
     * Get messages for a conversation
     */
    async getMessages(conversationId: string, params?: { page?: number; limit?: number }): Promise<MessagesResponse> {
        const response = await apiService.get<{ data: MessagesResponse }>(
            conversationsRoutes.messages,
            { params: { conversationId, ...params } }
        );
        return response.data;
    }

    /**
     * Send a message
     */
    async sendMessage(data: SendMessageRequest): Promise<Message> {
        const response = await apiService.post<{ data: Message }, SendMessageRequest>(
            conversationsRoutes.messages,
            data
        );
        return response.data;
    }

    /**
     * Mark messages as read
     */
    async markAsRead(conversationId: string, messageIds?: string[]): Promise<void> {
        await apiService.post(conversationsRoutes.markRead, {
            conversationId,
            messageIds,
        });
    }
}

export const conversationsService = new ConversationsService();
export default conversationsService;
