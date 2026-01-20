import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { LogisticsVendorHeader } from "@/components/vendor/LogisticsVendorHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, MessageSquare, Send, Plus, Phone, Video, Archive, Star, MoreHorizontal, Paperclip, Mail } from "lucide-react";
import { toast } from "sonner";

// Mock message data for logistics vendors
const messageThreads = [{
  id: 1,
  sender: "Steel Industries Ltd.",
  initials: "SI",
  subject: "Urgent Transport Request",
  preview: "We need immediate transportation for 50 tons of steel plates from our facility to the construction site. Can you handle this?",
  lastMessage: "Please confirm the pickup time for the steel plates. Our crane operator will be available from 9 AM.",
  time: "30 min ago",
  timestamp: "2:15 PM",
  unread: true,
  priority: "urgent",
  category: "Transport Request",
  avatar: "bg-blue-100 text-blue-600"
}, {
  id: 2,
  sender: "Chemical Corp",
  initials: "CC",
  subject: "Hazmat Delivery Update",
  preview: "Could you provide an update on the hazardous materials delivery scheduled for today? Our receiving team needs advance notice.",
  lastMessage: "The delivery is on schedule. Our certified driver will arrive at your facility between 3-4 PM today.",
  time: "1 hour ago",
  timestamp: "1:45 PM",
  unread: true,
  priority: "high",
  category: "Delivery Update",
  avatar: "bg-green-100 text-green-600"
}, {
  id: 3,
  sender: "Manufacturing Hub",
  initials: "MH",
  subject: "Regular Route Inquiry",
  preview: "We're looking for a logistics partner for regular weekly shipments. Can you provide a quote for ongoing transportation services?",
  lastMessage: "Thank you for the competitive quote. We'd like to discuss the weekly schedule and payment terms.",
  time: "3 hours ago",
  timestamp: "Yesterday",
  unread: false,
  priority: "medium",
  category: "Route Inquiry",
  avatar: "bg-orange-100 text-orange-600"
}, {
  id: 4,
  sender: "Power Plant Solutions",
  initials: "PP",
  subject: "Equipment Transport",
  preview: "We need specialized equipment for transporting heavy machinery. Do you have flatbed trucks with crane capabilities?",
  lastMessage: "We have flatbed trucks with 50-ton capacity and can arrange crane services. What's the pickup location?",
  time: "1 day ago",
  timestamp: "2 days ago",
  unread: false,
  priority: "medium",
  category: "Equipment Transport",
  avatar: "bg-pink-100 text-pink-600"
}];

// Mock detailed messages for conversations
const detailedMessages = {
  1: [{
    id: 1,
    sender: "Steel Industries Ltd.",
    content: "Good afternoon! We have an urgent requirement for transporting 50 tons of steel plates.",
    timestamp: "1:30 PM",
    isFromContact: true
  }, {
    id: 2,
    sender: "You",
    content: "Hello! We can handle that. What's the pickup and delivery location? Do you need it today?",
    timestamp: "1:45 PM",
    isFromContact: false
  }, {
    id: 3,
    sender: "Steel Industries Ltd.",
    content: "Pickup from our warehouse at Industrial Zone A, delivery to Construction Site B. Yes, we need it today if possible.",
    timestamp: "2:00 PM",
    isFromContact: true
  }, {
    id: 4,
    sender: "Steel Industries Ltd.",
    content: "Please confirm the pickup time for the steel plates. Our crane operator will be available from 9 AM.",
    timestamp: "2:15 PM",
    isFromContact: true
  }]
};
const LogisticsVendorMessages = () => {
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
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Transport Request":
        return "bg-blue-100 text-blue-800";
      case "Delivery Update":
        return "bg-green-100 text-green-800";
      case "Route Inquiry":
        return "bg-orange-100 text-orange-800";
      case "Equipment Transport":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const filteredMessages = messages.filter(message => {
    if (filterBy === "unread" && !message.unread) return false;
    if (filterBy === "urgent" && message.priority !== "urgent" && message.priority !== "high") return false;
    if (searchTerm && !message.subject.toLowerCase().includes(searchTerm.toLowerCase()) && !message.sender.toLowerCase().includes(searchTerm.toLowerCase())) return false;
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
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
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
  const handlePhoneCall = () => {
    if (selectedConversation) {
      toast.success(`Calling ${selectedConversation.sender}...`);
    }
  };
  const handleVideoCall = () => {
    if (selectedConversation) {
      toast.success(`Starting video call with ${selectedConversation.sender}...`);
    }
  };
  const handleOpenEmail = () => {
    if (selectedConversation) {
      toast.success(`Opening email to ${selectedConversation.sender}...`);
    }
  };
  const handleStarConversation = () => {
    if (selectedConversation) {
      toast.success(`Starred conversation with ${selectedConversation.sender}`);
    }
  };
  const handleArchiveConversation = () => {
    if (selectedConversation) {
      setMessages(prev => prev.filter(msg => msg.id !== selectedConversation.id));
      setSelectedConversation(null);
      toast.success(`Archived conversation with ${selectedConversation.sender}`);
    }
  };
  const handleMoreActions = () => {
    toast.info("More actions menu");
  };
  const unreadCount = messages.filter(msg => msg.unread).length;
  const urgentCount = messages.filter(msg => msg.priority === "urgent" || msg.priority === "high").length;
  return <div className="min-h-screen flex flex-col bg-[hsl(var(--messages-received-bubble))]">
      <Helmet>
        <title>Messages | Logistics Vendor Dashboard</title>
      </Helmet>
      
      {/* <LogisticsVendorHeader /> */}
      
      <div className="flex-1 flex h-[calc(100vh-64px)]">
        {/* Conversations Sidebar */}
        <div className="w-[360px] bg-[hsl(var(--messages-sidebar-bg))] border-r border-[hsl(var(--messages-border))] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && <Badge className="bg-red-100 text-red-800">
                    {unreadCount} unread
                  </Badge>}
                {urgentCount > 0 && <Badge className="bg-yellow-100 text-yellow-800">
                    {urgentCount} urgent
                  </Badge>}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
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
                        <Input placeholder="Select client..." />
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
                        <Button className="bg-pink-600 hover:bg-pink-700">
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
                <Input placeholder="Search conversations..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-gray-50" />
              </div>
              
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter messages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.map(conversation => <div key={conversation.id} className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversation?.id === conversation.id ? "bg-pink-50 border-l-4 border-l-pink-600" : ""} ${conversation.unread ? "bg-pink-25" : ""}`} onClick={() => handleConversationSelect(conversation)}>
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
                      {conversation.unread && <div className="w-2 h-2 bg-pink-500 rounded-full"></div>}
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? <>
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
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handlePhoneCall} className="bg-pink-700 hover:bg-pink-600 text-slate-50">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleVideoCall} className="text-gray-50 bg-pink-700 hover:bg-pink-600">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleOpenEmail} className="text-gray-50 bg-pink-700 hover:bg-pink-600">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleStarConversation} className="text-gray-50 bg-pink-700 hover:bg-pink-600">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleArchiveConversation} className="text-gray-50 bg-pink-700 hover:bg-pink-600">
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map(message => <div key={message.id} className={`flex ${message.isFromContact ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isFromContact ? "bg-gray-100 text-gray-900" : "bg-pink-600 text-white"}`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.isFromContact ? "text-gray-500" : "text-pink-200"}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>)}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end gap-2">
                  <Button variant="outline" size="sm" className="text-gray-50 bg-pink-700 hover:bg-pink-600">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea placeholder="Type your message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }} className="flex-1 min-h-[40px] max-h-32 resize-none bg-gray-50" />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="bg-pink-600 hover:bg-pink-700 text-gray-50">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </> : <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>}
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
              <Input placeholder="Email subject..." value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Type your email message..." rows={8} value={emailContent} onChange={e => setEmailContent(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEmailModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail} className="bg-pink-600 hover:bg-pink-700">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default LogisticsVendorMessages;