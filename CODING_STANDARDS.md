
# Coding Standards and Best Practices

## Overview
This document establishes coding standards and best practices for the Diligince.ai project to ensure consistency, maintainability, and scalability across the codebase.

## TypeScript Standards

### Type Definitions
```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
}

// Use type aliases for unions and complex types
type UserType = 'industry' | 'professional' | 'vendor';
type EventHandler<T> = (event: T) => void;

// Use enums for finite sets of related constants
enum VendorStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}
```

### Generic Types
```typescript
// Generic function definitions
function createApiResponse<T>(data: T, success: boolean): ApiResponse<T> {
  return { data, success, timestamp: new Date() };
}

// Generic component props
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
}
```

### Type Safety Rules
- Avoid `any` type - use `unknown` for truly unknown types
- Use strict null checks - prefer `string | null` over optional properties when appropriate
- Implement type guards for runtime type checking
- Use const assertions for literal types: `const statuses = ['active', 'pending'] as const`

## React Component Standards

### Component Structure
```typescript
// Functional component with proper typing
interface ComponentProps {
  /** Description of the prop */
  title: string;
  /** Optional callback function */
  onAction?: () => void;
  /** Child components */
  children?: React.ReactNode;
}

const Component = ({ title, onAction, children }: ComponentProps) => {
  // Hooks first
  const [state, setState] = useState<StateType>(initialState);
  const { data, loading } = useQuery(/* query config */);
  
  // Event handlers
  const handleClick = useCallback(() => {
    onAction?.();
  }, [onAction]);
  
  // Render logic
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="component-container">
      <h1>{title}</h1>
      {children}
    </div>
  );
};

export default Component;
```

### Hooks Usage
```typescript
// Custom hook pattern
interface UseCustomHookReturn {
  data: DataType | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCustomHook = (id: string): UseCustomHookReturn => {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.fetchData(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  return { data, loading, error, refetch };
};
```

### Component Composition
```typescript
// Compound component pattern
const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

Modal.Header = ({ children }: { children: React.ReactNode }) => (
  <DialogHeader>{children}</DialogHeader>
);

Modal.Body = ({ children }: { children: React.ReactNode }) => (
  <div className="modal-body">{children}</div>
);

Modal.Footer = ({ children }: { children: React.ReactNode }) => (
  <DialogFooter>{children}</DialogFooter>
);

// Usage
<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

## File and Directory Naming

### Naming Conventions
- **Components**: PascalCase - `UserProfile.tsx`, `VendorDashboard.tsx`
- **Hooks**: camelCase with 'use' prefix - `useUserData.ts`, `useModal.ts`
- **Utilities**: camelCase - `apiClient.ts`, `dateHelpers.ts`
- **Types**: camelCase - `user.ts`, `workflow.ts`
- **Constants**: UPPER_SNAKE_CASE - `API_ENDPOINTS.ts`, `ERROR_MESSAGES.ts`

### Directory Structure
```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── feature/            # Feature-specific components
│   └── shared/             # Cross-feature components
├── pages/                  # Route components
├── hooks/                  # Custom hooks
├── contexts/               # React contexts
├── types/                  # TypeScript definitions
├── utils/                  # Business utilities
├── lib/                    # Generic utilities
└── assets/                 # Static assets
```

## Import and Export Standards

### Import Order
```typescript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from 'class-variance-authority';

// 2. Internal imports - components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 3. Internal imports - hooks and utilities
import { useUserData } from '@/hooks/useUserData';
import { formatDate } from '@/utils/dateUtils';

// 4. Internal imports - types
import type { User, UserPreferences } from '@/types/user';

// 5. Relative imports
import './Component.styles.css';
```

### Export Patterns
```typescript
// Named exports preferred for components
export const UserCard = ({ user }: UserCardProps) => {
  // Component implementation
};

// Default export for main component in file
const UserProfile = () => {
  // Component implementation
};

export default UserProfile;

// Re-exports for utility modules
export { formatDate, parseDate } from './dateUtils';
export { validateEmail, validatePhone } from './validators';
```

## Error Handling Standards

### Component Error Handling
```typescript
const Component = () => {
  const [error, setError] = useState<string | null>(null);
  
  const handleAsyncOperation = async () => {
    try {
      setError(null);
      await performOperation();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Operation failed:', err);
    }
  };
  
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <Button onClick={() => setError(null)}>Dismiss</Button>
      </div>
    );
  }
  
  return <div>{/* Normal component content */}</div>;
};
```

### Error Boundaries
```typescript
// Use ErrorBoundary components for graceful error handling
<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentThatMightError />
</ErrorBoundary>
```

## State Management Patterns

### Local State
```typescript
// Simple state with useState
const [user, setUser] = useState<User | null>(null);

// Complex state with useReducer
interface State {
  data: DataType[];
  loading: boolean;
  error: string | null;
}

type Action = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: DataType[] }
  | { type: 'FETCH_ERROR'; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(reducer, initialState);
```

### Context Usage
```typescript
// Context provider pattern
interface ContextValue {
  user: User | null;
  updateUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<ContextValue | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
```

## Styling Standards

### Tailwind CSS Usage
```typescript
// Utility-first approach
const Component = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Title</h2>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
        Action
      </Button>
    </div>
  );
};

// Use cn utility for conditional classes
const buttonClass = cn(
  'px-4 py-2 rounded-md font-medium transition-colors',
  variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
  variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  disabled && 'opacity-50 cursor-not-allowed'
);
```

### Component Variants
```typescript
// Use cva for component variants
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50'
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ variant, size, children, onClick }: ButtonProps) => {
  return (
    <button 
      className={buttonVariants({ variant, size })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

## Performance Best Practices

### Memoization
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Memoize callback functions
const handleSubmit = useCallback((formData: FormData) => {
  onSubmit(formData);
}, [onSubmit]);

// Memoize components
const MemoizedComponent = React.memo(({ data }: ComponentProps) => {
  return <div>{/* Component content */}</div>;
});
```

### Code Splitting
```typescript
// Lazy load route components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));

// Lazy load heavy components
const HeavyChart = React.lazy(() => import('./components/HeavyChart'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <HeavyChart data={chartData} />
</Suspense>
```

## Testing Standards

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  it('displays user information correctly', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

### Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

## Documentation Standards

### JSDoc Comments
```typescript
/**
 * Calculates the completion percentage of a user profile
 * @param profile - The user profile object
 * @param requiredFields - Array of required field names
 * @returns The completion percentage as a number between 0 and 100
 * @example
 * const completion = calculateProfileCompletion(user.profile, ['name', 'email']);
 * console.log(`Profile is ${completion}% complete`);
 */
export const calculateProfileCompletion = (
  profile: UserProfile,
  requiredFields: string[]
): number => {
  // Implementation
};
```

### Component Documentation
```typescript
/**
 * UserCard component displays user information in a card format
 * 
 * @component
 * @example
 * const user = { id: '1', name: 'John', email: 'john@example.com' };
 * return (
 *   <UserCard 
 *     user={user} 
 *     onEdit={handleEdit}
 *     variant="compact"
 *   />
 * )
 */
interface UserCardProps {
  /** User object containing user information */
  user: User;
  /** Callback function called when edit button is clicked */
  onEdit?: (user: User) => void;
  /** Visual variant of the card */
  variant?: 'default' | 'compact' | 'detailed';
}

const UserCard = ({ user, onEdit, variant = 'default' }: UserCardProps) => {
  // Component implementation
};
```

## Code Quality Tools

### ESLint Configuration
- Use strict TypeScript rules
- Enforce consistent code formatting
- Prevent common React pitfalls
- Maintain import organization

### Prettier Configuration
- Consistent code formatting
- Line length limits
- Semicolon and quote preferences
- Trailing comma handling

### Pre-commit Hooks
- Run linting and formatting
- Execute type checking
- Run relevant tests
- Validate commit messages

## Version Control Standards

### Commit Messages
```
type(scope): description

feat(auth): add user authentication flow
fix(dashboard): resolve data loading issue
docs(readme): update installation instructions
refactor(components): extract common modal logic
test(utils): add tests for date utilities
```

### Branch Naming
- `feature/user-authentication`
- `fix/dashboard-loading-bug`
- `refactor/component-structure`
- `docs/api-documentation`

### Pull Request Guidelines
1. Clear title and description
2. Link to related issues
3. Include screenshots for UI changes
4. Add tests for new functionality
5. Update documentation as needed
6. Ensure CI passes before review

This coding standards document should be followed consistently across the project to maintain code quality and team productivity.
