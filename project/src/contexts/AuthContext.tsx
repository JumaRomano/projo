import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo - in production, this would connect to your authentication service
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@ems.com',
    name: 'System Administrator',
    role: 'admin',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: '2',
    email: 'organizer@ems.com',
    name: 'Event Organizer',
    role: 'organizer',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: '3',
    email: 'vendor@ems.com',
    name: 'Vendor Partner',
    role: 'vendor',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: '4',
    email: 'attendee@ems.com',
    name: 'Event Attendee',
    role: 'attendee',
    createdAt: new Date(),
    isActive: true,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('ems_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock authentication - in production, this would call Firebase Auth
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser && password === 'password123') {
        setUser(foundUser);
        localStorage.setItem('ems_user', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: User['role']) => {
    setLoading(true);
    try {
      // Mock registration - in production, this would call Firebase Auth
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        createdAt: new Date(),
        isActive: true,
      };
      
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem('ems_user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ems_user');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}