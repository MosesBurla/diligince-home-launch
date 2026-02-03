import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    X,
    Send,
    Paperclip,
    Loader2,
    MessageSquare,
    Check,
    CheckCheck,
    Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { conversationsService } from '@/services/modules/conversations/conversations.service';
import type { Message } from '@/services/modules/conversations/conversations.types';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

interface InlineChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
    relatedType: 'quote' | 'purchaseOrder' | 'requirement' | 'rfq';
    relatedId: string;
    relatedTitle: string; // e.g., "PO-2026-00001"
    companyId: string;
    companyName: string;
}

export const InlineChatPanel: React.FC<InlineChatPanelProps> = ({
    isOpen,
    onClose,
    relatedType,
    relatedId,
    relatedTitle,
    companyId,
    companyName
}) => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [messageText, setMessageText] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationId]);

    // Fetch or create conversation when panel opens
    useEffect(() => {
        if (isOpen && relatedId && companyId) {
            // Try to find existing conversation
            conversationsService.getConversations().then((data) => {
                const existingConv = data.conversations.find(
                    (c: any) => c.relatedId === relatedId && c.relatedType === relatedType
                );

                if (existingConv) {
                    setConversationId(existingConv._id);
                } else {
                    // For now, we'll need to create conversation via sending first message
                    // Or use a backend endpoint to create conversation
                    setConversationId(null);
                }
            }).catch(err => {
                console.error('Failed to fetch conversations:', err);
            });
        }
    }, [isOpen, relatedId, relatedType, companyId]);

    // Fetch messages for selected conversation
    const { data: messagesData, isLoading: messagesLoading } = useQuery({
        queryKey: ['conversation-messages', conversationId],
        queryFn: () => conversationsService.getMessages(conversationId!),
        enabled: !!conversationId && isOpen,
        refetchInterval: isOpen ? 3000 : false, // Poll every 3 seconds when open
    });

    // Send message mutation
    const sendMessageMutation = useMutation({
        mutationFn: (content: string) => {
            if (!conversationId) {
                // If no conversation exists, we need to create one first
                // This would require a backend endpoint
                throw new Error('No conversation ID available');
            }
            return conversationsService.sendMessage({
                conversationId: conversationId!,
                content,
                type: 'text',
            });
        },
        onSuccess: () => {
            setMessageText('');
            queryClient.invalidateQueries({ queryKey: ['conversation-messages', conversationId] });
            queryClient.invalidateQueries({ queryKey: ['vendor-conversations'] });
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        },
        onError: () => {
            toast.error('Failed to send message');
        },
    });

    const handleSendMessage = () => {
        if (messageText.trim() && conversationId) {
            sendMessageMutation.mutate(messageText.trim());
        } else if (messageText.trim() && !conversationId) {
            toast.error('Please wait while we set up the conversation');
        }
    };

    const getInitials = (name: string) => {
        return name?.slice(0, 2).toUpperCase() || '??';
    };

    const renderReadReceipt = (message: Message) => {
        if (message.senderId._id !== user?.id) return null;

        if (message.readBy && message.readBy.length > 0) {
            return <Eye className="h-3 w-3 text-blue-500" />;
        }
        if (message.deliveredTo && message.deliveredTo.length > 0) {
            return <CheckCheck className="h-3 w-3 text-blue-500" />;
        }
        if (message.status === 'sent') {
            return <Check className="h-3 w-3 text-gray-400" />;
        }
        return null;
    };

    const messages = messagesData?.messages || [];

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Chat Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-lg text-gray-900">{relatedTitle}</h3>
                            </div>
                            <Badge
                                variant="outline"
                                className="bg-blue-100 text-blue-700 border-blue-200"
                            >
                                {relatedType}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-2">
                                Chat with {companyName}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="hover:bg-white/50"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {messagesLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <MessageSquare className="h-16 w-16 mb-4 text-gray-300" />
                            <p className="text-center">
                                No messages yet.<br />
                                Start the conversation!
                            </p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message._id}
                                className={`flex ${message.senderId._id === user?.id ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                {message.senderId._id !== user?.id && (
                                    <Avatar className="h-8 w-8 mr-2">
                                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                            {getInitials(companyName)}
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div
                                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${message.senderId._id === user?.id
                                            ? 'bg-blue-600 text-white rounded-br-md'
                                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <p
                                            className={`text-xs ${message.senderId._id === user?.id
                                                    ? 'text-blue-100'
                                                    : 'text-gray-500'
                                                }`}
                                        >
                                            {new Date(message.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                        {renderReadReceipt(message)}
                                    </div>
                                </div>

                                {message.senderId._id === user?.id && (
                                    <Avatar className="h-8 w-8 ml-2">
                                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                                            {getInitials(user?.email || '')}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-white">
                    <div className="flex items-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 flex-shrink-0"
                            disabled
                        >
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <Textarea
                            placeholder="Type your message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            className="flex-1 min-h-[40px] max-h-32 resize-none"
                            rows={2}
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!messageText.trim() || sendMessageMutation.isPending || !conversationId}
                            className="h-10 w-10 p-0 flex-shrink-0 bg-blue-600 hover:bg-blue-700"
                        >
                            {sendMessageMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    {!conversationId && (
                        <p className="text-xs text-amber-600 mt-2">
                            Send your first message to start the conversation
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};
