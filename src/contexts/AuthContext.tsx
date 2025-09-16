import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication for demo purposes
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('notemarket_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock different user types based on email
    let role: UserRole = 'buyer';
    if (email.includes('seller')) role = 'seller';
    if (email.includes('admin')) role = 'admin';
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    setUser(mockUser);
    localStorage.setItem('notemarket_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string, role: UserRole = 'buyer') => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    setUser(mockUser);
    localStorage.setItem('notemarket_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('notemarket_user');
  };

  const isAuthenticated = !!user;
  const hasRole = (role: UserRole) => user?.role === role;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};