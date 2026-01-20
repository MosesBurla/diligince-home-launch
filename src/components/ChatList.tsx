import React from 'react';
import { MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

interface ChatItem {
  id: string;
  name: string;
  role: 'industry' | 'professional' | 'vendor';
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'interested' | 'quotation_sent' | 'negotiating' | 'completed';
  avatar?: string;
}

interface ChatListProps {
  chats: ChatItem[];
  onChatSelect: (chatId: string) => void;
  currentUserRole: 'industry' | 'professional' | 'vendor';
}

const ChatList: React.FC<ChatListProps> = ({ chats, onChatSelect, currentUserRole }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interested': return 'text-primary bg-primary/10';
      case 'quotation_sent': return 'text-accent-warning bg-accent-warning/10';
      case 'negotiating': return 'text-primary bg-primary/10';
      case 'completed': return 'text-accent-success bg-accent-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'interested': return 'Interested';
      case 'quotation_sent': return 'Quotation Sent';
      case 'negotiating': return 'Negotiating';
      case 'completed': return 'Completed';
      default: return 'Active';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'industry': return 'text-primary';
      case 'professional': return 'text-primary';
      case 'vendor': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-primary" />
          Active Conversations
        </h3>
      </div>
      
      <div className="divide-y divide-border">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className="p-4 hover:bg-muted/50 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium group-hover:scale-105 transition-transform">
                {chat.name.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{chat.name}</h4>
                  <div className="flex items-center space-x-2">
                    {chat.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium">
                        {chat.unreadCount}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate flex-1 mr-2">{chat.lastMessage}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs capitalize font-medium ${getRoleColor(chat.role)}`}>
                      {chat.role}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chat.status)}`}>
                      {getStatusText(chat.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {chats.length === 0 && (
        <div className="p-8 text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No conversations yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            {currentUserRole === 'industry' && 'Professionals and vendors will appear here when they show interest'}
            {currentUserRole === 'professional' && 'Your conversations with industries will appear here'}
            {currentUserRole === 'vendor' && 'Your conversations with industries will appear here'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatList;