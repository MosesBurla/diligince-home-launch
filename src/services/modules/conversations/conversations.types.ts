// Conversation Types
export interface ConversationParticipant {
    userId: {
        _id: string;
        email: string;
        role: string;
    };
    role?: string;
    joinedAt: string;
    leftAt?: string;
    isActive: boolean;
}

export interface ConversationLastMessage {
    messageId: string;
    content: string;
    senderId: string;
    timestamp: string;
}

export interface Conversation {
    _id: string;
    participants: ConversationParticipant[];
    type: 'direct' | 'group' | 'support' | 'business';
    title?: string;
    description?: string;
    relatedId?: string;
    relatedType?: 'requirement' | 'rfq' | 'quote' | 'purchaseOrder' | 'project' | 'vendor-company';
    lastMessage?: ConversationLastMessage;
    settings?: {
        isEncrypted?: boolean;
        allowFileSharing?: boolean;
        allowVoiceCall?: boolean;
        allowVideoCall?: boolean;
        notificationsEnabled?: boolean;
    };
    isActive: boolean;
    unreadCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface MessageAttachment {
    name: string;
    url: string;
    type: string;
    size?: number;
    mimeType?: string;
}

export interface Message {
    _id: string;
    conversationId: string;
    senderId: {
        _id: string;
        email: string;
        role: string;
    };
    content: string;
    type: 'text' | 'file' | 'image' | 'voice' | 'video' | 'location' | 'system';
    replyTo?: Message;
    attachments?: MessageAttachment[];
    status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
    readBy?: Array<{ userId: string; readAt: string }>;
    deliveredTo?: Array<{ userId: string; deliveredAt: string }>;
    reactions?: Array<{ userId: string; emoji: string; createdAt: string }>;
    isEdited?: boolean;
    isDeleted?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ConversationsResponse {
    conversations: Conversation[];
    pagination: {
        current: number;
        pages: number;
        total: number;
    };
}

export interface MessagesResponse {
    messages: Message[];
    pagination: {
        current: number;
        pages: number;
        total: number;
    };
}

export interface CreateConversationRequest {
    participantIds: string[];
    type?: 'direct' | 'group' | 'support' | 'business';
    title?: string;
    description?: string;
    relatedId?: string;
    relatedType?: string;
}

export interface SendMessageRequest {
    conversationId: string;
    content: string;
    type?: 'text' | 'file' | 'image';
    replyTo?: string;
    attachments?: MessageAttachment[];
}
