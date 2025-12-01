import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  Briefcase,
  MessageSquare,
  Quote,
  Workflow,
  Plus,
  List,
  Archive,
  Users,
  User,
  GitPullRequestDraft,
  CheckCircle,
  Clock,
  Building,
  CreditCard,
  Shield,
  Calendar,
  Truck,
  Package,
  UserCheck,
  Globe,
  Mail,
  Bell,
  Eye,
  Edit,
  Activity,
  TrendingUp,
  PieChart,
  DollarSign,
  Clipboard,
  BookOpen,
  Award,
  Target,
  Zap,
  Layers,
  Database,
  Bookmark,
} from "lucide-react";

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  submenu?: {
    icon: any;
    label: string;
    path: string;
    onClick?: () => void;
  }[];
}

interface MenuConfig {
  industry: MenuItem[];
  professional: MenuItem[];
  "service-vendor": MenuItem[];
  "product-vendor": MenuItem[];
  "logistics-vendor": MenuItem[];
}

export const menuConfig: MenuConfig = {
  // ---------------- INDUSTRY ----------------
  industry: [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard/industry",
    },
    {
      icon: FileText,
      label: "Requirements",
      path: "/dashboard/industry-requirements",
      submenu: [
        {
          icon: Edit,
          label: "Create New",
          path: "/dashboard/create-requirement",
        },
        {
          icon: GitPullRequestDraft,
          label: "Drafts",
          path: "/dashboard/requirements/drafts",
        },
        {
          icon: Clock,
          label: "Pending Approval",
          path: "/dashboard/requirements/pending",
        },
        {
          icon: CheckCircle,
          label: "Approved",
          path: "/dashboard/requirements/approved",
        },
        {
          icon: Globe,
          label: "Published",
          path: "/dashboard/requirements/published",
        },
        {
          icon: Archive,
          label: "Archived",
          path: "/dashboard/requirements/archived",
        },
      ],
    },
    {
      icon: Quote,
      label: "Quotations",
      path: "/dashboard/industry-quotes",
      submenu: [
        {
          icon: Eye,
          label: "All Quotations",
          path: "/dashboard/industry-quotes",
        },
        {
          icon: Clock,
          label: "Pending Review",
          path: "/dashboard/quotations/pending",
        },
        {
          icon: CheckCircle,
          label: "Approved",
          path: "/dashboard/quotations/approved",
        },
        {
          icon: BarChart3,
          label: "Comparison",
          path: "/dashboard/quotations/comparison",
        },
      ],
    },
    {
      icon: Clipboard,
      label: "Purchase Orders",
      path: "/dashboard/industry-purchase-orders",
      submenu: [
        {
          icon: Plus,
          label: "Create PO",
          path: "/dashboard/create-purchase-order",
        },
        {
          icon: List,
          label: "All Orders",
          path: "/dashboard/industry-purchase-orders",
        },
        {
          icon: Clock,
          label: "Pending",
          path: "/dashboard/purchase-orders/pending",
        },
        {
          icon: Activity,
          label: "In Progress",
          path: "/dashboard/purchase-orders/in-progress",
        },
        {
          icon: CheckCircle,
          label: "Completed",
          path: "/dashboard/purchase-orders/completed",
        },
      ],
    },
    {
      icon: Workflow,
      label: "Project Workflows",
      path: "/dashboard/industry-workflows",
      submenu: [
        {
          icon: List,
          label: "All Projects",
          path: "/dashboard/industry-workflows",
        },
        {
          icon: Activity,
          label: "Active Projects",
          path: "/dashboard/workflows/active",
        },
        {
          icon: Calendar,
          label: "Timeline View",
          path: "/dashboard/workflows/timeline",
        },
        {
          icon: TrendingUp,
          label: "Progress Reports",
          path: "/dashboard/workflows/reports",
        },
      ],
    },
    // {
    //   icon: Users,
    //   label: "Stakeholders",
    //   path: "/dashboard/industry-stakeholders",
    //   submenu: [
    //     {
    //       icon: Building,
    //       label: "Vendors",
    //       path: "/dashboard/stakeholders/vendors",
    //     },
    //     {
    //       icon: UserCheck,
    //       label: "Professionals",
    //       path: "/dashboard/stakeholders/professionals",
    //     },
    //   ],
    // },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/dashboard/industry-messages",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/dashboard/industry-analytics",
    },
    {
      icon: Target,
      label: "Diligince HUB",
      path: "/dashboard/industry-Diligince-hub",
      submenu: [
        {
          icon: Building,
          label: "Find Vendors",
          path: "/dashboard/Diligince-hub/vendors",
        },
        {
          icon: UserCheck,
          label: "Find Professionals",
          path: "/dashboard/Diligince-hub/professionals",
        },
      ],
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/dashboard/industry-settings",
      submenu: [
        {
          icon: Building,
          label: "Company Profile",
          path: "/dashboard/industry-settings",
        },
        {
          icon: Users,
          label: "Team Members",
          path: "/dashboard/industry-team",
        },
        {
          icon: Shield,
          label: "Role Management",
          path: "/dashboard/role-management",
        },
        {
          icon: Shield,
          label: "Approval Matrix",
          path: "/dashboard/industry-approval-matrix",
        },
        {
          icon: Bell,
          label: "Notifications",
          path: "/dashboard/industry-notifications",
        },
      ],
    },
  ],

  // ---------------- PROFESSIONAL ----------------
  professional: [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard/professional",
    },
    {
      icon: Briefcase,
      label: "Opportunities",
      path: "/dashboard/professional-opportunities",
      submenu: [
        {
          icon: Bookmark,
          label: "Saved Jobs",
          path: "/dashboard/opportunities/saved",
        },
        {
          icon: Clock,
          label: "Applications",
          path: "/dashboard/opportunities/applications",
        },
      ],
    },
    { icon: Clipboard, label: "Projects", path: "/dashboard/projects/active" },
    {
      icon: Calendar,
      label: "Calendar",
      path: "/dashboard/professional-calendar",
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/dashboard/professional-messages",
    },
    {
      icon: Award,
      label: "Portfolio",
      path: "/dashboard/professional-portfolio",
    },
    {
      icon: BookOpen,
      label: "Certifications",
      path: "/dashboard/professional-certifications",
    },
    {
      icon: Settings,
      label: "Profile",
      path: "/dashboard/professional-profile",
    },
  ],

  // ---------------- SERVICE VENDOR ----------------
  "service-vendor": [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard/service-vendor",
    },
    { icon: FileText, label: "RFQs", path: "/dashboard/service-vendor-rfqs" },
    { icon: Quote, label: "My Quotations", path: "/dashboard/vendor/quotations" },
    {
      icon: Clipboard,
      label: "Projects",
      path: "/dashboard/service-vendor-projects",
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/dashboard/service-vendor-messages",
    },
    { icon: Users, label: "Team", path: "/dashboard/team" },
    {
      icon: Settings,
      label: "Profile",
      path: "/dashboard/service-vendor-profile",
    },
    {
      icon: Layers,
      label: "Services",
      path: "/dashboard/service-vendor-services",
    },
  ],

  // ---------------- PRODUCT VENDOR ----------------
  "product-vendor": [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard/product-vendor",
    },
    {
      icon: Package,
      label: "Catalog",
      path: "/dashboard/product-vendor-catalog",
    },
    {
      icon: FileText,
      label: "Orders",
      path: "/dashboard/product-vendor-orders",
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/dashboard/product-vendor-messages",
    },
    {
      icon: Settings,
      label: "Profile",
      path: "/dashboard/product-vendor-profile",
    },
  ],

  // ---------------- LOGISTICS VENDOR ----------------
  "logistics-vendor": [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard/logistics-vendor",
    },
    {
      icon: Truck,
      label: "Requests",
      path: "/dashboard/logistics-vendor-requests",
    },
    {
      icon: Clipboard,
      label: "Deliveries",
      path: "/dashboard/logistics-vendor-deliveries",
    },
    {
      icon: Package,
      label: "Fleet",
      path: "/dashboard/logistics-vendor-fleet",
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/dashboard/logistics-vendor-messages",
    },
    {
      icon: Settings,
      label: "Profile",
      path: "/dashboard/logistics-vendor-profile",
    },
  ],
};
