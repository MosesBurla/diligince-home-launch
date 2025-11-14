import {
  Home,
  FileText,
  ShoppingCart,
  MessageSquare,
  Users,
  Workflow,
  Building2,
  Package,
  Truck,
  User,
  Calendar,
  Briefcase,
  Settings,
} from "lucide-react";
import React from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

export interface HeaderConfig {
  brandName: string;
  brandHref: string;
  navItems: NavItem[];
  avatarInitials: string;
  theme: {
    bgColor: string;
    textColor: string;
    hoverColor: string;
    buttonHoverColor: string;
    avatarBgColor: string;
    avatarBorderColor?: string;
  };
}

/* ---------------- INDUSTRY ---------------- */
export const industryHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/dashboard/industry",
  navItems: [
    {
      label: "Dashboard",
      href: "/dashboard/industry",
      icon: <Home size={18} />,
    },
    {
      label: "Requirements",
      href: "/dashboard/industry-requirements",
      icon: <FileText size={18} />,
    },
    {
      label: "Workflows",
      href: "/dashboard/industry-workflows",
      icon: <Workflow size={18} />,
    },
    {
      label: "Approval Matrix",
      href: "/dashboard/industry-approval-matrix",
      icon: <Settings size={18} />,
    },
    {
      label: "Messages",
      href: "/dashboard/industry-messages",
      icon: <MessageSquare size={18} />,
    },
    {
      label: "Stakeholders",
      href: "/dashboard/industry-stakeholders",
      icon: <Users size={18} />,
    },
    {
      label: "Profile",
      href: "/dashboard/industry-profile",
      icon: <User size={18} />,
    },
  ],
  avatarInitials: "IN",
  theme: {
    bgColor: "bg-white",
    textColor: "text-gray-900",
    hoverColor: "text-gray-600 hover:text-primary",
    buttonHoverColor: "hover:bg-gray-100",
    avatarBgColor: "bg-primary/10",
    avatarBorderColor: "border-primary/20",
  },
};

/* ---------------- SERVICE VENDOR ---------------- */
export const serviceVendorHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/dashboard/service-vendor",
  navItems: [
    {
      label: "Dashboard",
      href: "/dashboard/service-vendor",
      icon: <Home size={18} />,
    },
    {
      label: "Requirements",
      href: "/dashboard/service-vendor-rfqs",
      icon: <FileText size={18} />,
    },
    {
      label: "Projects",
      href: "/dashboard/service-vendor-projects",
      icon: <Workflow size={18} />,
    },
    {
      label: "Services",
      href: "/dashboard/service-vendor-services",
      icon: <Briefcase size={18} />,
    },
    {
      label: "Messages",
      href: "/dashboard/service-vendor-messages",
      icon: <MessageSquare size={18} />,
    },
    {
      label: "Profile",
      href: "/dashboard/service-vendor-profile",
      icon: <User size={18} />,
    },
  ],
  avatarInitials: "SV",
  theme: {
    bgColor: "bg-gray-900",
    textColor: "text-gray-50",
    hoverColor: "text-gray-400 hover:text-primary/80",
    buttonHoverColor: "hover:bg-gray-800",
    avatarBgColor: "bg-gray-700",
  },
};

/* ---------------- PRODUCT VENDOR ---------------- */
export const productVendorHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/dashboard/product-vendor",
  navItems: [
    {
      label: "Dashboard",
      href: "/dashboard/product-vendor",
      icon: <Home size={18} />,
    },
    {
      label: "RFQs",
      href: "/dashboard/product-vendor-rfqs",
      icon: <FileText size={18} />,
    },
    {
      label: "Orders",
      href: "/dashboard/product-vendor-orders",
      icon: <ShoppingCart size={18} />,
    },
    {
      label: "Catalog",
      href: "/dashboard/product-vendor-catalog",
      icon: <Package size={18} />,
    },
    {
      label: "Messages",
      href: "/dashboard/product-vendor-messages",
      icon: <MessageSquare size={18} />,
    },
    {
      label: "Profile",
      href: "/dashboard/product-vendor-profile",
      icon: <User size={18} />,
    },
  ],
  avatarInitials: "PV",
  theme: {
    bgColor: "bg-white",
    textColor: "text-gray-900",
    hoverColor: "text-gray-600 hover:text-primary",
    buttonHoverColor: "hover:bg-gray-100",
    avatarBgColor: "bg-orange-100",
    avatarBorderColor: "border-orange-200",
  },
};

/* ---------------- LOGISTICS VENDOR ---------------- */
export const logisticsVendorHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/dashboard/logistics-vendor",
  navItems: [
    {
      label: "Dashboard",
      href: "/dashboard/logistics-vendor",
      icon: <Home size={18} />,
    },
    {
      label: "Requests",
      href: "/dashboard/logistics-vendor-requests",
      icon: <FileText size={18} />,
    },
    {
      label: "Deliveries",
      href: "/dashboard/logistics-vendor-deliveries",
      icon: <Truck size={18} />,
    },
    {
      label: "Fleet",
      href: "/dashboard/logistics-vendor-fleet",
      icon: <Building2 size={18} />,
    },
    {
      label: "Messages",
      href: "/dashboard/logistics-vendor-messages",
      icon: <MessageSquare size={18} />,
    },
    {
      label: "Profile",
      href: "/dashboard/logistics-vendor-profile",
      icon: <User size={18} />,
    },
  ],
  avatarInitials: "LV",
  theme: {
    bgColor: "bg-white",
    textColor: "text-gray-900",
    hoverColor: "text-gray-600 hover:text-primary",
    buttonHoverColor: "hover:bg-gray-100",
    avatarBgColor: "bg-primary/10",
    avatarBorderColor: "border-primary/20",
  },
};

/* ---------------- PROFESSIONAL ---------------- */
export const professionalHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/dashboard/professional",
  navItems: [
    {
      label: "Dashboard",
      href: "/dashboard/professional",
      icon: <Home size={18} />,
    },
    {
      label: "Opportunities",
      href: "/dashboard/professional-opportunities",
      icon: <Briefcase size={18} />,
    },
    {
      label: "Calendar",
      href: "/dashboard/professional-calendar",
      icon: <Calendar size={18} />,
    },
    {
      label: "Messages",
      href: "/dashboard/professional-messages",
      icon: <MessageSquare size={18} />,
    },
    {
      label: "Profile",
      href: "/dashboard/professional-profile",
      icon: <User size={18} />,
    },
  ],
  avatarInitials: "PR",
  theme: {
    bgColor: "bg-white",
    textColor: "text-gray-900",
    hoverColor: "text-gray-600 hover:text-primary",
    buttonHoverColor: "hover:bg-gray-100",
    avatarBgColor: "bg-primary/10",
    avatarBorderColor: "border-primary/20",
  },
};

/* ---------------- EXPERT ---------------- */
export const expertHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/dashboard/expert",
  navItems: [
    { label: "Dashboard", href: "/dashboard/expert", icon: <Home size={18} /> },
    {
      label: "Projects",
      href: "/dashboard/expert-projects",
      icon: <Briefcase size={18} />,
    },
    {
      label: "Calendar",
      href: "/dashboard/expert-calendar",
      icon: <Calendar size={18} />,
    },
    {
      label: "Messages",
      href: "/dashboard/expert-messages",
      icon: <MessageSquare size={18} />,
    },
    {
      label: "Profile",
      href: "/dashboard/expert-profile",
      icon: <User size={18} />,
    },
  ],
  avatarInitials: "EX",
  theme: {
    bgColor: "bg-white",
    textColor: "text-gray-900",
    hoverColor: "text-gray-600 hover:text-primary",
    buttonHoverColor: "hover:bg-gray-100",
    avatarBgColor: "bg-primary/10",
    avatarBorderColor: "border-primary/20",
  },
};

/* ---------------- GENERIC VENDOR ---------------- */
export const vendorHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/dashboard/vendor",
  navItems: [
    { label: "Dashboard", href: "/dashboard/vendor", icon: <Home size={18} /> },
    {
      label: "Requirements",
      href: "/dashboard/vendor-requirements",
      icon: <FileText size={18} />,
    },
    {
      label: "Projects",
      href: "/dashboard/vendor-projects",
      icon: <Workflow size={18} />,
    },
    {
      label: "Messages",
      href: "/dashboard/vendor-messages",
      icon: <MessageSquare size={18} />,
    },
    {
      label: "Profile",
      href: "/dashboard/vendor-profile",
      icon: <User size={18} />,
    },
  ],
  avatarInitials: "VE",
  theme: {
    bgColor: "bg-gray-900",
    textColor: "text-gray-50",
    hoverColor: "text-gray-400 hover:text-primary/80",
    buttonHoverColor: "hover:bg-gray-800",
    avatarBgColor: "bg-gray-700",
  },
};

/* ---------------- UTILITY ---------------- */
export const getHeaderConfigByPath = (path: string): HeaderConfig => {
  if (path.startsWith("/dashboard/industry")) return industryHeaderConfig;
  if (path.startsWith("/dashboard/service-vendor"))
    return serviceVendorHeaderConfig;
  if (path.startsWith("/dashboard/product-vendor"))
    return productVendorHeaderConfig;
  if (path.startsWith("/dashboard/logistics-vendor"))
    return logisticsVendorHeaderConfig;
  if (path.startsWith("/dashboard/professional"))
    return professionalHeaderConfig;
  if (path.startsWith("/dashboard/expert")) return expertHeaderConfig;
  if (path.startsWith("/dashboard/vendor")) return vendorHeaderConfig;

  // Default fallback
  return industryHeaderConfig;
};
