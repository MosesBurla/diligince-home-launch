
import { Home, FileText, ShoppingCart, MessageSquare, Users, Workflow, Building2, Package, Truck, User, Calendar, Briefcase, Settings } from "lucide-react";
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

// Industry Dashboard Navigation - ISO 9001 Compliant Flow
export const industryHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/industry-dashboard",
  navItems: [
    {
      label: "Dashboard",
      href: "/industry-dashboard",
      icon: React.createElement(Home, { size: 18 })
    },
    {
      label: "Requirements",
      href: "/industry-requirements",
      icon: React.createElement(FileText, { size: 18 })
    },
    {
      label: "Workflows",
      href: "/industry-workflows",
      icon: React.createElement(Workflow, { size: 18 })
    },
    {
      label: "Approval Matrix",
      href: "/industry-approval-matrix",
      icon: React.createElement(Settings, { size: 18 })
    },
    {
      label: "Messages",
      href: "/industry-messages",
      icon: React.createElement(MessageSquare, { size: 18 })
    },
    {
      label: "Stakeholders",
      href: "/industry-stakeholders",
      icon: React.createElement(Users, { size: 18 })
    }
    // ,
    // {
    //   label: "Profile",
    //   href: "/industry-profile",
    //   icon: React.createElement(User, { size: 18 })
    // }
  ],
   avatarInitials: "IN",
 theme: {
  bgColor: "bg-[#1890ff]",
  textColor: "text-white",
  hoverColor: "hover:text-white hover:bg-blue-600",
  buttonHoverColor: "hover:bg-blue-600",
  avatarBgColor: "bg-blue-600",
  avatarBorderColor: "border-blue-200"
  }
};

// Service Vendor Dashboard Navigation
export const serviceVendorHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/service-vendor-dashboard",
  navItems: [
    {
      label: "Dashboard",
      href: "/service-vendor-dashboard",
      icon: React.createElement(Home, { size: 18 })
    },
    {
      label: "Requirements",
      href: "/service-vendor-rfqs",
      icon: React.createElement(FileText, { size: 18 })
    },
    {
      label: "Projects",
      href: "/service-vendor-projects",
      icon: React.createElement(Workflow, { size: 18 })
    },
    {
      label: "Services",
      href: "/service-vendor-services",
      icon: React.createElement(Briefcase, { size: 18 })
    },
    {
      label: "Messages",
      href: "/service-vendor-messages",
      icon: React.createElement(MessageSquare, { size: 18 })
    },
    // {
    //   label: "Profile",
    //   href: "/service-vendor-profile",
    //   icon: React.createElement(User, { size: 18 })
    // }
  ],
  avatarInitials: "SV",
  theme: {
    bgColor: "bg-[#EA5400]",
  textColor: "text-white",
  hoverColor: "hover:text-white hover:bg-blue-600",
  buttonHoverColor: "hover:bg-blue-600",
  avatarBgColor: "bg-blue-600",
  avatarBorderColor: "border-blue-200"
  }
};

// Product Vendor Dashboard Navigation (NEW - Fixed for product vendors)
export const productVendorHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/product-vendor-dashboard",
  navItems: [
    {
      label: "Dashboard",
      href: "/product-vendor-dashboard",
      icon: React.createElement(Home, { size: 18 })
    },
    {
      label: "RFQs",
      href: "/product-vendor-rfqs",
      icon: React.createElement(FileText, { size: 18 })
    },
    {
      label: "Orders",
      href: "/product-vendor-orders",
      icon: React.createElement(ShoppingCart, { size: 18 })
    },
    {
      label: "Catalog",
      href: "/product-vendor-catalog",
      icon: React.createElement(Package, { size: 18 })
    },
    {
      label: "Messages",
      href: "/product-vendor-messages",
      icon: React.createElement(MessageSquare, { size: 18 })
    },
    // {
    //   label: "Profile",
    //   href: "/product-vendor-profile",
    //   icon: React.createElement(User, { size: 18 })
    // }
  ],
  avatarInitials: "PV",
  theme: {
    bgColor: "bg-[#CC8800]",
    textColor: "text-white",
    hoverColor: "text-gray-600 hover:text-blue-600",
    buttonHoverColor: "hover:bg-gray-100",
    avatarBgColor: "bg-orange-100",
    avatarBorderColor: "border-orange-200"
  }
};

// Vendor Dashboard Navigation (Generic)
// export const vendorHeaderConfig: HeaderConfig = {
//   brandName: "Diligince.ai",
//   brandHref: "/vendor-dashboard",
//   navItems: [
//     {
//       label: "Dashboard",
//       href: "/vendor-dashboard",
//       icon: React.createElement(Home, { size: 18 })
//     },
//     {
//       label: "Requirements",
//       href: "/vendor-requirements",
//       icon: React.createElement(FileText, { size: 18 })
//     },
//     {
//       label: "Projects",
//       href: "/vendor-projects",
//       icon: React.createElement(Workflow, { size: 18 })
//     },
//     {
//       label: "Messages",
//       href: "/vendor-messages",
//       icon: React.createElement(MessageSquare, { size: 18 })
//     },
//     {
//       label: "Profile",
//       href: "/vendor-profile",
//       icon: React.createElement(User, { size: 18 })
//     }
//   ],
//   avatarInitials: "VE",
//   theme: {
//     bgColor: "bg-gray-900",
//     textColor: "text-gray-50",
//     hoverColor: "text-gray-400 hover:text-blue-300",
//     buttonHoverColor: "hover:bg-gray-800",
//     avatarBgColor: "bg-gray-700",
//   }
// };

// Logistics Vendor Dashboard Navigation (NEW - Fixed for logistics vendors)
export const logisticsVendorHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/logistics-vendor-dashboard",
  navItems: [
    {
      label: "Dashboard",
      href: "/logistics-vendor-dashboard",
      icon: React.createElement(Home, { size: 18 })
    },
    {
      label: "Requests",
      href: "/logistics-vendor-requests",
      icon: React.createElement(FileText, { size: 18 })
    },
    {
      label: "Deliveries",
      href: "/logistics-vendor-deliveries",
      icon: React.createElement(Truck, { size: 18 })
    },
    {
      label: "Fleet",
      href: "/logistics-vendor-fleet",
      icon: React.createElement(Building2, { size: 18 })
    },
    {
      label: "Messages",
      href: "/logistics-vendor-messages",
      icon: React.createElement(MessageSquare, { size: 18 })
    },
    // {
    //   label: "Profile",
    //   href: "/logistics-vendor-profile",
    //   icon: React.createElement(User, { size: 18 })
    // }
  ],
  avatarInitials: "TL",
  theme: {
    bgColor: "bg-[#eb2f96]",
    textColor: "text-white",
    hoverColor: "text-gray-600 hover:text-blue-600",
    buttonHoverColor: "hover:bg-gray-100",
    avatarBgColor: "bg-blue-100",
    avatarBorderColor: "border-blue-200"
  }
};

// Logistics Dashboard Navigation (Alias for compatibility)
// export const logisticsHeaderConfig: HeaderConfig = logisticsVendorHeaderConfig;

// Expert Dashboard Navigation
// export const expertHeaderConfig: HeaderConfig = {
//   brandName: "Diligince.ai",
//   brandHref: "/expert-dashboard",
//   navItems: [
//     {
//       label: "Dashboard",
//       href: "/expert-dashboard",
//       icon: React.createElement(Home, { size: 18 })
//     },
//     {
//       label: "Projects",
//       href: "/expert-projects",
//       icon: React.createElement(Briefcase, { size: 18 })
//     },
//     {
//       label: "Calendar",
//       href: "/expert-calendar",
//       icon: React.createElement(Calendar, { size: 18 })
//     },
//     {
//       label: "Messages",
//       href: "/expert-messages",
//       icon: React.createElement(MessageSquare, { size: 18 })
//     },
//     {
//       label: "Profile",
//       href: "/expert-profile",
//       icon: React.createElement(User, { size: 18 })
//     }
//   ],
//   avatarInitials: "EX",
//   theme: {
//     bgColor: "bg-white",
//     textColor: "text-gray-900",
//     hoverColor: "text-gray-600 hover:text-blue-600",
//     buttonHoverColor: "hover:bg-gray-100",
//     avatarBgColor: "bg-blue-100",
//     avatarBorderColor: "border-blue-200"
//   }
// };

// Professional Dashboard Navigation (missing export)
export const professionalHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/professional-dashboard",
  navItems: [
    {
      label: "Dashboard",
      href: "/professional-dashboard",
      icon: React.createElement(Home, { size: 18 })
    },
    {
      label: "Opportunities",
      href: "/professional-opportunities",
      icon: React.createElement(Briefcase, { size: 18 })
    },
    {
      label: "Calendar",
      href: "/professional-calendar",
      icon: React.createElement(Calendar, { size: 18 })
    },
    {
      label: "Messages",
      href: "/professional-messages",
      icon: React.createElement(MessageSquare, { size: 18 })
    },
    // {
    //   label: "Profile",
    //   href: "/professional-profile",
    //   icon: React.createElement(User, { size: 18 })
    // }
  ],
  avatarInitials: "PR",
  theme: {
    bgColor: "bg-[#6A0DAD]",
    textColor: "text-white",
    hoverColor: "text-gray-600 hover:text-blue-600",
    buttonHoverColor: "hover:bg-gray-100",
    avatarBgColor: "bg-blue-100",
    avatarBorderColor: "border-blue-200"
  }
};

// Utility function to get header config by path
export const getHeaderConfigByPath = (path: string): HeaderConfig => {
  if (path.startsWith('/industry')) return industryHeaderConfig;
  if (path.startsWith('/service-vendor')) return serviceVendorHeaderConfig;
  if (path.startsWith('/product-vendor')) return productVendorHeaderConfig;
  if (path.startsWith('/logistics-vendor') || path.startsWith('/logistics')) return logisticsVendorHeaderConfig;
  // if (path.startsWith('/expert')) return expertHeaderConfig;
  if (path.startsWith('/professional')) return professionalHeaderConfig;
  // if (path.startsWith('/vendor')) return vendorHeaderConfig;
  
  // Default fallback
  return industryHeaderConfig;
};
