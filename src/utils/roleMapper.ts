import { UserProfile, VendorCategory, mapUserSubTypeToVendorCategory } from '@/types/shared';

/**
 * Maps API role/userType to UserContext role format
 * API userType: 'Industry' | 'Professional' | 'Vendor'
 * UserContext role: 'industry' | 'professional' | 'vendor'
 */
export const mapApiRoleToUserRole = (
  apiRole: string,
  userType?: string
): 'industry' | 'professional' | 'vendor' => {
  // Use userType if available (preferred)
  if (userType) {
    if (userType === 'Vendor') return 'vendor';
    if (userType === 'Industry') return 'industry';
    if (userType === 'Professional') return 'professional';
  }
  
  // Fallback to role string matching for backward compatibility
  if (apiRole.includes('Vendor')) return 'vendor';
  if (apiRole === 'IndustryAdmin' || apiRole === 'IndustryMember') return 'industry';
  if (apiRole === 'Professional') return 'professional';
  
  return 'industry'; // Default fallback
};

/**
 * Maps UserContext role to menuConfig key
 * Handles vendor categories: 'service-vendor', 'product-vendor', 'logistics-vendor'
 */
export const getMenuConfigKey = (user: UserProfile): string => {
  if (user.role === 'vendor') {
    // Prefer userSubType, fallback to profile.vendorCategory
    const vendorCategory: VendorCategory | undefined = user.userSubType 
      ? mapUserSubTypeToVendorCategory(user.userSubType)
      : user.profile?.vendorCategory;
      
    if (vendorCategory) {
      return `${vendorCategory}-vendor`;
    }
  }
  return user.role;
};

// Re-export for convenience
export { mapUserSubTypeToVendorCategory };
