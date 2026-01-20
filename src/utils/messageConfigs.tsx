import React from "react";
import {
  MessageSquare,
  Package,
  Clipboard,
  Wrench,
  Search,
  Bell,
  Briefcase,
  Truck,
  BarChart3,
  Building2,
} from "lucide-react";

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
  messageTypes: Record<
    string,
    { label: string; icon: React.ReactNode; color: string }
  >;
  filters: Array<{ key: string; label: string }>;
}

/* ---------------- INDUSTRY ---------------- */
export const industryMessageConfig: MessageCenterConfig = {
  title: "Message Center",
  theme: "primary",
  showSearch: true,
  showFilters: true,
  showReply: true,
  showCallActions: true,
  messageTypes: {
    "vendor-inquiry": {
      label: "Vendor Inquiry",
      icon: <Building2 size={16} />,
      color: "blue",
    },
    "project-update": {
      label: "Project Update",
      icon: <Wrench size={16} />,
      color: "green",
    },
    "proposal-response": {
      label: "Proposal Response",
      icon: <Clipboard size={16} />,
      color: "orange",
    },
    "purchase-order": {
      label: "Purchase Order",
      icon: <Package size={16} />,
      color: "purple",
    },
    "system-notification": {
      label: "System",
      icon: <Bell size={16} />,
      color: "gray",
    },
  },
  filters: [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "urgent", label: "Urgent" },
    { key: "vendor-inquiry", label: "Vendors" },
    { key: "project-update", label: "Projects" },
  ],
};

/* ---------------- PROFESSIONAL ---------------- */
export const professionalMessageConfig: MessageCenterConfig = {
  title: "Message Center",
  theme: "primary",
  showSearch: true,
  showFilters: true,
  showReply: true,
  showCallActions: true,
  messageTypes: {
    "project-update": {
      label: "Project Update",
      icon: <Wrench size={16} />,
      color: "blue",
    },
    "project-preparation": {
      label: "Project Prep",
      icon: <Clipboard size={16} />,
      color: "green",
    },
    "job-response": {
      label: "Job Response",
      icon: <Briefcase size={16} />,
      color: "orange",
    },
    "job-inquiry": {
      label: "Job Inquiry",
      icon: <Search size={16} />,
      color: "purple",
    },
    "system-notification": {
      label: "System",
      icon: <Bell size={16} />,
      color: "gray",
    },
  },
  filters: [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "urgent", label: "Urgent" },
    { key: "project-update", label: "Projects" },
    { key: "job-response", label: "Jobs" },
  ],
};

/* ---------------- SERVICE VENDOR ---------------- */
export const serviceVendorMessageConfig: MessageCenterConfig = {
  title: "Message Center",
  theme: "primary",
  showSearch: true,
  showFilters: true,
  showReply: true,
  showCallActions: true,
  messageTypes: {
    "project-update": {
      label: "Project Update",
      icon: <Wrench size={16} />,
      color: "green",
    },
    "project-inquiry": {
      label: "Project Inquiry",
      icon: <Search size={16} />,
      color: "blue",
    },
    "proposal-response": {
      label: "Proposal Response",
      icon: <Clipboard size={16} />,
      color: "orange",
    },
    "consultation-request": {
      label: "Consultation",
      icon: <MessageSquare size={16} />,
      color: "purple",
    },
    "system-notification": {
      label: "System",
      icon: <Bell size={16} />,
      color: "gray",
    },
  },
  filters: [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "urgent", label: "Urgent" },
  ],
};

/* ---------------- PRODUCT VENDOR ---------------- */
export const productVendorMessageConfig: MessageCenterConfig = {
  title: "Message Center",
  theme: "primary",
  showSearch: true,
  showFilters: true,
  showReply: true,
  showCallActions: true,
  messageTypes: {
    "order-notification": {
      label: "Order",
      icon: <Package size={16} />,
      color: "blue",
    },
    "rfq-notification": {
      label: "RFQ",
      icon: <Clipboard size={16} />,
      color: "green",
    },
    "stock-inquiry": {
      label: "Stock Inquiry",
      icon: <BarChart3 size={16} />,
      color: "orange",
    },
    "technical-inquiry": {
      label: "Technical",
      icon: <Wrench size={16} />,
      color: "purple",
    },
    "system-notification": {
      label: "System",
      icon: <Bell size={16} />,
      color: "gray",
    },
  },
  filters: [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "urgent", label: "Urgent" },
  ],
};

/* ---------------- LOGISTICS VENDOR ---------------- */
export const logisticsVendorMessageConfig: MessageCenterConfig = {
  title: "Message Center",
  theme: "primary",
  showSearch: true,
  showFilters: true,
  showReply: true,
  showCallActions: true,
  messageTypes: {
    "transport-request": {
      label: "Transport",
      icon: <Truck size={16} />,
      color: "blue",
    },
    "delivery-update": {
      label: "Delivery",
      icon: <Package size={16} />,
      color: "green",
    },
    "system-notification": {
      label: "System",
      icon: <Bell size={16} />,
      color: "gray",
    },
  },
  filters: [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "urgent", label: "Urgent" },
  ],
};
