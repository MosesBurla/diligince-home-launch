import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Phone,
  Video,
  Archive,
  Star,
  MoreHorizontal,
  Send,
  Paperclip,
  Mail,
  Home,
  MessageSquare,
  User,
  Briefcase,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProfessionalHeader from "@/components/professional/ProfessionalHeader";
import { toast } from "sonner";

// ---- Types ----
type Conversation = {
  id: number;
  contact: string;
  initials: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  type: string;
  priority: "high" | "medium" | "low";
  avatar: string;
};

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isFromContact: boolean;
};

// ---- Mock Data ----
const mockConversations: Conversation[] = [
  {
    id: 1,
    contact: "Steel Plant Ltd.",
    initials: "SP",
    lastMessage:
      "The control system upgrade project timeline looks good. When can we schedule the site visit?",
    timestamp: "2 hours ago",
    unread: true,
    type: "project-update",
    priority: "high",
    avatar: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    contact: "AutoParts Manufacturing",
    initials: "AM",
    lastMessage:
      "Thank you for your application. We'd like to schedule an interview for next week.",
    timestamp: "1 day ago",
    unread: true,
    type: "job-response",
    priority: "high",
    avatar: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    contact: "Power Grid Corp",
    initials: "PG",
    lastMessage:
      "The SCADA implementation proposal has been approved. Let's discuss the next steps.",
    timestamp: "2 days ago",
    unread: false,
    type: "project-update",
    priority: "medium",
    avatar: "bg-purple-100 text-purple-600",
  },
  {
    id: 4,
    contact: "Textile Mills Inc",
    initials: "TM",
    lastMessage:
      "We've received your automation consulting proposal. The budget looks reasonable.",
    timestamp: "3 days ago",
    unread: false,
    type: "job-inquiry",
    priority: "medium",
    avatar: "bg-orange-100 text-orange-600",
  },
  {
    id: 5,
    contact: "Diligince.ai",
    initials: "DL",
    lastMessage:
      "Your profile has been updated successfully. You have 5 new job matches.",
    timestamp: "1 week ago",
    unread: false,
    type: "system-notification",
    priority: "low",
    avatar: "bg-indigo-100 text-indigo-600",
  },
];

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "Steel Plant Ltd.",
    content:
      "Hi Rahul, we've reviewed your proposal for the control system upgrade project. The technical approach looks solid.",
    timestamp: "10:30 AM",
    isFromContact: true,
  },
  {
    id: 2,
    sender: "You",
    content:
      "Thank you for the feedback! I'm glad the technical approach meets your requirements. I have extensive experience with similar PLC upgrades.",
    timestamp: "10:45 AM",
    isFromContact: false,
  },
  {
    id: 3,
    sender: "Steel Plant Ltd.",
    content:
      "That's great to hear. We'd like to discuss the project timeline and schedule a site visit. Are you available next week?",
    timestamp: "11:00 AM",
    isFromContact: true,
  },
  {
    id: 4,
    sender: "Steel Plant Ltd.",
    content:
      "The control system upgrade project timeline looks good. When can we schedule the site visit?",
    timestamp: "2:30 PM",
    isFromContact: true,
  },
];

// ---- Component ----
const ProfessionalMessages = () => {
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(mockConversations[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const headerNavItems = [
    {
      label: "Dashboard",
      icon: <Home size={18} />,
      href: "/dashboard/professional",
    },
    {
      label: "Opportunities",
      icon: <Briefcase size={18} />,
      href: "/dashboard/professional-opportunities",
    },
    {
      label: "Calendar",
      icon: <Calendar size={18} />,
      href: "/dashboard/professional-calendar",
    },
    {
      label: "Messages",
      icon: <MessageSquare size={18} />,
      href: "/dashboard/professional-messages",
      active: true,
    },
    {
      label: "Profile",
      icon: <User size={18} />,
      href: "/dashboard/professional-profile",
    },
  ];

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "unread" && conv.unread) ||
      (filterType === "urgent" && conv.priority === "high") ||
      conv.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isFromContact: false,
      };
      setMessages([...messages, message]);
      setNewMessage("");
      toast.success("Message sent successfully");
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (conversation.unread) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversation.id ? { ...conv, unread: false } : conv
        )
      );
    }
  };

  const handlePhoneCall = () =>
    selectedConversation &&
    toast.success(`Calling ${selectedConversation.contact}...`);
  const handleVideoCall = () =>
    selectedConversation &&
    toast.success(
      `Starting video call with ${selectedConversation.contact}...`
    );
  const handleSendEmail = () =>
    selectedConversation &&
    toast.success(`Opening email to ${selectedConversation.contact}...`);
  const handleStarConversation = () =>
    selectedConversation &&
    toast.success(`Starred conversation with ${selectedConversation.contact}`);
  const handleArchiveConversation = () => {
    if (selectedConversation) {
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== selectedConversation.id)
      );
      setSelectedConversation(null);
      toast.success(
        `Archived conversation with ${selectedConversation.contact}`
      );
    }
  };
  const handleMoreActions = () => toast.info("More actions menu");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      "project-update": "Project Update",
      "job-response": "Job Response",
      "job-inquiry": "Job Inquiry",
      "system-notification": "System",
      "client-communication": "Client",
    };
    return typeMap[type] || type;
  };

  const unreadCount = conversations.filter((c) => c.unread).length;

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--messages-received-bubble))]">
      {/* // <ProfessionalHeader navItems={headerNavItems} /> */}

      <div className="flex-1 flex h-[calc(100vh-64px)]">
        {/* Conversations Sidebar */}
        <div className="w-[360px] bg-[hsl(var(--messages-sidebar-bg))] border-r border-[hsl(var(--messages-border))] flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[hsl(var(--messages-border))]">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    {unreadCount} unread
                  </Badge>
                )}
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter messages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="project-update">
                    Project Updates
                  </SelectItem>
                  <SelectItem value="job-response">Job Responses</SelectItem>
                  <SelectItem value="job-inquiry">Job Inquiries</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? "bg-purple-50 border-l-4 border-l-purple-600"
                    : ""
                } ${conversation.unread ? "bg-blue-50" : ""}`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className={`h-10 w-10 ${conversation.avatar}`}>
                    <AvatarFallback>{conversation.initials}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`text-base font-medium text-gray-900 truncate ${
                          conversation.unread ? "font-semibold" : ""
                        }`}
                      >
                        {conversation.contact}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {conversation.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {conversation.lastMessage}
                    </p>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(conversation.type)}
                      </Badge>
                      <Badge
                        className={getPriorityColor(conversation.priority)}
                      >
                        {conversation.priority}
                      </Badge>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      className={`h-10 w-10 ${selectedConversation.avatar}`}
                    >
                      <AvatarFallback>
                        {selectedConversation.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">
                        {selectedConversation.contact}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {getTypeLabel(selectedConversation.type)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePhoneCall}
                      className="hover:bg-purple-50"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVideoCall}
                      className="hover:bg-purple-50"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSendEmail}
                      className="hover:bg-purple-50"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleStarConversation}
                      className="hover:bg-purple-50"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleArchiveConversation}
                      className="hover:bg-purple-50"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isFromContact ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isFromContact
                          ? "bg-gray-100 text-gray-900"
                          : "bg-purple-600 text-white"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isFromContact
                            ? "text-gray-500"
                            : "text-purple-200"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 min-h-[40px] max-h-32 resize-none"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
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

export default ProfessionalMessages;
