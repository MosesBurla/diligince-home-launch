import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreHorizontal,
  Star,
  Archive,
  MessageSquare,
  Mail,
  Loader2,
  Check,
  CheckCheck,
  Eye,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { conversationsService } from "@/services/modules/conversations/conversations.service";
import type { Conversation, Message } from "@/services/modules/conversations/conversations.types";
import { useUser } from "@/contexts/UserContext";

const ServiceVendorMessages = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Nested structure state
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedRelatedId, setSelectedRelatedId] = useState<string | null>(null); // null = General Chat

  // Fetch conversations
  const { data: conversationsData, isLoading: conversationsLoading } = useQuery({
    queryKey: ['vendor-conversations'],
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
      queryClient.invalidateQueries({ queryKey: ['vendor-conversations'] });
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
      queryClient.invalidateQueries({ queryKey: ['vendor-conversations'] });
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

  const conversations = conversationsData?.conversations || [];
  const messages = messagesData?.messages || [];

  // NESTED GROUPING: Group by Company → Then by Requirement
  interface RequirementGroup {
    relatedType: string;
    relatedId: string;
    relatedTitle: string;
    unreadCount: number;
    latestConversation: Conversation;
    allConversations: Conversation[];
  }

  interface CompanyConversations {
    companyId: string;
    companyName: string;
    companyEmail: string;
    totalUnread: number;
    isExpanded: boolean;
    generalChat: Conversation[];
    requirements: RequirementGroup[];
  }

  const groupedByCompany = useMemo(() => {
    const companies: Record<string, CompanyConversations> = {};

    conversations.forEach((conv) => {
      const otherParticipant = conv.participants.find(p => p.userId._id !== user?.id);
      const companyKey = otherParticipant?.userId.email || conv._id;

      // Initialize company if not exists
      if (!companies[companyKey]) {
        companies[companyKey] = {
          companyId: companyKey,
          companyName: otherParticipant?.userId.email || 'Unknown Company',
          companyEmail: otherParticipant?.userId.email || '',
          totalUnread: 0,
          isExpanded: expandedCompanies.has(companyKey),
          generalChat: [],
          requirements: []
        };
      }

      // Categorize: General Chat vs Requirement-specific
      if (conv.relatedId && conv.relatedType) {
        // Requirement-specific conversation
        let reqGroup = companies[companyKey].requirements.find(
          r => r.relatedId === conv.relatedId
        );

        if (!reqGroup) {
          reqGroup = {
            relatedType: conv.relatedType,
            relatedId: conv.relatedId,
            relatedTitle: conv.title || `${conv.relatedType}-${conv.relatedId.substring(0, 6)}`,
            unreadCount: 0,
            latestConversation: conv,
            allConversations: []
          };
          companies[companyKey].requirements.push(reqGroup);
        }

        reqGroup.allConversations.push(conv);
        reqGroup.unreadCount += conv.unreadCount || 0;

        // Keep latest conversation
        if (new Date(conv.updatedAt) > new Date(reqGroup.latestConversation.updatedAt)) {
          reqGroup.latestConversation = conv;
        }
      } else {
        // General chat (no relatedId)
        companies[companyKey].generalChat.push(conv);
      }

      companies[companyKey].totalUnread += conv.unreadCount || 0;
    });

    return Object.values(companies);
  }, [conversations, user?.id, expandedCompanies]);

  // Filter companies based on search and filter
  const filteredCompanies = groupedByCompany.filter((company) => {
    const matchesSearch =
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.generalChat.some(c => c.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      company.requirements.some(r =>
        r.relatedTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.latestConversation.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter =
      filterType === "all" ||
      (filterType === "unread" && company.totalUnread > 0) ||
      company.requirements.some(r => r.relatedType === filterType);

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

  // Nested structure handlers
  const toggleCompany = (companyId: string) => {
    setExpandedCompanies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
        // If collapsing selected company, clear selection
        if (selectedCompanyId === companyId) {
          setSelectedCompanyId(null);
          setSelectedRelatedId(null);
          setSelectedConversationId(null);
        }
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  };

  const selectRequirementOrGeneral = (companyId: string, relatedId: string | null) => {
    setSelectedCompanyId(companyId);
    setSelectedRelatedId(relatedId);

    // Find the company
    const company = groupedByCompany.find(c => c.companyId === companyId);
    if (!company) return;

    let conversationsToShow: Conversation[];

    if (relatedId) {
      // Requirement-specific chat
      const reqGroup = company.requirements.find(r => r.relatedId === relatedId);
      conversationsToShow = reqGroup?.allConversations || [];
    } else {
      // General chat
      conversationsToShow = company.generalChat;
    }

    // Select first conversation for display
    if (conversationsToShow.length > 0) {
      setSelectedConversationId(conversationsToShow[0]._id);
    } else {
      setSelectedConversationId(null);
    }
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

  const selectedConv = conversations.find((c) => c._id === selectedConversationId);
  const unreadCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--messages-received-bubble))]">
      <div className="flex-1 flex h-[calc(100vh-64px)]">
        {/* Conversations Sidebar */}
        <div className="w-[360px] bg-[hsl(var(--messages-sidebar-bg))] border-r border-[hsl(var(--messages-border))] flex flex-col">
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
                  <SelectItem value="requirement">Requirements</SelectItem>
                  <SelectItem value="quote">Quotations</SelectItem>
                  <SelectItem value="rfq">RFQs</SelectItem>
                  <SelectItem value="purchaseOrder">Purchase Orders</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conversations List - Nested Structure */}
          <div className="flex-1 overflow-y-auto">
            {conversationsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--messages-primary))]" />
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-[hsl(var(--muted-foreground))]">
                <MessageSquare className="h-8 w-8 mb-2" />
                <p>No conversations found</p>
              </div>
            ) : (
              filteredCompanies.map((company) => (
                <div key={company.companyId}>
                  {/* Company Header - Collapsible */}
                  <div
                    onClick={() => toggleCompany(company.companyId)}
                    className={`p-4 border-b border-[hsl(var(--messages-border))] cursor-pointer hover:bg-[hsl(var(--messages-hover))] transition-colors ${selectedCompanyId === company.companyId
                        ? "bg-[hsl(var(--messages-selected)/0.3)]"
                        : ""
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Expand/Collapse Icon */}
                      {company.isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                      )}

                      {/* Company Avatar */}
                      <Avatar className="h-10 w-10 bg-[hsl(var(--messages-primary)/0.1)]">
                        <AvatarFallback className="text-[hsl(var(--messages-primary))] text-sm font-semibold">
                          {getInitials(company.companyName)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Company Name and Unread */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                            {company.companyName}
                          </h3>
                          {company.totalUnread > 0 && (
                            <Badge className="bg-[hsl(var(--messages-primary))] hover:bg-[hsl(var(--messages-primary-hover))] text-white text-xs px-2 ml-2">
                              {company.totalUnread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content: General Chat + Requirements */}
                  {company.isExpanded && (
                    <div className="bg-[hsl(var(--messages-received-bubble))]">
                      {/* General Chat */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          selectRequirementOrGeneral(company.companyId, null);
                        }}
                        className={`pl-14 pr-4 py-3 border-b border-[hsl(var(--messages-border))] cursor-pointer hover:bg-[hsl(var(--messages-hover))] transition-colors ${selectedCompanyId === company.companyId && selectedRelatedId === null
                            ? "bg-[hsl(var(--messages-selected))] border-l-4 border-l-[hsl(var(--messages-primary))]"
                            : ""
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                          <span className="text-sm text-[hsl(var(--foreground))]">General Chat</span>
                          {company.generalChat.reduce((sum, c) => sum + (c.unreadCount || 0), 0) > 0 && (
                            <Badge className="bg-[hsl(var(--messages-primary))] text-white text-xs px-1.5">
                              {company.generalChat.reduce((sum, c) => sum + (c.unreadCount || 0), 0)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Requirement-specific Chats */}
                      {company.requirements.map((req) => (
                        <div
                          key={req.relatedId}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectRequirementOrGeneral(company.companyId, req.relatedId);
                          }}
                          className={`pl-14 pr-4 py-3 border-b border-[hsl(var(--messages-border))] cursor-pointer hover:bg-[hsl(var(--messages-hover))] transition-colors ${selectedCompanyId === company.companyId && selectedRelatedId === req.relatedId
                              ? "bg-[hsl(var(--messages-selected))] border-l-4 border-l-[hsl(var(--messages-primary))]"
                              : ""
                            }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs bg-[hsl(var(--messages-primary)/0.1)] text-[hsl(var(--messages-primary))] border-[hsl(var(--messages-primary)/0.2)]"
                              >
                                {req.relatedType}
                              </Badge>
                              <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                                {req.relatedTitle}
                              </span>
                            </div>
                            {req.unreadCount > 0 && (
                              <Badge className="bg-[hsl(var(--messages-primary))] text-white text-xs px-1.5">
                                {req.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                            {req.latestConversation.lastMessage?.content || "No messages yet"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
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
              <div className="p-4 border-b border-[hsl(var(--messages-border))]">
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
                      {selectedConv.relatedType && (
                        <Badge variant="outline" className="text-xs bg-[hsl(var(--messages-primary)/0.1)] text-[hsl(var(--messages-primary))] border-[hsl(var(--messages-primary)/0.2)]">
                          {selectedConv.relatedType}
                        </Badge>
                      )}
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
                      onClick={() => toast.success("Opening email...")}
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
                    className="bg-[hsl(var(--messages-primary))] hover:bg-[hsl(var(--messages-primary-hover))] text-white h-10 w-10 p-0"
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
    </div>
  );
};

export default ServiceVendorMessages;
