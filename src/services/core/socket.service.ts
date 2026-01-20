import { io, Socket } from 'socket.io-client';

// Socket event types
export interface SocketEvents {
    // Connection events
    connected: { socketId: string; userId: string; timestamp: Date };
    connect_error: Error;

    // User status events
    user_status_change: { userId: string; status: 'online' | 'offline'; timestamp: Date };

    // Message events
    new_message: {
        message: any;
        conversation: { _id: string; lastMessage: any }
    };
    message_updated: { messageId: string; content: string; isEdited: boolean };
    message_deleted: { messageId: string };
    messages_read: { userId: string; readAt: Date };

    // Typing events
    user_typing: { userId: string; conversationId: string; timestamp: Date };
    user_stopped_typing: { userId: string; conversationId: string; timestamp: Date };

    // Conversation events
    conversation_created: any;
    conversation_updated: any;

    // Notification events
    new_notification: any;
    notification_read: any;
}

type EventCallback<T = any> = (data: T) => void;

class SocketService {
    private socket: Socket | null = null;
    private listeners: Map<string, Set<EventCallback>> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private onlineUsers: Set<string> = new Set();

    /**
     * Connect to the WebSocket server
     */
    connect(token: string): void {
        if (this.socket?.connected) {
            console.log('[Socket] Already connected');
            return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

        console.log('[Socket] Connecting to:', apiUrl);

        this.socket = io(apiUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        this.setupDefaultListeners();
    }

    /**
     * Disconnect from the WebSocket server
     */
    disconnect(): void {
        if (this.socket) {
            console.log('[Socket] Disconnecting...');
            this.socket.disconnect();
            this.socket = null;
            this.onlineUsers.clear();
        }
    }

    /**
     * Check if socket is connected
     */
    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    /**
     * Get socket ID
     */
    getSocketId(): string | undefined {
        return this.socket?.id;
    }

    /**
     * Subscribe to an event
     */
    on<K extends keyof SocketEvents>(event: K, callback: EventCallback<SocketEvents[K]>): void;
    on(event: string, callback: EventCallback): void;
    on(event: string, callback: EventCallback): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);

        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    /**
     * Unsubscribe from an event
     */
    off<K extends keyof SocketEvents>(event: K, callback: EventCallback<SocketEvents[K]>): void;
    off(event: string, callback: EventCallback): void;
    off(event: string, callback: EventCallback): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.delete(callback);
        }

        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    /**
     * Emit an event to the server
     */
    emit(event: string, data?: any): void {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('[Socket] Cannot emit, socket not connected');
        }
    }

    /**
     * Join a room
     */
    joinRoom(roomId: string): void {
        this.emit('join_room', roomId);
    }

    /**
     * Leave a room
     */
    leaveRoom(roomId: string): void {
        this.emit('leave_room', roomId);
    }

    /**
     * Send typing indicator
     */
    sendTypingStart(conversationId: string): void {
        this.emit('typing_start', { conversationId });
    }

    /**
     * Stop typing indicator
     */
    sendTypingStop(conversationId: string): void {
        this.emit('typing_stop', { conversationId });
    }

    /**
     * Check if a user is online
     */
    isUserOnline(userId: string): boolean {
        return this.onlineUsers.has(userId);
    }

    /**
     * Get all online users
     */
    getOnlineUsers(): string[] {
        return Array.from(this.onlineUsers);
    }

    /**
     * Setup default socket event listeners
     */
    private setupDefaultListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('[Socket] Connected with ID:', this.socket?.id);
            this.reconnectAttempts = 0;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('[Socket] Connection error:', error.message);
            this.reconnectAttempts++;
        });

        this.socket.on('connected', (data) => {
            console.log('[Socket] Connection confirmed:', data);
        });

        // Track online users
        this.socket.on('user_status_change', (data: SocketEvents['user_status_change']) => {
            if (data.status === 'online') {
                this.onlineUsers.add(data.userId);
            } else {
                this.onlineUsers.delete(data.userId);
            }
        });

        // Re-attach any existing listeners
        this.listeners.forEach((callbacks, event) => {
            callbacks.forEach((callback) => {
                this.socket?.on(event, callback);
            });
        });
    }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
