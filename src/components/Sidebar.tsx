import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { menuConfig } from '@/config/menuConfig';
import { getMenuConfigKey } from '@/utils/roleMapper';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, User, LogOut, Settings as SettingsIcon, Lock } from 'lucide-react';
import { VerificationStatus } from '@/types/verification';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/usePermissions';

const Sidebar: React.FC = () => {
  const { user, logout, verificationStatus } = useUser();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { isLoading, permissionsMap, pathToModuleMap, hierarchicalConfig } = usePermissions();
  
  const canAccessFeature = verificationStatus === VerificationStatus.APPROVED;

  if (!user) return null;

  const menuKey = getMenuConfigKey(user) as keyof typeof menuConfig;
  const rawMenuItems = menuConfig[menuKey] || [];

  // Filter menu items based on permissions - strict filtering
  const menuItems = useMemo(() => {
    // If no hierarchical config, don't show any menu items
    if (!hierarchicalConfig) {
      return [];
    }

    return rawMenuItems
      .map(item => {
        // Filter submenus based on read permission
        const filteredSubmenu = item.submenu?.filter(subItem => {
          const moduleId = pathToModuleMap.get(subItem.path);
          if (!moduleId) {
            // Hide if not in permission config
            return false;
          }
          const perm = permissionsMap.get(moduleId);
          // Only show if explicitly has read: true
          return perm?.permissions.read === true;
        });

        return { ...item, submenu: filteredSubmenu };
      })
      .filter(item => {
        // Check if parent item should be shown
        const moduleId = pathToModuleMap.get(item.path);
        if (!moduleId) {
          // Hide if not in permission config
          return false;
        }
        const perm = permissionsMap.get(moduleId);
        const hasAccess = perm?.permissions.read === true;
        
        // Show if has access OR has accessible submenus
        const hasAccessibleSubmenus = item.submenu && item.submenu.length > 0;
        return hasAccess || hasAccessibleSubmenus;
      });
  }, [rawMenuItems, permissionsMap, pathToModuleMap, hierarchicalConfig]);

  // Auto-expand menu containing active route on mount/route change
  useEffect(() => {
    if (!isCollapsed && menuItems.length > 0) {
      const activeParent = menuItems.find(item => 
        item.submenu?.some(sub => 
          location.pathname === sub.path || location.pathname.startsWith(sub.path + '/')
        )
      );
      if (activeParent && !expandedMenus.includes(activeParent.path)) {
        setExpandedMenus(prev => [...prev, activeParent.path]);
      }
    }
  }, [location.pathname, menuItems, isCollapsed]);

  const handleLogout = () => {
    logout();
  };

  const toggleAccordion = (itemPath: string) => {
    if (isCollapsed) return;

    setExpandedMenus(prev =>
      prev.includes(itemPath)
        ? prev.filter(path => path !== itemPath)
        : [itemPath]
    );
  };

  const handleIconClick = (itemPath: string, hasSubmenu: boolean) => {
    if (isCollapsed && hasSubmenu) {
      setActiveSubmenu(activeSubmenu === itemPath ? null : itemPath);
    }
  };

  const userProfileItems = [
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      submenu: [
        { label: 'Account Settings', icon: SettingsIcon, path: '/settings/account-settings' },
        { label: 'Logout', icon: LogOut, path: '/logout', onClick: handleLogout }
      ]
    }
  ];

  return (
    <>
      <aside className={`${
        isCollapsed ? 'w-16' : 'w-80'
      } bg-primary border-r border-sidebar-border flex flex-col h-screen transition-all duration-300 relative z-40`}>
        {/* Header with Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className={`${isCollapsed ? 'justify-center position-relative' : 'justify-between'} flex items-center`}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-foreground rounded-md flex items-center justify-center font-bold">
                <img src='/logo-main-no-bg.svg' alt="Logo" className="w-full h-full object-contain" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold text-primary-foreground">Deligence.ai</span>
              )}
            </div>
            <button
              onClick={() => {
                setIsCollapsed(!isCollapsed);
                setActiveSubmenu(null);
              }}
              className={`p-2 text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded transition-colors ${isCollapsed ? 'justify-center absolute p-2 rounded transition-all' : 'justify-between'}`}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-2 relative">
          <nav className="space-y-2 flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2 p-4">
                <div className="h-10 bg-muted animate-pulse rounded-md"></div>
                <div className="h-10 bg-muted animate-pulse rounded-md"></div>
                <div className="h-10 bg-muted animate-pulse rounded-md"></div>
                <div className="h-10 bg-muted animate-pulse rounded-md"></div>
                <div className="h-10 bg-muted animate-pulse rounded-md"></div>
              </div>
            ) : !hierarchicalConfig || menuItems.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">No menu access available</p>
              </div>
            ) : (
              menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isExpanded = expandedMenus.includes(item.path);
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuActive = activeSubmenu === item.path;
              
              // Check if any child route is currently active
              const hasActiveChild = hasSubmenu && item.submenu!.some(
                subItem => location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/')
              );
              
              // Check if this item should be locked during verification
              // Allow access to settings pages for both industry and vendor users
              const isSettingsPage = item.path.includes('industry-settings') || 
                                     item.path.includes('vendor-settings') ||
                                     item.path.includes('service-vendor-profile') ||
                                     item.path.includes('product-vendor-profile') ||
                                     item.path.includes('logistics-vendor-profile');
              const isLocked = !canAccessFeature && !isSettingsPage;

              return (
                <div key={item.path} className="relative">
                  <div
                    onClick={(e) => {
                      if (isLocked) {
                        e.preventDefault();
                        toast.error('Complete profile verification to access this feature');
                        return;
                      }
                      if (hasSubmenu && !isCollapsed) {
                        e.preventDefault();
                        toggleAccordion(item.path);
                      } else if (hasSubmenu && isCollapsed) {
                        e.preventDefault();
                        handleIconClick(item.path, hasSubmenu);
                      }
                    }}
                    className={`flex items-center ${
                      isCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'space-x-3 px-3 py-3'
                    } rounded-md transition-colors relative ${
                      isActive || isSubmenuActive || hasActiveChild
                        ? 'bg-primary-foreground text-primary'
                        : 'text-primary-foreground hover:bg-primary-foreground hover:text-primary'
                    } ${hasSubmenu || isLocked ? 'cursor-pointer' : ''} ${isLocked ? 'opacity-50' : ''}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    {hasSubmenu && !isCollapsed ? (
                      <>
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium flex-1">{item.label}</span>
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-gray-400" />
                        ) : isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </>
                    ) : hasSubmenu && isCollapsed ? (
                      <Icon className="w-6 h-6" />
                    ) : isLocked ? (
                      <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : ''}`}>
                        <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0`} />
                        {!isCollapsed && (
                          <>
                            <span className="font-medium ml-3">{item.label}</span>
                            <Lock className="w-3 h-3 ml-auto text-gray-400" />
                          </>
                        )}
                      </div>
                    ) : (
                      <Link to={item.path} className={`flex items-center w-full ${isCollapsed ? 'justify-center' : ''}`}>
                        <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0`} />
                        {!isCollapsed && (
                          <span className="font-medium ml-3">{item.label}</span>
                        )}
                      </Link>
                    )}
                  </div>

                  {/* Submenu for expanded state */}
                  {!isCollapsed && hasSubmenu && isExpanded && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.submenu!.map((subItem, index) => (
                        <Link
                          key={index}
                          to={subItem.path}
                          className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            location.pathname === subItem.path
                              ? 'bg-accent text-accent-foreground'
                              : 'text-primary-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
            )}
          </nav>
        </div>

        {/* Profile Section */}
        <div className="p-2 border-t border-sidebar-border">
          {userProfileItems.map((item) => {
            const hasSubmenu = Array.isArray(item.submenu) && item.submenu.length > 0;
            const Icon = item.icon;
            const isExpanded = expandedMenus.includes(item.path);
            const isSubmenuActive = activeSubmenu === item.path;
            
            return (
              <div key={item.path} className="relative">
                <div
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'space-x-3 px-3 py-3'
                  } rounded-md text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors cursor-pointer ${
                    isSubmenuActive ? 'bg-primary-foreground text-primary' : ''
                  }`}
                  title={isCollapsed ? item.label : ''}
                  onClick={(e) => {
                    if (hasSubmenu && !isCollapsed) {
                      e.preventDefault();
                      toggleAccordion(item.path);
                    } else if (hasSubmenu && isCollapsed) {
                      e.preventDefault();
                      handleIconClick(item.path, hasSubmenu);
                    }
                  }}
                >
                  {hasSubmenu && !isCollapsed ? (
                    <>
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium flex-1">{user.name}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </>
                  ) : hasSubmenu && isCollapsed ? (
                    <Icon className="w-6 h-6" />
                  ) : (
                    <Link to={item.path} className={`flex items-center w-full ${isCollapsed ? 'justify-center' : ''}`}>
                      <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'} flex-shrink-0`} />
                      {!isCollapsed && (
                        <span className="font-medium ml-3">{item.label}</span>
                      )}
                    </Link>
                  )}
                </div>

                {/* Submenu for expanded state */}
                {!isCollapsed && hasSubmenu && isExpanded && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.submenu!.map((subItem, index) => (
                      subItem.onClick ? (
                        <button
                          key={index}
                          onClick={subItem.onClick}
                          className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors w-full text-left ${
                            location.pathname === subItem.path
                              ? 'bg-accent text-accent-foreground'
                              : 'text-primary-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.label}</span>
                        </button>
                      ) : (
                        <Link
                          key={index}
                          to={subItem.path}
                          className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            location.pathname === subItem.path
                              ? 'bg-accent text-accent-foreground'
                              : 'text-primary-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.label}</span>
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right-side submenu overlay for collapsed state */}
      {isCollapsed && activeSubmenu && (
        <>
          {/* Backdrop to close submenu */}
          <div 
            className="fixed inset-0 z-30 bg-transparent" 
            onClick={() => setActiveSubmenu(null)}
          />
          
          {/* Submenu panel - positioned absolutely to avoid overflow */}
          <div className="fixed left-16 top-0 bottom-0 w-72 bg-background border border-border shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="text-lg font-semibold text-foreground">
                {menuItems.find(item => item.path === activeSubmenu)?.label ||
                 userProfileItems.find(item => item.path === activeSubmenu)?.label}
              </h3>
            </div>
            <div className="p-4">
              <nav className="space-y-1">
                {/* Regular menu items submenu */}
                {menuItems
                  .find(item => item.path === activeSubmenu)
                  ?.submenu?.map((subItem, index) => (
                    <Link
                      key={index}
                      to={subItem.path}
                      onClick={() => setActiveSubmenu(null)}
                      className={`flex items-center space-x-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 ${
                        location.pathname === subItem.path
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-foreground hover:bg-muted hover:translate-x-1'
                      }`}
                    >
                      <subItem.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{subItem.label}</span>
                    </Link>
                  ))}
                
                {/* Profile submenu for user profile items */}
                {userProfileItems
                  .find(item => item.path === activeSubmenu)
                  ?.submenu?.map((subItem, index) => (
                    subItem.onClick ? (
                      <button
                        key={index}
                        onClick={() => {
                          subItem.onClick!();
                          setActiveSubmenu(null);
                        }}
                        className="flex items-center space-x-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 w-full text-left text-foreground hover:bg-muted hover:translate-x-1"
                      >
                        <subItem.icon className="w-4 h-4 flex-shrink-0" />
                        <span>{subItem.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={index}
                        to={subItem.path}
                        onClick={() => setActiveSubmenu(null)}
                        className={`flex items-center space-x-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 ${
                          location.pathname === subItem.path
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-foreground hover:bg-muted hover:translate-x-1'
                        }`}
                      >
                        <subItem.icon className="w-4 h-4 flex-shrink-0" />
                        <span>{subItem.label}</span>
                      </Link>
                    )
                  ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;