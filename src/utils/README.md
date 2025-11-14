
# Utils Directory

## Overview
This directory contains utility functions and configuration objects that support specific business logic and application functionality. Unlike the `/lib` directory which contains generic utilities, `/utils` contains domain-specific helpers and configuration data.

## Current Utilities

### Configuration Files

#### navigationConfigs.ts
- **Purpose**: Navigation configuration for different user types
- **Exports**:
  - `industryHeaderConfig` - Industry user navigation
  - `professionalHeaderConfig` - Professional user navigation
  - Header configurations with routes, active states, and user-specific features
- **Usage**: Used by GenericHeader component for consistent navigation

#### dashboardConfigs.ts
- **Purpose**: Dashboard configuration and mock data for different user types
- **Exports**:
  - `serviceVendorStats` - Service vendor dashboard metrics
  - Dashboard stat configurations and display data
- **Usage**: Powers dashboard components with type-specific metrics

#### messageConfigs.ts
- **Purpose**: Message center configuration and templates
- **Features**:
  - Message categorization
  - Template configurations
  - User-type specific message handling

### Business Logic Utilities

#### vendorSpecializationMapping.ts
- **Purpose**: Maps vendor types to their specializations and capabilities
- **Features**:
  - Service category mapping
  - Skill and capability definitions
  - Industry-specific vendor matching logic
- **Usage**: Used in vendor discovery and matching algorithms

#### profileCompleteness.ts
- **Purpose**: Calculates profile completion percentages
- **Features**:
  - User-type specific completion criteria
  - Progress tracking algorithms
  - Profile optimization suggestions
- **Usage**: Powers profile completion widgets and onboarding flows

#### statusUtils.ts
- **Purpose**: Status management and display utilities
- **Features**:
  - Status badge color mapping
  - Status transition logic
  - Display formatting for various status types
- **Usage**: Consistent status display across components

#### colorUtils.ts
- **Purpose**: Color scheme management for different user types
- **Features**:
  - User-type specific color palettes
  - Consistent theming across user interfaces
  - Dynamic color generation for status indicators
- **Usage**: Maintains visual consistency across user type dashboards

### Data Utilities

#### dateUtils.ts
- **Purpose**: Date formatting and manipulation utilities
- **Features**:
  - Consistent date formatting across the application
  - Relative date calculations
  - Timezone handling
  - Business day calculations
- **Usage**: Used throughout the application for date display and calculations

#### mockNotifications.ts
- **Purpose**: Mock notification data for development and testing
- **Features**:
  - Realistic notification samples
  - Different notification types and priorities
  - User-type specific notification examples
- **Usage**: Development and demo purposes

#### shared.ts
- **Purpose**: Shared utility functions used across multiple domains
- **Features**:
  - Common data transformations
  - Shared validation logic
  - Cross-cutting utility functions
- **Usage**: Imported by various components and other utilities

### Index File

#### index.ts
- **Purpose**: Central export point for all utilities
- **Features**:
  - Re-exports from all utility files
  - Organized exports by category
  - Simplified import paths for consumers
- **Usage**: Allows clean imports like `import { utilityFunction } from "@/utils"`

## Utility Categories

### Navigation and Routing
```typescript
// Navigation configuration structure
export const userTypeHeaderConfig = {
  userType: 'industry',
  brand: { name: 'Diligince.ai', href: '/' },
  navItems: [
    { name: 'Dashboard', href: '/dashboard', active: true },
    { name: 'Messages', href: '/messages' }
  ],
  actions: {
    notifications: true,
    profile: true,
    settings: true
  }
};
```

### Dashboard Configuration
```typescript
// Dashboard metrics configuration
export const userTypeDashboardStats = [
  {
    title: 'Active Projects',
    count: 12,
    subtitle: 'ongoing',
    icon: <FileText className="w-8 h-8 text-blue-500" />,
    color: 'blue'
  }
];
```

### Status and Color Mapping
```typescript
// Status color mapping
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'active': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-blue-100 text-blue-800'
  };
  return colorMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};
```

### Data Transformation
```typescript
// Business-specific data transformations
export const calculateCompletionPercentage = (
  profile: UserProfile,
  requiredFields: string[]
): number => {
  const completedFields = requiredFields.filter(
    field => profile[field] !== null && profile[field] !== undefined
  );
  return Math.round((completedFields.length / requiredFields.length) * 100);
};
```

## Planned Utility Categories

### API Integration Utilities
```typescript
// API endpoint configuration
export const apiEndpoints = {
  users: '/api/users',
  vendors: '/api/vendors',
  requirements: '/api/requirements',
  orders: '/api/orders'
};

// Request/response transformers
export const transformApiResponse = <T>(response: ApiResponse): T => {
  // Response transformation logic
};
```

### Validation Utilities
```typescript
// Business-specific validation
export const validateRequirement = (requirement: Requirement): ValidationResult => {
  const errors: string[] = [];
  
  if (!requirement.title) errors.push('Title is required');
  if (!requirement.description) errors.push('Description is required');
  if (!requirement.budget) errors.push('Budget is required');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

### Search and Filter Utilities
```typescript
// Advanced search and filtering
export const searchVendors = (
  vendors: Vendor[],
  criteria: SearchCriteria
): Vendor[] => {
  return vendors.filter(vendor => {
    // Complex filtering logic based on criteria
  });
};

export const filterByLocation = (
  items: any[],
  location: string,
  radius: number
): any[] => {
  // Geo-filtering logic
};
```

### Analytics and Metrics
```typescript
// Business metrics calculations
export const calculateROI = (
  investment: number,
  returns: number
): number => {
  return ((returns - investment) / investment) * 100;
};

export const generateMetricsReport = (
  data: DashboardData
): MetricsReport => {
  // Metrics aggregation and reporting
};
```

## Integration Patterns

### Component Integration
```typescript
// Using utils in components
import { getStatusColor, formatBusinessDate } from '@/utils';

const StatusBadge = ({ status, date }) => {
  const colorClass = getStatusColor(status);
  const formattedDate = formatBusinessDate(date);
  
  return (
    <Badge className={colorClass}>
      {status} - {formattedDate}
    </Badge>
  );
};
```

### Hook Integration
```typescript
// Using utils in custom hooks
import { calculateCompletionPercentage } from '@/utils';

export const useProfileCompletion = (user: User) => {
  const completion = useMemo(() => {
    return calculateCompletionPercentage(user.profile, REQUIRED_FIELDS);
  }, [user.profile]);
  
  return { completion };
};
```

### Context Integration
```typescript
// Using utils in context providers
import { transformUserData } from '@/utils';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const updateUser = (userData: RawUserData) => {
    const transformedUser = transformUserData(userData);
    setUser(transformedUser);
  };
  
  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
```

## Testing Strategies

### Unit Testing
```typescript
// Testing utility functions
describe('getStatusColor', () => {
  it('should return correct color for active status', () => {
    expect(getStatusColor('active')).toBe('bg-green-100 text-green-800');
  });
  
  it('should return default color for unknown status', () => {
    expect(getStatusColor('unknown')).toBe('bg-gray-100 text-gray-800');
  });
});
```

### Integration Testing
```typescript
// Testing utility integration with components
describe('StatusBadge Integration', () => {
  it('should apply correct color class from utility', () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByRole('status')).toHaveClass('bg-green-100');
  });
});
```

## Performance Considerations

### Memoization
```typescript
// Memoize expensive calculations
export const expensiveCalculation = memoize((data: LargeDataSet) => {
  // Complex calculation logic
});
```

### Lazy Loading
```typescript
// Lazy load heavy utilities
export const getHeavyUtility = () => {
  return import('./heavyUtility').then(module => module.default);
};
```

## Contributing Guidelines

### Adding New Utilities
1. **Domain Alignment**: Ensure utilities align with business domain
2. **Naming**: Use descriptive, business-oriented names
3. **Organization**: Place in appropriate category file
4. **Documentation**: Add comprehensive JSDoc comments
5. **Testing**: Include unit tests for complex logic
6. **Export**: Add to index.ts for easy importing

### Configuration Management
```typescript
// Configuration file structure
export const userTypeConfig = {
  // Static configuration
  staticProperty: 'value',
  
  // Dynamic configuration
  getDynamicValue: (context: Context) => {
    // Dynamic logic
  },
  
  // Validation
  validate: (input: Input): boolean => {
    // Validation logic
  }
};
```

### Best Practices
1. **Separation of Concerns**: Keep business logic separate from UI logic
2. **Type Safety**: Use proper TypeScript types
3. **Pure Functions**: Prefer pure functions without side effects
4. **Configuration**: Use configuration objects for complex setups
5. **Consistency**: Maintain consistent patterns across utilities
6. **Documentation**: Document business rules and logic clearly

### File Organization
- Group related utilities in the same file
- Use descriptive file names that indicate purpose
- Maintain consistent export patterns
- Update index.ts when adding new utilities
- Keep utilities focused and avoid monolithic files
