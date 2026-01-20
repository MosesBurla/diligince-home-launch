import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    X,
    Send,
    Paperclip,
    User,
    Phone,
    Video,
    Mail,
    Star,
    Calendar,
    Check,
    CheckCheck,
    Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { conversationsService } from '@/services/modules/conversations';
import type { Conversation, Message } from '@/services/modules/conversations';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';

interface QuotationChatPanelProps {
    quotationId: string;
    quotationNumber: string;
    vendorName: string;
    vendorEmail?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const QuotationChatPanel: React.FC<QuotationChatPanelProps> = ({
    quotationId,
    quotationNumber,
    vendorName,
    vendorEmail,
    isOpen,
    onClose,
}) => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [messageText, setMessageText] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get or create conversation for this quotation
    const { data: conversation, isLoading: isLoadingConversation } = useQuery({
        queryKey: ['quotation-conversation', quotationId],
        queryFn: () => conversationsService.getQuotationConversation(quotationId),
        enabled: isOpen && !!quotationId,
    });

    // Get messages for the conversation
    const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
        queryKey: ['conversation-messages', conversation?._id],
        queryFn: () => conversationsService.getMessages(conversation!._id),
        enabled: !!conversation?._id,
        refetchInterval: 5000, // Poll every 5 seconds for new messages
    });

    const messages = messagesData?.messages || [];

    // Send message mutation
    const sendMessageMutation = useMutation({
        mutationFn: (content: string) =>
            conversationsService.sendMessage({
                conversationId: conversation!._id,
                content,
                type: 'text',
            }),
        onSuccess: () => {
            setMessageText('');
            queryClient.invalidateQueries({ queryKey: ['conversation-messages', conversation?._id] });
        },
        onError: () => {
            toast.error('Failed to send message');
        },
    });

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Mark messages as read
    useEffect(() => {
        if (conversation?._id && messages.length > 0) {
            conversationsService.markAsRead(conversation._id).catch(console.error);
        }
    }, [conversation?._id, messages.length]);

    const handleSendMessage = () => {
        if (messageText.trim() && conversation?._id) {
            sendMessageMutation.mutate(messageText.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Action handlers
    const handleAudioCall = () => {
        toast.info('Audio call feature coming soon!', {
            description: `Calling ${vendorName}...`,
        });
    };

    const handleVideoCall = () => {
        toast.info('Video call feature coming soon!', {
            description: `Starting video call with ${vendorName}...`,
        });
    };

    const handleEmail = () => {
        if (vendorEmail) {
            window.open(`mailto:${vendorEmail}?subject=Regarding Quotation ${quotationNumber}`, '_blank');
        } else {
            toast.info('Email address not available');
        }
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    };

    const handleSchedule = () => {
        toast.info('Schedule meeting feature coming soon!');
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        }
    };

    // Render read receipt indicator
    const renderReadReceipt = (message: Message, isOwn: boolean) => {
        if (!isOwn) return null;

        const isRead = message.status === 'read' || (message.readBy && message.readBy.length > 0);
        const isDelivered = message.status === 'delivered';
        const isSent = message.status === 'sent';

        if (isRead) {
            return <Eye className="h-3.5 w-3.5 text-[hsl(var(--messages-primary))] ml-1 inline-block" />;
        } else if (isDelivered) {
            return <CheckCheck className="h-3.5 w-3.5 text-gray-400 ml-1 inline-block" />;
        } else if (isSent) {
            return <Check className="h-3.5 w-3.5 text-gray-400 ml-1 inline-block" />;
        }
        return null;
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups: Record<string, Message[]>, message) => {
        const date = formatDate(message.createdAt);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200" style={{ paddingBottom: '80px' }}>
            {/* Header */}
            <div className="border-b bg-gradient-to-r from-[hsl(var(--messages-primary-light))] to-white">
                {/* Vendor Info Row */}
                <div className="flex items-center justify-between p-3 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[hsl(var(--messages-primary))] flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                            {vendorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{vendorName}</h3>
                            <p className="text-xs text-gray-500">Vendor Inquiry</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center justify-center gap-1 px-3 pb-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg bg-[hsl(var(--messages-primary))] hover:bg-[hsl(var(--messages-primary-hover))] text-white"
                        onClick={handleAudioCall}
                        title="Audio Call"
                    >
                        <Phone className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg bg-[hsl(var(--messages-primary))] hover:bg-[hsl(var(--messages-primary-hover))] text-white"
                        onClick={handleVideoCall}
                        title="Video Call"
                    >
                        <Video className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg bg-[hsl(var(--messages-primary))] hover:bg-[hsl(var(--messages-primary-hover))] text-white"
                        onClick={handleEmail}
                        title="Send Email"
                    >
                        <Mail className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className={`h-8 w-8 rounded-lg border border-[hsl(var(--messages-border))] ${isFavorite ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-0' : 'bg-white text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--messages-hover))]'}`}
                        onClick={handleFavorite}
                        title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    >
                        <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg border border-[hsl(var(--messages-border))] bg-white text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--messages-hover))]"
                        onClick={handleSchedule}
                        title="Schedule Meeting"
                    >
                        <Calendar className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Quotation Reference */}
            <div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-500">
                Quotation: <span className="font-medium text-gray-700">{quotationNumber}</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {isLoadingConversation || isLoadingMessages ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                                <Skeleton className={`h-16 ${i % 2 === 0 ? 'w-48' : 'w-64'} rounded-lg`} />
                            </div>
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                        <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm font-medium">No messages yet</p>
                        <p className="text-gray-400 text-xs mt-1">Start the conversation with {vendorName}</p>
                    </div>
                ) : (
                    Object.entries(groupedMessages).map(([date, dateMessages]) => (
                        <div key={date}>
                            {/* Date separator */}
                            <div className="flex items-center justify-center my-4">
                                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">
                                    {date}
                                </span>
                            </div>
                            {/* Messages for this date */}
                            {dateMessages.map((message) => {
                                const isOwn = message.senderId._id === user?.id || message.senderId.email === user?.email;
                                return (
                                    <div
                                        key={message._id}
                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
                                    >
                                        <div
                                            className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${isOwn
                                                ? 'bg-[hsl(var(--messages-sent-bubble))] text-white rounded-br-md'
                                                : 'bg-[hsl(var(--messages-received-bubble))] text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                            <div className={`flex items-center justify-end gap-0.5 mt-1 ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                                                <span className="text-[11px]">
                                                    {formatTime(message.createdAt)}
                                                    {message.isEdited && ' (edited)'}
                                                </span>
                                                {renderReadReceipt(message, isOwn)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-3 border-t bg-white">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-gray-600 h-9 w-9">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 relative">
                        <textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            rows={1}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--messages-primary))] focus:border-transparent resize-none text-sm"
                            style={{ minHeight: '42px', maxHeight: '100px' }}
                        />
                    </div>
                    <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || sendMessageMutation.isPending}
                        className="shrink-0 rounded-full h-10 w-10 p-0 bg-[hsl(var(--messages-primary))] hover:bg-[hsl(var(--messages-primary-hover))]"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QuotationChatPanel;
