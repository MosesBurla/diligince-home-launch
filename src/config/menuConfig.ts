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
  XCircle,
  RotateCcw,
  MapPin,
  Wrench,
  Crown,
  Receipt,
  Wallet,
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
    {
      icon: Crown,
      label: "Subscription",
      path: "/dashboard/subscription",
      submenu: [
        {
          icon: Crown,
          label: "My Plan",
          path: "/dashboard/subscription/plans",
        },
        {
          icon: Receipt,
          label: "Transactions",
          path: "/dashboard/subscription/transactions",
        },
        {
          icon: Wallet,
          label: "Payment Methods",
          path: "/dashboard/subscription/payment-methods",
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
    {
      icon: Crown,
      label: "Subscription",
      path: "/dashboard/subscription",
      submenu: [
        { icon: Crown, label: "My Plan", path: "/dashboard/subscription/plans" },
        { icon: Receipt, label: "Transactions", path: "/dashboard/subscription/transactions" },
      ],
    },
  ],

  // ---------------- SERVICE VENDOR ----------------
  "service-vendor": [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard/service-vendor",
    },
    {
      icon: FileText,
      label: "RFQs",
      path: "/dashboard/service-vendor-rfqs",
      submenu: [
        {
          icon: Eye,
          label: "Browse RFQs",
          path: "/dashboard/service-vendor-rfqs",
        },
        {
          icon: Bookmark,
          label: "Saved RFQs",
          path: "/dashboard/rfqs/saved",
        },
        {
          icon: CheckCircle,
          label: "Applied RFQs",
          path: "/dashboard/rfqs/applied",
        },
      ],
    },
    {
      icon: Quote,
      label: "My Quotations",
      path: "/dashboard/vendor/quotations",
      submenu: [
        {
          icon: List,
          label: "All Quotations",
          path: "/dashboard/vendor/quotations",
        },
        // Hidden for now - filtering available via tabs on All Quotations page
        // {
        //   icon: GitPullRequestDraft,
        //   label: "Drafts",
        //   path: "/dashboard/vendor/quotations/drafts",
        // },
        // {
        //   icon: Clock,
        //   label: "Submitted",
        //   path: "/dashboard/vendor/quotations/submitted",
        // },
        // {
        //   icon: CheckCircle,
        //   label: "Accepted",
        //   path: "/dashboard/vendor/quotations/accepted",
        // },
        // {
        //   icon: XCircle,
        //   label: "Rejected",
        //   path: "/dashboard/vendor/quotations/rejected",
        // },
      ],
    },
    {
      icon: Clipboard,
      label: "Projects",
      path: "/dashboard/service-vendor-projects",
      submenu: [
        {
          icon: Activity,
          label: "Active Projects",
          path: "/dashboard/service-vendor-projects/active",
        },
        {
          icon: CheckCircle,
          label: "Completed Projects",
          path: "/dashboard/service-vendor-projects/completed",
        },
        {
          icon: Target,
          label: "Milestones",
          path: "/dashboard/service-vendor-projects/milestones",
        },
      ],
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/dashboard/service-vendor-messages",
    },
    {
      icon: Users,
      label: "Team",
      path: "/dashboard/team",
      submenu: [
        {
          icon: Users,
          label: "Team Members",
          path: "/dashboard/team/members",
        },
        {
          icon: Shield,
          label: "Role Management",
          path: "/dashboard/team/roles",
        },
      ],
    },
    {
      icon: Layers,
      label: "Services",
      path: "/dashboard/service-vendor-services",
      submenu: [
        {
          icon: List,
          label: "Service Catalog",
          path: "/dashboard/service-vendor-services/catalog",
        },
        {
          icon: Award,
          label: "Skills & Expertise",
          path: "/dashboard/service-vendor-services/skills",
        },
      ],
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/dashboard/vendor-settings",
      submenu: [
        {
          icon: Building,
          label: "Company Profile",
          path: "/dashboard/vendor-settings",
        },
        {
          icon: Award,
          label: "Certifications",
          path: "/dashboard/service-vendor-profile/certifications",
        },
        {
          icon: Briefcase,
          label: "Projects & Portfolio",
          path: "/dashboard/service-vendor-profile/portfolio",
        },
        {
          icon: CreditCard,
          label: "Payment Settings",
          path: "/dashboard/service-vendor-profile/payment",
        },
      ],
    },
    {
      icon: Crown,
      label: "Subscription",
      path: "/dashboard/subscription",
      submenu: [
        { icon: Crown, label: "My Plan", path: "/dashboard/subscription/plans" },
        { icon: Receipt, label: "Transactions", path: "/dashboard/subscription/transactions" },
      ],
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
      label: "Product Catalog",
      path: "/dashboard/product-vendor-catalog",
      submenu: [
        {
          icon: List,
          label: "All Products",
          path: "/dashboard/product-vendor-catalog",
        },
        {
          icon: Plus,
          label: "Add Product",
          path: "/dashboard/product-vendor-catalog/add",
        },
        {
          icon: Layers,
          label: "Categories",
          path: "/dashboard/product-vendor-catalog/categories",
        },
        {
          icon: Database,
          label: "Inventory",
          path: "/dashboard/product-vendor-catalog/inventory",
        },
      ],
    },
    {
      icon: FileText,
      label: "Orders",
      path: "/dashboard/product-vendor-orders",
      submenu: [
        {
          icon: Clock,
          label: "New Orders",
          path: "/dashboard/product-vendor-orders/new",
        },
        {
          icon: Activity,
          label: "Processing",
          path: "/dashboard/product-vendor-orders/processing",
        },
        {
          icon: Truck,
          label: "Shipped",
          path: "/dashboard/product-vendor-orders/shipped",
        },
        {
          icon: CheckCircle,
          label: "Completed",
          path: "/dashboard/product-vendor-orders/completed",
        },
        {
          icon: RotateCcw,
          label: "Returns",
          path: "/dashboard/product-vendor-orders/returns",
        },
      ],
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/dashboard/product-vendor-messages",
    },
    {
      icon: Users,
      label: "Team",
      path: "/dashboard/team",
      submenu: [
        {
          icon: Users,
          label: "Team Members",
          path: "/dashboard/team/members",
        },
        {
          icon: Shield,
          label: "Role Management",
          path: "/dashboard/team/roles",
        },
      ],
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/dashboard/product-vendor-analytics",
      submenu: [
        {
          icon: TrendingUp,
          label: "Sales Reports",
          path: "/dashboard/product-vendor-analytics/sales",
        },
        {
          icon: PieChart,
          label: "Inventory Reports",
          path: "/dashboard/product-vendor-analytics/inventory",
        },
      ],
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/dashboard/vendor-settings",
      submenu: [
        {
          icon: Building,
          label: "Company Profile",
          path: "/dashboard/vendor-settings",
        },
        {
          icon: Award,
          label: "Brands & Partners",
          path: "/dashboard/product-vendor-profile/brands",
        },
        {
          icon: Truck,
          label: "Shipping & Returns",
          path: "/dashboard/product-vendor-profile/shipping",
        },
        {
          icon: Award,
          label: "Certifications",
          path: "/dashboard/product-vendor-profile/certifications",
        },
        {
          icon: CreditCard,
          label: "Payment Settings",
          path: "/dashboard/product-vendor-profile/payment",
        },
      ],
    },
    {
      icon: Crown,
      label: "Subscription",
      path: "/dashboard/subscription",
      submenu: [
        { icon: Crown, label: "My Plan", path: "/dashboard/subscription/plans" },
        { icon: Receipt, label: "Transactions", path: "/dashboard/subscription/transactions" },
      ],
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
      submenu: [
        {
          icon: Clock,
          label: "New Requests",
          path: "/dashboard/logistics-vendor-requests/new",
        },
        {
          icon: Clock,
          label: "Pending",
          path: "/dashboard/logistics-vendor-requests/pending",
        },
        {
          icon: CheckCircle,
          label: "Assigned",
          path: "/dashboard/logistics-vendor-requests/assigned",
        },
        {
          icon: CheckCircle,
          label: "Completed",
          path: "/dashboard/logistics-vendor-requests/completed",
        },
      ],
    },
    {
      icon: Clipboard,
      label: "Deliveries",
      path: "/dashboard/logistics-vendor-deliveries",
      submenu: [
        {
          icon: Truck,
          label: "In Transit",
          path: "/dashboard/logistics-vendor-deliveries/transit",
        },
        {
          icon: CheckCircle,
          label: "Completed",
          path: "/dashboard/logistics-vendor-deliveries/completed",
        },
        {
          icon: XCircle,
          label: "Failed/Returned",
          path: "/dashboard/logistics-vendor-deliveries/failed",
        },
      ],
    },
    {
      icon: Package,
      label: "Fleet",
      path: "/dashboard/logistics-vendor-fleet",
      submenu: [
        {
          icon: Truck,
          label: "Vehicles",
          path: "/dashboard/logistics-vendor-fleet/vehicles",
        },
        {
          icon: Wrench,
          label: "Maintenance",
          path: "/dashboard/logistics-vendor-fleet/maintenance",
        },
        {
          icon: Users,
          label: "Drivers & Personnel",
          path: "/dashboard/logistics-vendor-fleet/drivers",
        },
      ],
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/dashboard/logistics-vendor-messages",
    },
    {
      icon: Users,
      label: "Team",
      path: "/dashboard/team",
      submenu: [
        {
          icon: Users,
          label: "Team Members",
          path: "/dashboard/team/members",
        },
        {
          icon: Shield,
          label: "Role Management",
          path: "/dashboard/team/roles",
        },
      ],
    },
    {
      icon: MapPin,
      label: "Tracking",
      path: "/dashboard/logistics-vendor-tracking",
      submenu: [
        {
          icon: MapPin,
          label: "Live Tracking",
          path: "/dashboard/logistics-vendor-tracking/live",
        },
        {
          icon: Clock,
          label: "Route History",
          path: "/dashboard/logistics-vendor-tracking/history",
        },
      ],
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/dashboard/vendor-settings",
      submenu: [
        {
          icon: Building,
          label: "Company Profile",
          path: "/dashboard/vendor-settings",
        },
        {
          icon: MapPin,
          label: "Service Areas",
          path: "/dashboard/logistics-vendor-profile/service-areas",
        },
        {
          icon: Award,
          label: "Licenses & Permits",
          path: "/dashboard/logistics-vendor-profile/licenses",
        },
        {
          icon: CreditCard,
          label: "Payment Settings",
          path: "/dashboard/logistics-vendor-profile/payment",
        },
      ],
    },
    {
      icon: Crown,
      label: "Subscription",
      path: "/dashboard/subscription",
      submenu: [
        { icon: Crown, label: "My Plan", path: "/dashboard/subscription/plans" },
        { icon: Receipt, label: "Transactions", path: "/dashboard/subscription/transactions" },
      ],
    },
  ],
};
