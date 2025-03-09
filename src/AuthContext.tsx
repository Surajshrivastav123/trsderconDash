import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');
      if (token) {
        // try {
        //   // Verify token with your backend
        //   const response = await axios.get('https://backend.gaganahuja.com/api/v1/verify-token', {
        //     headers: { Authorization: `Bearer ${token}` }
        //   });
        //   if (response.data.success) {
        //     setIsAuthenticated(true);
        //     setUser(response.data.user);
        //   } else {
        //     Cookies.remove('token');
        //   }
        // } catch (error) {
        //   console.error('Token verification failed:', error);
        //   Cookies.remove('token');
        // }
        setIsAuthenticated(true);

      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: any) => {
    Cookies.set('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};