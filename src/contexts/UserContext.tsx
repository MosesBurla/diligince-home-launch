
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile, UserRole, UserPreferences, getDashboardRoute } from '@/types/shared';
import { calculateProfileCompleteness, ProfileCompletion } from '@/utils/profileCompleteness';
import { api } from '@/services/api.service';
import { apiRoutes } from '@/services/api.routes';
import { companyProfileRoutes } from '@/services/modules/company-profile/company-profile.routes';
import { vendorProfileRoutes } from '@/services/modules/vendor-profile/vendor-profile.routes';
import { mapApiRoleToUserRole } from '@/utils/roleMapper';
import { VerificationStatus } from '@/types/verification';
import { toast } from 'sonner';

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  verify2FA: (twoFactorToken: string, code: string) => Promise<{success: boolean, error?: string}>;
  logout: () => void;
  getDashboardUrl: () => string;
  isUserType: (role: UserRole) => boolean;
  isVendorCategory: (category: string) => boolean;
  profileCompletion: ProfileCompletion;
  isFirstTimeUser: boolean;
  setFirstTimeUser: (isFirst: boolean) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  verificationStatus: VerificationStatus;
  canAccessDashboard: boolean;
  refreshVerificationStatus: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  notifications: {
    email: true,
    push: true,
    sms: false,
    marketing: false,
  },
  language: 'en',
  timezone: 'UTC',
};

const defaultProfileCompletion: ProfileCompletion = {
  percentage: 0,
  isComplete: false,
  missingFields: [],
  completedFields: []
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState<ProfileCompletion>(defaultProfileCompletion);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(VerificationStatus.INCOMPLETE);
  
  const canAccessDashboard = verificationStatus === VerificationStatus.APPROVED;

  useEffect(() => {
    // Load user data from localStorage on mount
    const loadUserData = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedOnboarding = localStorage.getItem('hasCompletedOnboarding');
        const savedVerificationStatus = localStorage.getItem('verificationStatus');
        
        if (savedUser) {
          const userData = JSON.parse(savedUser) as UserProfile;
          console.log("Loaded user from localStorage:", userData);
          setUser(userData);
          setHasCompletedOnboarding(savedOnboarding === 'true');
          
          // Calculate profile completion immediately
          const completion = calculateProfileCompleteness(userData);
          setProfileCompletion(completion);
          
          // Load verification status from API
          try {
            // First, set the cached status if available (instant UI update)
            if (savedVerificationStatus) {
              const cachedStatus = savedVerificationStatus as VerificationStatus;
              setVerificationStatus(cachedStatus);
              console.log('Loaded cached verification status:', cachedStatus);
            }
            
            // Then fetch fresh status from API
            let apiStatus: string | undefined;
            
            if (userData.role === 'industry') {
              const profileResponse = await api.get(companyProfileRoutes.get);
              apiStatus = profileResponse?.data?.data?.profile?.verificationStatus;
            } else if (userData.role === 'vendor') {
              const profileResponse = await api.get(vendorProfileRoutes.get);
              apiStatus = profileResponse?.data?.data?.profile?.verificationStatus;
            }
            
            if (apiStatus) {
              const mappedStatus = apiStatus as VerificationStatus;
              setVerificationStatus(mappedStatus);
              localStorage.setItem('verificationStatus', mappedStatus);
              console.log('Updated verification status from API:', mappedStatus);
            }
          } catch (error) {
            console.error('Error loading verification status:', error);
            // Don't override with INCOMPLETE if we have a cached status
            if (!savedVerificationStatus) {
              setVerificationStatus(VerificationStatus.INCOMPLETE);
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('hasCompletedOnboarding');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    // Save user data and recalculate profile completion whenever user changes
    if (user) {
      console.log("Saving user to localStorage and recalculating completion:", user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Recalculate profile completion
      const completion = calculateProfileCompleteness(user);
      console.log("New profile completion:", completion);
      setProfileCompletion(completion);
    } else {
      localStorage.removeItem('user');
      setProfileCompletion(defaultProfileCompletion);
    }
  }, [user]);

  useEffect(() => {
    // Save onboarding state
    localStorage.setItem('hasCompletedOnboarding', hasCompletedOnboarding.toString());
  }, [hasCompletedOnboarding]);

  useEffect(() => {
    // Save verification status to localStorage whenever it changes
    if (verificationStatus) {
      localStorage.setItem('verificationStatus', verificationStatus);
    }
  }, [verificationStatus]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    console.log("Updating profile with:", updates);
    setUser(current => {
      if (!current) return null;
      const updatedUser = {
        ...current,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      console.log("Updated user:", updatedUser);
      return updatedUser;
    });
  };

  const updatePreferences = (preferenceUpdates: Partial<UserPreferences>) => {
    if (!user) return;
    
    setUser(current => {
      if (!current) return null;
      return {
        ...current,
        preferences: {
          ...current.preferences,
          ...preferenceUpdates,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('[Auth] Attempting API login...');
      const response: any = await api.post(apiRoutes.auth.login, { email, password });
      
      // Parse the response - handle API structure: response.data.data
      const responseData = response?.data || response;
      const userData = responseData?.data;
      
      if (userData?.access_token && userData?.user) {
        console.log('[Auth] API login successful');
        
        // Store authentication tokens
        localStorage.setItem('authToken', userData.access_token);
        localStorage.setItem('refreshToken', userData.refresh_token);
        
        // Validate and store roleConfiguration for permissions
        const roleConfig = userData.user.roleConfiguration;
        if (!roleConfig || !roleConfig.permissions || roleConfig.permissions.length === 0) {
          toast.error("Don't have any Module Access");
          return { success: false, error: "No module access configured for this account" };
        }
        
        // Check if user has at least one readable module
        const hasAnyAccess = roleConfig.permissions.some((m: any) => 
          m.permissions?.read === true || 
          m.submodules?.some((s: any) => s.permissions?.read === true)
        );
        
        if (!hasAnyAccess) {
          toast.error("Don't have any Module Access");
          return { success: false, error: "No module access configured for this account" };
        }
        
        // Store valid permissions
        localStorage.setItem('roleConfiguration', JSON.stringify(roleConfig));
        // Dispatch event to update permissions context
        window.dispatchEvent(new CustomEvent('permissions:update', { 
          detail: roleConfig 
        }));
        
        const apiUser = userData.user;
        const userProfile: UserProfile = {
          id: apiUser.id,
          name: apiUser.profile ? `${apiUser.profile.firstName} ${apiUser.profile.lastName}` : apiUser.email,
          email: apiUser.email,
          role: mapApiRoleToUserRole(apiUser.role),
          profile: {
            vendorCategory: apiUser.profile?.vendorCategory,
            companyName: apiUser.profile?.companyName,
            firstName: apiUser.profile?.firstName,
            lastName: apiUser.profile?.lastName,
          },
          preferences: defaultPreferences,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setUser(userProfile);
        setIsFirstTimeUser(!apiUser.profile?.isProfileComplete);
        
        // Fetch verification status for the logged-in user
        setTimeout(async () => {
          try {
            let apiStatus: string | undefined;
            
            if (userProfile.role === 'industry') {
              const response = await api.get(companyProfileRoutes.get);
              apiStatus = response?.data?.data?.profile?.verificationStatus;
            } else if (userProfile.role === 'vendor') {
              const response = await api.get(vendorProfileRoutes.get);
              apiStatus = response?.data?.data?.profile?.verificationStatus;
            }
            
            if (apiStatus) {
              const mappedStatus = apiStatus as VerificationStatus;
              setVerificationStatus(mappedStatus);
              localStorage.setItem('verificationStatus', mappedStatus);
              console.log('Loaded verification status after login:', mappedStatus);
            }
          } catch (error) {
            console.error('Error loading verification status after login:', error);
          }
        }, 100);
        
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error: any) {
      console.error('[Auth] Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Authentication failed. Please check your credentials.' 
      };
    }
  }, []);

  const verify2FA = useCallback(async (twoFactorToken: string, code: string) => {
    try {
      console.log('[Auth] Attempting 2FA verification...');
      const response: any = await api.post(apiRoutes.auth.verify2FA, { twoFactorToken, code });
      
      const responseData = response?.data || response;
      const userData = responseData?.data;
      
      if (userData?.access_token && userData?.user) {
        console.log('[Auth] 2FA verification successful');
        
        // Store authentication tokens
        localStorage.setItem('authToken', userData.access_token);
        localStorage.setItem('refreshToken', userData.refresh_token);
        
        // Validate and store roleConfiguration for permissions
        const roleConfig = userData.user.roleConfiguration;
        if (!roleConfig || !roleConfig.permissions || roleConfig.permissions.length === 0) {
          toast.error("Don't have any Module Access");
          return { success: false, error: "No module access configured for this account" };
        }
        
        // Check if user has at least one readable module
        const hasAnyAccess = roleConfig.permissions.some((m: any) => 
          m.permissions?.read === true || 
          m.submodules?.some((s: any) => s.permissions?.read === true)
        );
        
        if (!hasAnyAccess) {
          toast.error("Don't have any Module Access");
          return { success: false, error: "No module access configured for this account" };
        }
        
        // Store valid permissions
        localStorage.setItem('roleConfiguration', JSON.stringify(roleConfig));
        window.dispatchEvent(new CustomEvent('permissions:update', { 
          detail: roleConfig 
        }));
        
        const apiUser = userData.user;
        const userProfile: UserProfile = {
          id: apiUser.id,
          name: apiUser.profile ? `${apiUser.profile.firstName} ${apiUser.profile.lastName}` : apiUser.email,
          email: apiUser.email,
          role: mapApiRoleToUserRole(apiUser.role),
          profile: {
            vendorCategory: apiUser.profile?.vendorCategory,
            companyName: apiUser.profile?.companyName,
            firstName: apiUser.profile?.firstName,
            lastName: apiUser.profile?.lastName,
          },
          preferences: defaultPreferences,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setUser(userProfile);
        setIsFirstTimeUser(!apiUser.profile?.isProfileComplete);
        
        return { success: true };
      }
      return { success: false, error: 'Verification failed' };
    } catch (error: any) {
      console.error('[Auth] 2FA verification failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Two-factor authentication failed.' 
      };
    }
  }, []);

  const logout = useCallback(() => {
    console.log("Logging out user");
    setUser(null);
    setIsFirstTimeUser(false);
    setHasCompletedOnboarding(false);
    localStorage.removeItem('user');
    localStorage.removeItem('hasCompletedOnboarding');
    localStorage.removeItem('verificationStatus');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roleConfiguration');
    localStorage.removeItem('userPermissions');
    localStorage.removeItem('isMockAuth'); // Clear mock auth flag
    localStorage.clear();
  }, []);

  const getDashboardUrl = (): string => {
    if (!user) return '/';
    return getDashboardRoute(user);
  };

  const isUserType = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const isVendorCategory = (category: string): boolean => {
    return user?.role === 'vendor' && user?.profile?.vendorCategory === category;
  };
  
  const refreshVerificationStatus = async () => {
    try {
      if (!user) return;
      
      let apiStatus: string | undefined;
      
      if (user.role === 'industry') {
        const response = await api.get(companyProfileRoutes.get);
        apiStatus = response?.data?.data?.profile?.verificationStatus;
      } else if (user.role === 'vendor') {
        const response = await api.get(vendorProfileRoutes.get);
        apiStatus = response?.data?.data?.profile?.verificationStatus;
      }
      
      if (apiStatus) {
        const mappedStatus = apiStatus as VerificationStatus;
        setVerificationStatus(mappedStatus);
        localStorage.setItem('verificationStatus', mappedStatus);
        console.log('Refreshed verification status:', mappedStatus);
        
        if (mappedStatus === VerificationStatus.APPROVED) {
          toast.success('Profile verification completed!');
        }
      }
    } catch (error) {
      console.error('Error refreshing verification status:', error);
      toast.error('Failed to refresh verification status');
    }
  };

  const value: UserContextType = {
    user,
    setUser,
    isAuthenticated: !!user,
    isLoading,
    updateProfile,
    updatePreferences,
    login,
    verify2FA,
    logout,
    getDashboardUrl,
    isUserType,
    isVendorCategory,
    profileCompletion,
    isFirstTimeUser,
    setFirstTimeUser: setIsFirstTimeUser,
    hasCompletedOnboarding,
    setHasCompletedOnboarding,
    verificationStatus,
    canAccessDashboard,
    refreshVerificationStatus,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
