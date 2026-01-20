import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { socketService, SocketEvents } from '@/services/core/socket.service';
import { useUser } from './UserContext';

interface WebSocketContextType {
    isConnected: boolean;
    onlineUsers: Set<string>;
    isUserOnline: (userId: string) => boolean;
    sendTypingIndicator: (conversationId: string, isTyping: boolean) => void;
    typingUsers: Map<string, Set<string>>; // conversationId -> Set of userIds typing
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const { user, isAuthenticated } = useUser();
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [typingUsers, setTypingUsers] = useState<Map<string, Set<string>>>(new Map());

    // Connect to WebSocket when user is authenticated
    useEffect(() => {
        // Get token from localStorage (where it's stored after login)
        const token = localStorage.getItem('authToken');

        if (user && isAuthenticated && token) {
            console.log('[WebSocketContext] User authenticated, connecting...');
            socketService.connect(token);
        } else {
            console.log('[WebSocketContext] No user or token, disconnecting...');
            socketService.disconnect();
            setIsConnected(false);
            setOnlineUsers(new Set());
        }

        return () => {
            socketService.disconnect();
        };
    }, [user, isAuthenticated]);

    // Setup socket event listeners
    useEffect(() => {
        const handleConnect = () => {
            console.log('[WebSocketContext] Connected');
            setIsConnected(true);
        };

        const handleDisconnect = () => {
            console.log('[WebSocketContext] Disconnected');
            setIsConnected(false);
        };

        const handleUserStatusChange = (data: SocketEvents['user_status_change']) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                if (data.status === 'online') {
                    newSet.add(data.userId);
                } else {
                    newSet.delete(data.userId);
                }
                return newSet;
            });
        };

        const handleUserTyping = (data: SocketEvents['user_typing']) => {
            setTypingUsers(prev => {
                const newMap = new Map(prev);
                const convTypers = newMap.get(data.conversationId) || new Set();
                convTypers.add(data.userId);
                newMap.set(data.conversationId, convTypers);
                return newMap;
            });
        };

        const handleUserStoppedTyping = (data: SocketEvents['user_stopped_typing']) => {
            setTypingUsers(prev => {
                const newMap = new Map(prev);
                const convTypers = newMap.get(data.conversationId);
                if (convTypers) {
                    convTypers.delete(data.userId);
                    if (convTypers.size === 0) {
                        newMap.delete(data.conversationId);
                    } else {
                        newMap.set(data.conversationId, convTypers);
                    }
                }
                return newMap;
            });
        };

        socketService.on('connect' as any, handleConnect);
        socketService.on('disconnect' as any, handleDisconnect);
        socketService.on('user_status_change', handleUserStatusChange);
        socketService.on('user_typing', handleUserTyping);
        socketService.on('user_stopped_typing', handleUserStoppedTyping);

        return () => {
            socketService.off('connect' as any, handleConnect);
            socketService.off('disconnect' as any, handleDisconnect);
            socketService.off('user_status_change', handleUserStatusChange);
            socketService.off('user_typing', handleUserTyping);
            socketService.off('user_stopped_typing', handleUserStoppedTyping);
        };
    }, []);

    const isUserOnline = useCallback((userId: string): boolean => {
        return onlineUsers.has(userId);
    }, [onlineUsers]);

    const sendTypingIndicator = useCallback((conversationId: string, isTyping: boolean) => {
        if (isTyping) {
            socketService.sendTypingStart(conversationId);
        } else {
            socketService.sendTypingStop(conversationId);
        }
    }, []);

    const value: WebSocketContextType = {
        isConnected,
        onlineUsers,
        isUserOnline,
        sendTypingIndicator,
        typingUsers,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

export default WebSocketContext;
