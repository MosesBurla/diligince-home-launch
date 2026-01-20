import { 
  Factory, 
  Wrench, 
  Package, 
  Truck, 
  UserCheck,
  Network,
  Sparkles,
  FileSearch,
  Bot,
  BarChart3,
  Check,
  X
} from 'lucide-react';

export type UserType = 'industry' | 'service_vendor' | 'product_vendor' | 'logistics' | 'professional';

export interface PlanFeature {
  name: string;
  included: boolean | string;
  tooltip?: string;
}

export interface Plan {
  code: string;
  name: string;
  tier: 'free' | 'plus' | 'pro' | 'enterprise';
  price: number | null;
  priceRange?: { min: number; max: number };
  currency: string;
  billingCycle: string;
  description: string;
  shortDescription: string;
  highlights: string[];
  isPopular?: boolean;
  isCustomPricing?: boolean;
  ctaLabel: string;
  ctaAction: 'signup' | 'subscribe' | 'contact';
}

export interface AddOn {
  code: string;
  name: string;
  type: 'subscription' | 'usage';
  price: number;
  currency: string;
  billingCycle?: string;
  icon: string;
  description: string;
  shortDescription: string;
  featureList: string[];
  compatibleUserTypes: UserType[];
  limits?: {
    credits?: number;
    validityDays?: number;
    generationsPerMonth?: number;
    reportsPerMonth?: number;
  };
}

export interface UserTypeConfig {
  id: UserType;
  label: string;
  shortLabel: string;
  icon: typeof Factory;
  description: string;
  color: string;
}

export const userTypes: UserTypeConfig[] = [
  {
    id: 'industry',
    label: 'Industry',
    shortLabel: 'Industry',
    icon: Factory,
    description: 'For manufacturing companies managing procurement, vendors, and supply chain operations.',
    color: 'hsl(var(--primary))'
  },
  {
    id: 'service_vendor',
    label: 'Service Vendor',
    shortLabel: 'Service',
    icon: Wrench,
    description: 'For service providers offering maintenance, engineering, and technical services to industries.',
    color: 'hsl(210, 64%, 35%)'
  },
  {
    id: 'product_vendor',
    label: 'Product Vendor',
    shortLabel: 'Product',
    icon: Package,
    description: 'For suppliers and manufacturers selling products, equipment, and materials to industries.',
    color: 'hsl(210, 64%, 40%)'
  },
  {
    id: 'logistics',
    label: 'Logistics',
    shortLabel: 'Logistics',
    icon: Truck,
    description: 'For transportation and logistics companies providing freight and delivery services.',
    color: 'hsl(210, 64%, 45%)'
  },
  {
    id: 'professional',
    label: 'Professional',
    shortLabel: 'Expert',
    icon: UserCheck,
    description: 'For consultants, engineers, and experts offering specialized professional services.',
    color: 'hsl(210, 64%, 50%)'
  }
];

export const industryPlans: Plan[] = [
  {
    code: 'INDUSTRY_STARTER',
    name: 'Starter',
    tier: 'plus',
    price: 3999,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Perfect for small manufacturing units starting their digital procurement journey. Get organized with basic AI assistance and essential workflow tools.',
    shortDescription: 'Start your digital procurement journey',
    highlights: [
      'Team of 3 members',
      '10 requirements/month',
      '30 RFQs/month',
      '10 POs/month',
      'Basic AI search',
      'Diligince Bot (Helper)',
      '30-day advanced analytics trial'
    ],
    ctaLabel: 'Get Started',
    ctaAction: 'signup'
  },
  {
    code: 'INDUSTRY_GROWTH',
    name: 'Growth',
    tier: 'pro',
    priceRange: { min: 12000, max: 20000 },
    price: null,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Scale your procurement operations with advanced AI capabilities, larger team support, and comprehensive analytics for growing businesses.',
    shortDescription: 'Scale with advanced AI & analytics',
    highlights: [
      'Team of 10-25 members',
      '50-100 requirements/month',
      '150-300 RFQs/month',
      '50-100 POs/month',
      'Advanced AI search',
      'Bot V2 included',
      'Advanced analytics'
    ],
    isPopular: true,
    ctaLabel: 'Contact Sales',
    ctaAction: 'contact'
  },
  {
    code: 'INDUSTRY_ENTERPRISE',
    name: 'Enterprise',
    tier: 'enterprise',
    price: null,
    currency: 'INR',
    billingCycle: 'monthly',
    isCustomPricing: true,
    description: 'Enterprise-grade procurement platform with unlimited capabilities, dedicated support, and custom integrations for large organizations.',
    shortDescription: 'Custom enterprise solution',
    highlights: [
      'Unlimited team size',
      'Custom usage limits',
      'Enterprise AI features',
      'Dedicated support',
      'All add-ons included',
      'Custom integrations',
      'SLA guarantees'
    ],
    ctaLabel: 'Contact Sales',
    ctaAction: 'contact'
  }
];

export const serviceVendorPlans: Plan[] = [
  {
    code: 'SERVICE_VENDOR_FREE',
    name: 'Free',
    tier: 'free',
    price: 0,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Start winning service contracts at no cost. List your company, respond to RFQs, and build your reputation on the platform.',
    shortDescription: 'Start winning contracts for free',
    highlights: [
      '1 team member',
      '10 applications/month',
      '2 active bids',
      'Basic company listing',
      'RFQ participation',
      'Work progress tracking'
    ],
    ctaLabel: 'Get Started Free',
    ctaAction: 'signup'
  },
  {
    code: 'SERVICE_VENDOR_PLUS',
    name: 'Plus',
    tier: 'plus',
    price: 2499,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Expand your reach with verified badge, full requirement access, and basic analytics to track your performance.',
    shortDescription: 'Expand reach with verified badge',
    highlights: [
      '3 team members',
      '60 applications/month',
      '10 active bids',
      'Verified badge ✓',
      'Full feed access',
      'Basic analytics'
    ],
    isPopular: true,
    ctaLabel: 'Subscribe Now',
    ctaAction: 'subscribe'
  },
  {
    code: 'SERVICE_VENDOR_PRO',
    name: 'Pro',
    tier: 'pro',
    price: 6999,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Maximize your service business with priority visibility, advanced analytics, and AI-powered assistance for winning more contracts.',
    shortDescription: 'Maximize wins with AI assistance',
    highlights: [
      '10 team members',
      '200 applications/month',
      '30 active bids',
      'Priority feed access',
      'Advanced analytics',
      '50 AI credits/month'
    ],
    ctaLabel: 'Subscribe Now',
    ctaAction: 'subscribe'
  }
];

export const productVendorPlans: Plan[] = [
  {
    code: 'PRODUCT_VENDOR_FREE',
    name: 'Free',
    tier: 'free',
    price: 0,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Showcase your products to industries. Create a basic catalog and start receiving RFQ invitations.',
    shortDescription: 'Showcase products for free',
    highlights: [
      '1 team member',
      '25 catalog items',
      '15 RFQ responses/month',
      'Basic company listing',
      'Catalog management',
      'Work tracking'
    ],
    ctaLabel: 'Get Started Free',
    ctaAction: 'signup'
  },
  {
    code: 'PRODUCT_VENDOR_PLUS',
    name: 'Plus',
    tier: 'plus',
    price: 1999,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Grow your product business with expanded catalog, verified badge, and better visibility to potential buyers.',
    shortDescription: 'Grow with expanded catalog',
    highlights: [
      '3 team members',
      '250 catalog items',
      '100 RFQ responses/month',
      'Verified badge ✓',
      'Full feed access',
      'Basic analytics'
    ],
    isPopular: true,
    ctaLabel: 'Subscribe Now',
    ctaAction: 'subscribe'
  },
  {
    code: 'PRODUCT_VENDOR_PRO',
    name: 'Pro',
    tier: 'pro',
    price: 4999,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Premium product vendor experience with large catalog support, priority placement, and AI-powered sales assistance.',
    shortDescription: 'Premium with AI-powered sales',
    highlights: [
      '10 team members',
      '2000 catalog items',
      '300 RFQ responses/month',
      'Priority feed access',
      'Advanced analytics',
      '50 AI credits/month'
    ],
    ctaLabel: 'Subscribe Now',
    ctaAction: 'subscribe'
  }
];

export const logisticsPlans: Plan[] = [
  {
    code: 'LOGISTICS_FREE',
    name: 'Free',
    tier: 'free',
    price: 0,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Start your logistics partnership journey. Get listed and respond to transportation requirements.',
    shortDescription: 'Start logistics partnership',
    highlights: [
      '1 team member',
      '10 applications/month',
      '2 active jobs',
      'Basic company listing',
      'Job tracking',
      'Invoicing'
    ],
    ctaLabel: 'Get Started Free',
    ctaAction: 'signup'
  },
  {
    code: 'LOGISTICS_PLUS',
    name: 'Plus',
    tier: 'plus',
    price: 1499,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Expand your logistics operations with more job capacity, verified badge, and performance tracking.',
    shortDescription: 'Expand with verification',
    highlights: [
      '3 team members',
      '80 applications/month',
      '10 active jobs',
      'Verified badge ✓',
      'Full feed access',
      'Basic analytics'
    ],
    isPopular: true,
    ctaLabel: 'Subscribe Now',
    ctaAction: 'subscribe'
  },
  {
    code: 'LOGISTICS_PRO',
    name: 'Pro',
    tier: 'pro',
    price: 3999,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Full-scale logistics operations with priority access to high-value shipments and AI-powered optimization.',
    shortDescription: 'Scale with AI optimization',
    highlights: [
      '10 team members',
      '250 applications/month',
      '25 active jobs',
      'Priority feed access',
      'Advanced analytics',
      '40 AI credits/month'
    ],
    ctaLabel: 'Subscribe Now',
    ctaAction: 'subscribe'
  }
];

export const professionalPlans: Plan[] = [
  {
    code: 'EXPERT_FREE',
    name: 'Free',
    tier: 'free',
    price: 0,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Build your professional profile and get discovered by industries seeking expert consultation.',
    shortDescription: 'Get discovered for free',
    highlights: [
      '5 applications/month',
      '1 active engagement',
      'Professional profile',
      'Limited feed access',
      'Basic messaging',
      'Milestone tracking'
    ],
    ctaLabel: 'Get Started Free',
    ctaAction: 'signup'
  },
  {
    code: 'EXPERT_PLUS',
    name: 'Plus',
    tier: 'plus',
    price: 999,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Unlock more opportunities with full requirement access, verified profile option, and basic analytics.',
    shortDescription: 'Unlock more opportunities',
    highlights: [
      '25 applications/month',
      '3 active engagements',
      'Full feed access',
      'Optional verification',
      'Basic analytics',
      'Direct messaging'
    ],
    isPopular: true,
    ctaLabel: 'Subscribe Now',
    ctaAction: 'subscribe'
  },
  {
    code: 'EXPERT_PRO',
    name: 'Pro',
    tier: 'pro',
    price: 2999,
    currency: 'INR',
    billingCycle: 'monthly',
    description: 'Premium expert access with priority visibility, advanced analytics, and AI-powered proposal assistance.',
    shortDescription: 'Premium with AI proposals',
    highlights: [
      '100 applications/month',
      '10 active engagements',
      'Priority visibility',
      'Verified badge ✓',
      'Advanced analytics',
      '30 AI credits/month'
    ],
    ctaLabel: 'Subscribe Now',
    ctaAction: 'subscribe'
  }
];

export const plansByUserType: Record<UserType, Plan[]> = {
  industry: industryPlans,
  service_vendor: serviceVendorPlans,
  product_vendor: productVendorPlans,
  logistics: logisticsPlans,
  professional: professionalPlans
};

export const addOns: AddOn[] = [
  {
    code: 'DILIGIENCE_HUB',
    name: 'Diligince Hub',
    type: 'subscription',
    price: 999,
    currency: 'INR',
    billingCycle: 'monthly',
    icon: 'network',
    description: 'Connect, network, and collaborate across the entire Diligince ecosystem. Access verified vendors, professionals, and industry contacts.',
    shortDescription: 'Networking & collaboration platform',
    featureList: [
      'Industry-vendor networking',
      'Professional connections',
      'Verified profiles directory',
      'Enhanced messaging'
    ],
    compatibleUserTypes: ['industry', 'service_vendor', 'product_vendor', 'logistics', 'professional']
  },
  {
    code: 'AI_RECOMMENDATION_PACK',
    name: 'AI Recommendation Pack',
    type: 'usage',
    price: 499,
    currency: 'INR',
    icon: 'sparkles',
    description: 'Get 20 AI-powered vendor and product recommendations tailored to your requirements.',
    shortDescription: '20 AI vendor recommendations',
    featureList: [
      '20 AI recommendation credits',
      'Smart vendor matching',
      'Requirement analysis',
      'Valid for 90 days'
    ],
    compatibleUserTypes: ['industry'],
    limits: { credits: 20, validityDays: 90 }
  },
  {
    code: 'AI_QUOTATION_ANALYSIS_PACK',
    name: 'AI Quotation Analysis',
    type: 'usage',
    price: 499,
    currency: 'INR',
    icon: 'file-search',
    description: 'Analyze quotations intelligently with AI. Compare prices and identify discrepancies.',
    shortDescription: '20 AI quotation analyses',
    featureList: [
      '20 quotation analysis credits',
      'Price comparison',
      'Terms analysis',
      'Valid for 90 days'
    ],
    compatibleUserTypes: ['industry'],
    limits: { credits: 20, validityDays: 90 }
  },
  {
    code: 'BOT_V2_UPGRADE',
    name: 'Bot V2 Upgrade',
    type: 'subscription',
    price: 499,
    currency: 'INR',
    billingCycle: 'monthly',
    icon: 'bot',
    description: 'Upgrade to Diligince Bot V2 for smarter AI assistance and document generation.',
    shortDescription: 'Advanced AI bot capabilities',
    featureList: [
      '30 AI generations/month',
      'Document creation',
      'Data analysis',
      'Workflow automation'
    ],
    compatibleUserTypes: ['industry'],
    limits: { generationsPerMonth: 30 }
  },
  {
    code: 'AI_ADVANCED_ANALYTICS',
    name: 'AI Advanced Analytics',
    type: 'subscription',
    price: 499,
    currency: 'INR',
    billingCycle: 'monthly',
    icon: 'chart-bar',
    description: 'Unlock advanced analytics dashboards with AI-powered insights and trend analysis.',
    shortDescription: 'Advanced analytics & insights',
    featureList: [
      '20 AI reports/month',
      'Trend analysis',
      'Predictive insights',
      'Custom dashboards'
    ],
    compatibleUserTypes: ['industry'],
    limits: { reportsPerMonth: 20 }
  }
];

export const getAddOnsForUserType = (userType: UserType): AddOn[] => {
  return addOns.filter(addon => addon.compatibleUserTypes.includes(userType));
};

export const getIconComponent = (iconName: string) => {
  const icons: Record<string, typeof Network> = {
    'network': Network,
    'sparkles': Sparkles,
    'file-search': FileSearch,
    'bot': Bot,
    'chart-bar': BarChart3
  };
  return icons[iconName] || Sparkles;
};

export const faqData = [
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated based on your usage.'
  },
  {
    question: 'What happens to my data if I downgrade?',
    answer: 'Your data is always preserved. However, some features may become limited based on your new plan. You can upgrade again anytime to restore full access.'
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'No hidden fees. We charge a 5% transaction fee only on successful transactions processed through the platform. All plan features are included in the subscription price.'
  },
  {
    question: 'Do you offer annual discounts?',
    answer: 'Annual billing options with discounts are coming soon. Contact our sales team for enterprise volume discounts.'
  },
  {
    question: 'Can I try before I buy?',
    answer: 'Yes! We offer free plans for vendors and professionals. Industry users get a 30-day trial of advanced analytics. You can also start with lower-tier plans and upgrade as needed.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI, and net banking. Enterprise customers can also pay via invoice with bank transfer.'
  }
];
