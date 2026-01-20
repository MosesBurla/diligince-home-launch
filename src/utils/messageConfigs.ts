
import React from "react";
import { MessageSquare } from "lucide-react";

export interface MessageConfig {
  title: string;
  icon: React.ReactNode;
  emptyStateMessage: string;
  theme: {
    bgColor: string;
    headerTextColor: string;
    iconColor: string;
  };
}

export interface MessageCenterConfig {
  title: string;
  theme: string;
  showSearch: boolean;
  showFilters: boolean;
  showReply: boolean;
  showCallActions: boolean;
  messageTypes: Record<string, { label: string; icon: string; color: string }>;
  filters: Array<{ key: string; label: string }>;
}

export const industryMessageConfig: MessageCenterConfig = {
  title: "Message Center",
  theme: "primary",
  showSearch: true,
  showFilters: true,
  showReply: true,
  showCallActions: true,
  messageTypes: {
    "vendor-inquiry": { label: "Vendor Inquiry", icon: "🏭", color: "primary" },
    "project-update": { label: "Project Update", icon: "🔧", color: "primary" },
    "proposal-response": { label: "Proposal Response", icon: "📋", color: "primary" },
    "purchase-order": { label: "Purchase Order", icon: "📦", color: "primary" },
    "system-notification": { label: "System", icon: "🔔", color: "muted" }
  },
  filters: [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "urgent", label: "Urgent" },
    { key: "vendor-inquiry", label: "Vendors" },
    { key: "project-update", label: "Projects" }
  ]
};

export const professionalMessageConfig: MessageCenterConfig = {
  title: "Message Center",
  theme: "primary",
  showSearch: true,
  showFilters: true,
  showReply: true,
  showCallActions: true,
  messageTypes: {
    "project-update": { label: "Project Update", icon: "🔧", color: "primary" },
    "project-preparation": { label: "Project Prep", icon: "📋", color: "primary" },
    "job-response": { label: "Job Response", icon: "💼", color: "primary" },
    "job-inquiry": { label: "Job Inquiry", icon: "🔍", color: "primary" },
    "system-notification": { label: "System", icon: "🔔", color: "muted" }
  },
  filters: [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "urgent", label: "Urgent" },
    { key: "project-update", label: "Projects" },
    { key: "job-response", label: "Jobs" }
  ]
};

export const serviceVendorMessageConfig: MessageCenterConfig = {
  title: "Message Center",
  theme: "primary",
  showSearch: true,
  showFilters: true,
  showReply: true,
  showCallActions: true,
  messageTypes: {
    "project-update": { label: "Project Update", icon: "🔧", color: "primary" },
    "project-inquiry": { label: "Project Inquiry", icon: "🔍", color: "primary" },
    "proposal-response": { label: "Proposal Response", icon: "📋", color: "primary" },
    "consultation-request": { label: "Consultation", icon: "💬", color: "primary" },
    "system-notification": { label: "System", icon: "🔔", color: "muted" }
  },
  filters: [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "urgent", label: "Urgent" }
  ]
};

export const productVendorMessageConfig: MessageCenterConfig = {
  title: "Message Center",
  theme: "primary",
  showSearch: true,
  showFilters: true,
  showReply: true,
  showCallActions: true,
  messageTypes: {
    "order-notification": { label: "Order", icon: "📦", color: "primary" },
    "rfq-notification": { label: "RFQ", icon: "📋", color: "primary" },
    "stock-inquiry": { label: "Stock Inquiry", icon: "📊", color: "primary" },
    "technical-inquiry": { label: "Technical", icon: "🔧", color: "primary" },
    "system-notification": { label: "System", icon: "🔔", color: "muted" }
  },
  filters: [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "urgent", label: "Urgent" }
  ]
};

export const logisticsVendorMessageConfig: MessageCenterConfig = {
  title: "Message Center",
  theme: "primary",
  showSearch: true,
  showFilters: true,
  showReply: true,
  showCallActions: true,
  messageTypes: {
    "transport-request": { label: "Transport", icon: "🚛", color: "primary" },
    "delivery-update": { label: "Delivery", icon: "📦", color: "primary" },
    "system-notification": { label: "System", icon: "🔔", color: "muted" }
  },
  filters: [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "urgent", label: "Urgent" }
  ]
};
