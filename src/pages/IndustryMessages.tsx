import React, { useState, useEffect, useRef, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, MessageSquare, Send, Plus, Phone, Video, Archive, Star, MoreHorizontal, Paperclip, Mail, Loader2, Check, CheckCheck, Eye } from "lucide-react";
import { toast } from "sonner";
import { conversationsService } from "@/services/modules/conversations/conversations.service";
import type { Conversation, Message } from "@/services/modules/conversations/conversations.types";
import { useUser } from "@/contexts/UserContext";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { socketService } from "@/services/core/socket.service";

const IndustryMessages = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { isConnected, isUserOnline, typingUsers, sendTypingIndicator } = useWebSocket();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { data: conversationsData, isLoading: conversationsLoading } = useQuery({
    queryKey: ['industry-conversations'],
    queryFn: () => conversationsService.getConversations(),
  });

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['conversation-messages', selectedConversationId],
    queryFn: () => conversationsService.getMessages(selectedConversationId!),
    enabled: !!selectedConversationId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      conversationsService.sendMessage({
        conversationId: selectedConversationId!,
        content,
        type: 'text',
      }),
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ['conversation-messages', selectedConversationId] });
      queryClient.invalidateQueries({ queryKey: ['industry-conversations'] });
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (conversationId: string) =>
      conversationsService.markAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industry-conversations'] });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData?.messages]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      markAsReadMutation.mutate(selectedConversationId);
    }
  }, [selectedConversationId]);

  // Real-time message updates via WebSocket
  useEffect(() => {
    const handleNewMessage = (data: { message: any; conversation: { _id: string } }) => {
      console.log('[Socket] New message received:', data);

      // If message is for the currently selected conversation, add it immediately
      if (data.conversation._id === selectedConversationId) {
        queryClient.setQueryData(
          ['conversation-messages', selectedConversationId],
          (oldData: any) => {
            if (!oldData) return { messages: [data.message] };
            // Avoid duplicates
            const exists = oldData.messages?.some((m: any) => m._id === data.message._id);
            if (exists) return oldData;
            return {
              ...oldData,
              messages: [...(oldData.messages || []), data.message]
            };
          }
        );
      }

      // Always refresh conversation list to update lastMessage and badges
      queryClient.invalidateQueries({ queryKey: ['industry-conversations'] });
    };

    socketService.on('new_message', handleNewMessage);

    return () => {
      socketService.off('new_message', handleNewMessage);
    };
  }, [selectedConversationId, queryClient]);

  const conversations = conversationsData?.conversations || [];
  const messages = messagesData?.messages || [];

  // CONSOLIDATION: Group conversations by participant email (company-oriented view)
  // This ensures the same vendor appears only once, showing the most recent conversation
  const consolidatedConversations = useMemo(() => {
    const groupedByParticipant: Record<string, Conversation> = {};

    conversations.forEach((conv) => {
      const otherParticipant = conv.participants.find(p => p.userId._id !== user?.id);
      const participantKey = otherParticipant?.userId.email || conv._id;

      // Keep the most recent conversation (by lastMessage timestamp or updatedAt)
      const existingConv = groupedByParticipant[participantKey];
      const convTime = conv.lastMessage?.timestamp || conv.updatedAt;
      const existingTime = existingConv?.lastMessage?.timestamp || existingConv?.updatedAt;

      if (!existingConv || new Date(convTime) > new Date(existingTime)) {
        // Merge unread counts from all conversations with same participant
        const totalUnread = existingConv
          ? (existingConv.unreadCount || 0) + (conv.unreadCount || 0)
          : (conv.unreadCount || 0);

        groupedByParticipant[participantKey] = {
          ...conv,
          unreadCount: totalUnread
        };
      } else if (existingConv) {
        // Add unread count from this conversation to the existing one
        groupedByParticipant[participantKey] = {
          ...existingConv,
          unreadCount: (existingConv.unreadCount || 0) + (conv.unreadCount || 0)
        };
      }
    });

    return Object.values(groupedByParticipant);
  }, [conversations, user?.id]);

  // Filter consolidated conversations
  const filteredConversations = consolidatedConversations.filter((conv) => {
    const otherParticipant = conv.participants.find(p => p.userId._id !== user?.id);
    const participantEmail = otherParticipant?.userId.email || '';

    const matchesSearch =
      conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participantEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "unread" && (conv.unreadCount || 0) > 0) ||
      conv.relatedType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversationId) {
      sendMessageMutation.mutate(messageText.trim());
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversationId(conversation._id);
  };

  const getInitials = (email: string) => {
    return email?.slice(0, 2).toUpperCase() || "??";
  };

  const getParticipantName = (conversation: Conversation) => {
    const otherParticipant = conversation.participants.find(
      p => p.userId._id !== user?.id
    );
    return otherParticipant?.userId.email || conversation.title || "Unknown";
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
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

  const handleSendEmail = () => {
    if (emailSubject.trim() && emailContent.trim() && selectedConv) {
      toast.success(`Email sent to ${getParticipantName(selectedConv)}`);
      setEmailSubject("");
      setEmailContent("");
      setShowEmailModal(false);
    }
  };

  const selectedConv = conversations.find((c) => c._id === selectedConversationId);
  const unreadCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--messages-received-bubble))]">
      <Helmet>
        <title>Messages | Industry Dashboard</title>
      </Helmet>

      <div className="flex-1 flex h-[calc(100vh-64px)]">
        {/* Conversations Sidebar */}
        <div className="w-[360px] bg-[hsl(var(--messages-sidebar-bg))] border-r border-[hsl(var(--messages-border))] flex flex-col shadow-sm">
          {/* Header */}
          <div className="p-5 border-b border-[hsl(var(--messages-border))]">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-lg font-semibold text-[hsl(var(--foreground))]">Messages</h1>
              {unreadCount > 0 && (
                <Badge className="bg-[hsl(var(--messages-primary)/0.1)] text-[hsl(var(--messages-primary))] border border-[hsl(var(--messages-primary)/0.2)] font-medium">
                  {unreadCount} unread
                </Badge>
              )}
            </div>

            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[hsl(var(--messages-border))] bg-[hsl(var(--messages-received-bubble))] focus:border-[hsl(var(--messages-primary))]"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="border-[hsl(var(--messages-border))] bg-[hsl(var(--messages-sidebar-bg))]">
                  <SelectValue placeholder="Filter messages" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--messages-border))]">
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="vendor-company">Vendors</SelectItem>
                  <SelectItem value="quote">Quotations</SelectItem>
                  <SelectItem value="rfq">Requirements</SelectItem>
                  <SelectItem value="purchaseOrder">Purchase Orders</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversationsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--messages-primary))]" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-[hsl(var(--muted-foreground))]">
                <MessageSquare className="h-8 w-8 mb-2" />
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`p-4 border-b border-[hsl(var(--messages-border))] cursor-pointer hover:bg-[hsl(var(--messages-hover))] transition-colors ${selectedConversationId === conversation._id
                    ? "bg-[hsl(var(--messages-selected))] border-l-4 border-l-[hsl(var(--messages-primary))]"
                    : ""
                    } ${(conversation.unreadCount || 0) > 0 ? "bg-[hsl(var(--messages-unread))]" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 bg-[hsl(var(--messages-primary)/0.1)]">
                      <AvatarFallback className="text-[hsl(var(--messages-primary))] text-sm font-semibold">
                        {getInitials(getParticipantName(conversation))}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium text-[hsl(var(--foreground))] truncate ${(conversation.unreadCount || 0) > 0 ? "font-semibold" : ""
                          }`}>
                          {getParticipantName(conversation)}
                        </h3>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                          {conversation.lastMessage?.timestamp
                            ? formatTimestamp(conversation.lastMessage.timestamp)
                            : formatTimestamp(conversation.updatedAt)}
                        </span>
                      </div>

                      {/* Online/Offline Status */}
                      {(() => {
                        const otherParticipant = conversation.participants.find(p => p.userId._id !== user?.id);
                        const participantId = otherParticipant?.userId._id;
                        const online = participantId ? isUserOnline(participantId) : false;
                        return (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`h-2 w-2 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className="text-xs text-[hsl(var(--muted-foreground))]">
                              {online ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        );
                      })()}

                      <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        {(conversation.unreadCount || 0) > 0 && (
                          <Badge className="bg-[hsl(var(--messages-primary))] text-white text-xs">
                            {conversation.unreadCount} new
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[hsl(var(--messages-sidebar-bg))]">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[hsl(var(--messages-border))] bg-[hsl(var(--messages-sidebar-bg))]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-[hsl(var(--messages-primary)/0.1)]">
                      <AvatarFallback className="text-[hsl(var(--messages-primary))] text-sm font-semibold">
                        {getInitials(getParticipantName(selectedConv))}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                        {getParticipantName(selectedConv)}
                      </h2>
                      {/* Online/Offline status in header */}
                      {(() => {
                        const otherParticipant = selectedConv.participants.find(p => p.userId._id !== user?.id);
                        const participantId = otherParticipant?.userId._id;
                        const online = participantId ? isUserOnline(participantId) : false;
                        const isTyping = participantId && typingUsers.get(selectedConv._id)?.has(participantId);
                        return (
                          <div className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                            <span className="text-xs text-[hsl(var(--muted-foreground))]">
                              {isTyping ? 'Typing...' : (online ? 'Online' : 'Offline')}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success("Calling...")}
                      className="bg-[hsl(var(--messages-primary))] hover:bg-[hsl(var(--messages-primary-hover))] text-white border-0 h-8 w-8 p-0"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success("Starting video call...")}
                      className="bg-[hsl(var(--messages-primary))] hover:bg-[hsl(var(--messages-primary-hover))] text-white border-0 h-8 w-8 p-0"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEmailModal(true)}
                      className="bg-[hsl(var(--messages-primary))] hover:bg-[hsl(var(--messages-primary-hover))] text-white border-0 h-8 w-8 p-0"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success("Starred!")}
                      className="border-[hsl(var(--messages-border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--messages-hover))] h-8 w-8 p-0"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success("Archived!")}
                      className="border-[hsl(var(--messages-border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--messages-hover))] h-8 w-8 p-0"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[hsl(var(--messages-received-bubble))]">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--messages-primary))]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[hsl(var(--muted-foreground))]">
                    <MessageSquare className="h-12 w-12 mb-4" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.senderId._id === user?.id ? "justify-end" : "justify-start"
                        }`}
                    >
                      {message.senderId._id !== user?.id && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback className="bg-[hsl(var(--messages-primary)/0.1)] text-[hsl(var(--messages-primary))] text-xs">
                            {getInitials(message.senderId.email)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${message.senderId._id === user?.id
                          ? "bg-[hsl(var(--messages-sent-bubble))] text-white rounded-br-md"
                          : "bg-[hsl(var(--messages-sidebar-bg))] text-[hsl(var(--foreground))] border border-[hsl(var(--messages-border))] rounded-bl-md"
                          }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <p
                            className={`text-xs ${message.senderId._id === user?.id
                              ? "text-white/70"
                              : "text-[hsl(var(--muted-foreground))]"
                              }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {renderReadReceipt(message)}
                        </div>
                      </div>

                      {message.senderId._id === user?.id && (
                        <Avatar className="h-8 w-8 ml-2">
                          <AvatarFallback className="bg-[hsl(var(--messages-primary))] text-white text-xs">
                            {getInitials(user?.email || "")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-[hsl(var(--messages-border))] bg-[hsl(var(--messages-sidebar-bg))]">
                <div className="flex items-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[hsl(var(--messages-border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--messages-hover))] h-10 w-10 p-0"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 min-h-[40px] max-h-32 resize-none border-[hsl(var(--messages-border))] bg-[hsl(var(--messages-received-bubble))] focus:border-[hsl(var(--messages-primary))]"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                    className="bg-[hsl(var(--messages-primary))] hover:bg-[hsl(var(--messages-primary-hover))] text-white font-medium h-10 w-10 p-0"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[hsl(var(--messages-received-bubble))]">
              <div className="text-center">
                <div className="h-16 w-16 bg-[hsl(var(--messages-primary)/0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-[hsl(var(--messages-primary))]" />
                </div>
                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
                  Select a conversation
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-[600px] bg-[hsl(var(--card))] border-[hsl(var(--messages-border))]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
              Send Email to {selectedConv ? getParticipantName(selectedConv) : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[hsl(var(--foreground))]">Subject</label>
              <Input
                placeholder="Email subject..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="mt-1 border-[hsl(var(--messages-border))]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[hsl(var(--foreground))]">Message</label>
              <Textarea
                placeholder="Type your email message..."
                rows={8}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="mt-1 border-[hsl(var(--messages-border))]"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEmailModal(false)}
                className="border-[hsl(var(--messages-border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--messages-hover))]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendEmail}
                className="bg-[hsl(var(--messages-primary))] hover:bg-[hsl(var(--messages-primary-hover))] text-white font-medium"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IndustryMessages;