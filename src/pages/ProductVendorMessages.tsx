
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import VendorHeader from "@/components/vendor/VendorHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, MessageSquare, Send, Plus, Phone, Video, Archive, Star, MoreHorizontal, Paperclip, Mail } from "lucide-react";
import { toast } from "sonner";

// Mock message data for product vendors
const messageThreads = [
  {
    id: 1,
    sender: "Chem Industries",
    initials: "CI",
    subject: "Valve Specifications Inquiry",
    preview: "We need detailed specifications for the 6-inch ball valves. Can you provide material certificates and pressure test reports?",
    lastMessage: "Please confirm the shipping tracking number for PO #12456. Our plant maintenance is scheduled for next week.",
    time: "15 min ago",
    timestamp: "2:45 PM",
    unread: true,
    priority: "high",
    category: "Product Inquiry",
    orderNumber: "PO-12456",
    avatar: "bg-blue-100 text-blue-600"
  },
  {
    id: 2,
    sender: "Power Gen Co.",
    initials: "PG",
    subject: "Circuit Breaker Availability",
    preview: "When can we expect the next batch of 100A circuit breakers to be in stock? We have an urgent requirement for 50 units.",
    lastMessage: "We have an urgent requirement for 50 units of 100A circuit breakers. What's your current stock status?",
    time: "1 hour ago",
    timestamp: "1:45 PM",
    unread: true,
    priority: "urgent",
    category: "Stock Inquiry",
    avatar: "bg-green-100 text-green-600"
  },
  {
    id: 3,
    sender: "Steel Plant Ltd.",
    initials: "SP",
    subject: "Safety Equipment Order Status",
    preview: "Could you please provide an update on our safety equipment order? We need these for our new shift workers starting Monday.",
    lastMessage: "Thank you for the quick delivery of safety helmets. The quality is excellent and our workers are satisfied.",
    time: "3 hours ago",
    timestamp: "Yesterday",
    unread: false,
    priority: "medium",
    category: "Order Status",
    orderNumber: "PO-12458",
    avatar: "bg-orange-100 text-orange-600"
  },
  {
    id: 4,
    sender: "AutoParts Manufacturing Ltd.",
    initials: "AM",
    subject: "Bulk Discount Inquiry",
    preview: "We're interested in placing a large order for hydraulic pumps. Can you offer bulk discounts for quantities over 100 units?",
    lastMessage: "We're interested in placing a large order for hydraulic pumps. Can you offer bulk discounts for quantities over 100 units?",
    time: "1 day ago",
    timestamp: "2 days ago",
    unread: false,
    priority: "low",
    category: "Pricing Inquiry",
    avatar: "bg-pink-100 text-pink-600"
  },
  {
    id: 5,
    sender: "Manufacturing Corp",
    initials: "MC",
    subject: "Technical Support Request",
    preview: "We're having compatibility issues with the control panel we purchased. Can your technical team provide remote support?",
    lastMessage: "We're having compatibility issues with the control panel. Can your technical team provide remote support?",
    time: "2 days ago",
    timestamp: "3 days ago",
    unread: false,
    priority: "high",
    category: "Technical Support",
    avatar: "bg-purple-100 text-purple-600"
  }
];

// Mock detailed messages for conversations
const detailedMessages = {
  1: [
    {
      id: 1,
      sender: "Chem Industries",
      content: "Hello, we received your quotation for the industrial valves. Can you provide detailed material certificates for the SS316 valves?",
      timestamp: "10:30 AM",
      isFromContact: true
    },
    {
      id: 2,
      sender: "You",
      content: "Absolutely! All our valves come with complete material certificates. I'll send you the test certificates for the specific batch in your order.",
      timestamp: "11:00 AM",
      isFromContact: false
    },
    {
      id: 3,
      sender: "Chem Industries",
      content: "Thank you. Also, we need pressure test reports as per API 6D standards. Can you provide those as well?",
      timestamp: "11:15 AM",
      isFromContact: true
    },
    {
      id: 4,
      sender: "Chem Industries",
      content: "Please confirm the shipping tracking number for PO #12456. Our plant maintenance is scheduled for next week.",
      timestamp: "2:45 PM",
      isFromContact: true
    }
  ],
  2: [
    {
      id: 1,
      sender: "Power Gen Co.",
      content: "Good morning! We need to check the availability of 100A circuit breakers. Our current supplier has delayed delivery.",
      timestamp: "9:00 AM",
      isFromContact: true
    },
    {
      id: 2,
      sender: "You",
      content: "Hello! We currently have 30 units in stock and expecting 70 more units by end of this week. Would that work for your timeline?",
      timestamp: "9:30 AM",
      isFromContact: false
    },
    {
      id: 3,
      sender: "Power Gen Co.",
      content: "We have an urgent requirement for 50 units of 100A circuit breakers. What's your current stock status?",
      timestamp: "1:45 PM",
      isFromContact: true
    }
  ]
};

const ProductVendorMessages = () => {
  const [messages, setMessages] = useState(messageThreads);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Product Inquiry": return "bg-blue-100 text-blue-800";
      case "Stock Inquiry": return "bg-yellow-100 text-yellow-800";
      case "Order Status": return "bg-green-100 text-green-800";
      case "Pricing Inquiry": return "bg-purple-100 text-purple-800";
      case "Technical Support": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filterBy === "unread" && !message.unread) return false;
    if (filterBy === "urgent" && message.priority !== "urgent" && message.priority !== "high") return false;
    if (filterBy === "orders" && !message.orderNumber) return false;
    if (searchTerm && !message.subject.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !message.sender.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation);
    setConversationMessages(detailedMessages[conversation.id] || []);
    // Mark as read
    const messageIndex = messages.findIndex(msg => msg.id === conversation.id);
    if (messageIndex !== -1) {
      const updatedMessages = [...messages];
      updatedMessages[messageIndex].unread = false;
      setMessages(updatedMessages);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message = {
        id: conversationMessages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFromContact: false
      };
      setConversationMessages([...conversationMessages, message]);
      setNewMessage("");
      
      // Update the last message in the thread
      const messageIndex = messages.findIndex(msg => msg.id === selectedConversation.id);
      if (messageIndex !== -1) {
        const updatedMessages = [...messages];
        updatedMessages[messageIndex].lastMessage = newMessage;
        updatedMessages[messageIndex].time = "Just now";
        setMessages(updatedMessages);
      }
      
      toast.success("Message sent successfully");
    }
  };

  const handleSendEmail = () => {
    if (emailSubject.trim() && emailContent.trim() && selectedConversation) {
      toast.success(`Email sent to ${selectedConversation.sender}`);
      setEmailSubject("");
      setEmailContent("");
      setShowEmailModal(false);
    }
  };

  const unreadCount = messages.filter(msg => msg.unread).length;
  const urgentCount = messages.filter(msg => msg.priority === "urgent" || msg.priority === "high").length;

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--messages-received-bubble))]">
      <Helmet>
        <title>Messages | Product Vendor Dashboard</title>
      </Helmet>
      
      {/* <VendorHeader /> */}
      
      <div className="flex-1 flex h-[calc(100vh-64px)]">
        {/* Conversations Sidebar */}
        <div className="w-[360px] bg-[hsl(var(--messages-sidebar-bg))] border-r border-[hsl(var(--messages-border))] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    {unreadCount} unread
                  </Badge>
                )}
                {urgentCount > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {urgentCount} urgent
                  </Badge>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Compose New Message</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">To</label>
                        <Input placeholder="Select customer..." />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Subject</label>
                        <Input placeholder="Message subject..." />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Message</label>
                        <Textarea placeholder="Type your message..." rows={6} />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Save Draft</Button>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
              
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter messages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="orders">Order Related</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id ? "bg-green-50 border-l-4 border-l-green-600" : ""
                } ${conversation.unread ? "bg-green-25" : ""}`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className={`h-10 w-10 ${conversation.avatar}`}>
                    <AvatarFallback>{conversation.initials}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-base font-medium text-gray-900 truncate ${conversation.unread ? "font-semibold" : ""}`}>
                        {conversation.sender}
                      </h3>
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                    
                    <h4 className={`text-sm mb-1 ${conversation.unread ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {conversation.subject}
                    </h4>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {conversation.preview}
                    </p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getCategoryColor(conversation.category)} variant="outline">
                        {conversation.category}
                      </Badge>
                      <Badge className={getPriorityColor(conversation.priority)}>
                        {conversation.priority}
                      </Badge>
                      {conversation.orderNumber && (
                        <Badge variant="outline" className="text-xs">
                          {conversation.orderNumber}
                        </Badge>
                      )}
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
                    <Avatar className={`h-10 w-10 ${selectedConversation.avatar}`}>
                      <AvatarFallback>{selectedConversation.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">{selectedConversation.sender}</h2>
                      <p className="text-sm text-gray-500">{selectedConversation.category}</p>
                      {selectedConversation.orderNumber && (
                        <p className="text-xs text-green-600 font-medium">{selectedConversation.orderNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowEmailModal(true)}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromContact ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isFromContact
                        ? "bg-gray-100 text-gray-900"
                        : "bg-green-600 text-white"
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isFromContact ? "text-gray-500" : "text-green-200"
                      }`}>
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
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-green-600 hover:bg-green-700"
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
                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send Email to {selectedConversation?.sender}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input 
                placeholder="Email subject..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea 
                placeholder="Type your email message..."
                rows={8}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEmailModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail} className="bg-green-600 hover:bg-green-700">
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

export default ProductVendorMessages;
