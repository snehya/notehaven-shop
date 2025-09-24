import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback, 
  useMemo,
  useReducer 
} from 'react';
import { generateId, isValidEmail } from '@/lib/utils';
import { LOCAL_STORAGE_KEYS, USER_ROLES, TOAST_MESSAGES } from '@/lib/constants';

/**
 * Available user roles in the application
 */
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * User entity interface
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly avatar?: string;
  readonly createdAt: Date;
  readonly lastLoginAt?: Date;
}

/**
 * Authentication error types
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_EXISTS = 'USER_EXISTS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_EMAIL = 'INVALID_EMAIL',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  STORAGE_ERROR = 'STORAGE_ERROR'
}

/**
 * Custom authentication error class
 */
export class AuthError extends Error {
  constructor(
    public type: AuthErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Authentication state interface
 */
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
}

/**
 * Authentication context type definition
 */
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

/**
 * Authentication state actions
 */
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: AuthError | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

/**
 * Authentication state reducer
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, error: null, isLoading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { user: null, isLoading: false, error: null };
    default:
      return state;
  }
};

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to access authentication context
 * @throws {Error} When used outside of AuthProvider
 * @returns Authentication context value
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication provider component props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns True if password meets requirements
 */
const validatePassword = (password: string): boolean => {
  return password.length >= 6; // Basic validation - can be enhanced
};

/**
 * Safely parses user data from localStorage
 * @param userData - Raw user data string
 * @returns Parsed user object or null
 */
const parseUserData = (userData: string): User | null => {
  try {
    const parsed = JSON.parse(userData);
    // Validate required fields
    if (!parsed.id || !parsed.email || !parsed.name || !parsed.role) {
      throw new Error('Invalid user data structure');
    }
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt || Date.now()),
      lastLoginAt: parsed.lastLoginAt ? new Date(parsed.lastLoginAt) : undefined,
    };
  } catch (error) {
    console.warn('Failed to parse user data from localStorage:', error);
    return null;
  }
};

/**
 * Safely saves user data to localStorage
 * @param user - User object to save
 */
const saveUserData = (user: User): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user data to localStorage:', error);
    throw new AuthError(
      AuthErrorType.STORAGE_ERROR,
      'Failed to save user session',
      error as Error
    );
  }
};

/**
 * Authentication provider component
 * Manages authentication state and provides auth functions to children
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Initialize authentication state from localStorage
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUserData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
        if (savedUserData) {
          const user = parseUserData(savedUserData);
          if (user) {
            dispatch({ type: 'SET_USER', payload: user });
            return;
          }
        }
      } catch (error) {
        console.warn('Error initializing auth:', error);
        // Clear potentially corrupted data
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    initializeAuth();
  }, []);

  /**
   * Simulate API delay for demonstration
   * @param ms - Milliseconds to delay
   */
  const simulateApiDelay = (ms: number = 1000): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Determines user role based on email for demo purposes
   * @param email - User email
   * @returns Determined user role
   */
  const determineUserRole = (email: string): UserRole => {
    if (email.includes('admin')) return USER_ROLES.ADMIN;
    if (email.includes('seller')) return USER_ROLES.SELLER;
    return USER_ROLES.BUYER;
  };

  /**
   * Generates avatar URL for user
   * @param email - User email
   * @returns Avatar URL
   */
  const generateAvatarUrl = (email: string): string => 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

  /**
   * Login user with email and password
   * @param email - User email
   * @param password - User password
   * @throws {AuthError} When login fails
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // Validate input
      if (!isValidEmail(email)) {
        throw new AuthError(AuthErrorType.INVALID_EMAIL, TOAST_MESSAGES.ERROR.LOGIN_FAILED);
      }

      if (!validatePassword(password)) {
        throw new AuthError(AuthErrorType.WEAK_PASSWORD, 'Password is too weak');
      }

      // Simulate API call
      await simulateApiDelay();

      // Mock authentication logic
      const mockUser: User = {
        id: generateId(),
        email: email.toLowerCase().trim(),
        name: email.split('@')[0],
        role: determineUserRole(email),
        avatar: generateAvatarUrl(email),
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      saveUserData(mockUser);
      dispatch({ type: 'SET_USER', payload: mockUser });
    } catch (error) {
      const authError = error instanceof AuthError 
        ? error 
        : new AuthError(AuthErrorType.NETWORK_ERROR, TOAST_MESSAGES.ERROR.NETWORK_ERROR, error as Error);
      
      dispatch({ type: 'SET_ERROR', payload: authError });
      throw authError;
    }
  }, []);

  /**
   * Register new user
   * @param email - User email
   * @param password - User password
   * @param name - User display name
   * @param role - User role (optional, defaults to buyer)
   * @throws {AuthError} When registration fails
   */
  const register = useCallback(async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole = USER_ROLES.BUYER
  ): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // Validate input
      if (!isValidEmail(email)) {
        throw new AuthError(AuthErrorType.INVALID_EMAIL, 'Please enter a valid email address');
      }

      if (!validatePassword(password)) {
        throw new AuthError(AuthErrorType.WEAK_PASSWORD, 'Password must be at least 6 characters long');
      }

      if (!name.trim()) {
        throw new AuthError(AuthErrorType.INVALID_CREDENTIALS, 'Name is required');
      }

      // Simulate API call
      await simulateApiDelay();

      const mockUser: User = {
        id: generateId(),
        email: email.toLowerCase().trim(),
        name: name.trim(),
        role,
        avatar: generateAvatarUrl(email),
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      saveUserData(mockUser);
      dispatch({ type: 'SET_USER', payload: mockUser });
    } catch (error) {
      const authError = error instanceof AuthError 
        ? error 
        : new AuthError(AuthErrorType.NETWORK_ERROR, TOAST_MESSAGES.ERROR.SIGNUP_FAILED, error as Error);
      
      dispatch({ type: 'SET_ERROR', payload: authError });
      throw authError;
    }
  }, []);

  /**
   * Logout current user
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still dispatch logout even if localStorage fails
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  /**
   * Clear current error state
   */
  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    // In a real app, this would fetch fresh user data from the API
    // For now, just update lastLoginAt
    if (state.user) {
      const updatedUser = {
        ...state.user,
        lastLoginAt: new Date(),
      };
      saveUserData(updatedUser);
      dispatch({ type: 'SET_USER', payload: updatedUser });
    }
  }, [state.user]);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useMemo(() => !!state.user, [state.user]);

  /**
   * Check if user has specific role
   * @param role - Role to check
   * @returns True if user has the role
   */
  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  /**
   * Check if user has any of the specified roles
   * @param roles - Roles to check
   * @returns True if user has any of the roles
   */
  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return !!state.user && roles.includes(state.user.role);
  }, [state.user]);

  /**
   * Memoized context value to prevent unnecessary re-renders
   */
  const contextValue = useMemo((): AuthContextType => ({
    ...state,
    login,
    register,
    logout,
    clearError,
    refreshUser,
    isAuthenticated,
    hasRole,
    hasAnyRole,
  }), [
    state,
    login,
    register,
    logout,
    clearError,
    refreshUser,
    isAuthenticated,
    hasRole,
    hasAnyRole,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};