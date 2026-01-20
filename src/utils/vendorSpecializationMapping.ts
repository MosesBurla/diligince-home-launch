// specialization-utils.ts

import type { VendorSpecialization } from "@/contexts/VendorSpecializationContext";

/**
 * Vendor specialization options per category
 * Updated to match API documentation requirements
 */
export const vendorSpecializations = {
  'Service Vendor': [
    'IT Services & Consulting',
    'Maintenance & Repair',
    'Professional Services',
    'Staffing & Recruitment',
    'Facility Management',
    'Security Services',
    'Catering & Hospitality',
    'Other Services'
  ],
  'Product Vendor': [
    'Manufacturing',
    'Trading & Distribution',
    'Wholesale',
    'Raw Materials',
    'Equipment & Machinery',
    'Electronics & Components',
    'Packaging Materials',
    'Other Products'
  ],
  'Logistics Vendor': [
    'Road Transport',
    'Warehousing',
    'Courier & Express',
    'Cold Chain Logistics',
    'Container Services',
    'Last Mile Delivery',
    'International Freight',
    'Other Logistics'
  ]
};

/**
 * Map signup form specialization strings to the internal VendorSpecialization type
 */
export const mapSignupToSpecialization = (
  signupSpecialization: string
): VendorSpecialization => {
  const mappings: Record<string, VendorSpecialization> = {
    "Transportation Services": "transportation",
    "Supply Chain Solutions": "freight-forwarding",
    "Bulk Material Transport": "specialized-transport",
    "Hazardous Material Transport": "specialized-transport",
    "Cold Chain Logistics": "freight-forwarding",
    "Heavy Equipment Rental": "heavy-equipment",
    "Crane Services": "crane-services",
    "Forklift Rental": "heavy-equipment",
    "Warehouse Management": "warehouse",
    "Inventory Management": "warehouse",
  };

  // Fallback to "transportation" if nothing matches
  return mappings[signupSpecialization] || "transportation";
};

/**
 * Get display name for a VendorSpecialization
 */
export const getSpecializationDisplayName = (
  specialization: VendorSpecialization
): string => {
  const displayNames: Record<VendorSpecialization, string> = {
    transportation: "Transportation Services",
    "heavy-equipment": "Heavy Equipment",
    "crane-services": "Crane Services",
    warehouse: "Warehouse Management",
    "freight-forwarding": "Freight Forwarding",
    "specialized-transport": "Specialized Transport",
  };

  return displayNames[specialization];
};

/**
 * Get Tailwind CSS badge color classes for a VendorSpecialization
 */
export const getSpecializationBadgeColor = (
  specialization: VendorSpecialization
): string => {
  const colors: Record<VendorSpecialization, string> = {
    transportation: "bg-primary/10 text-primary",
    "heavy-equipment": "bg-orange-100 text-orange-800",
    "crane-services": "bg-purple-100 text-purple-800",
    warehouse: "bg-green-100 text-green-800",
    "freight-forwarding": "bg-indigo-100 text-indigo-800",
    "specialized-transport": "bg-red-100 text-red-800",
  };

  return colors[specialization];
};
