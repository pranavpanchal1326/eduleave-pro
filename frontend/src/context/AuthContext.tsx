import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User, AuthContextType, RegisterData } from '../types';
import { toast } from 'react-toastify';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const savedUser = authService.getCurrentUser();
      const savedToken = authService.getToken();
      
      if (savedUser && savedToken) {
        setUser(savedUser);
        setToken(savedToken);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setToken(data.token);
      toast.success(`Welcome back, ${data.user.name}! 🎉`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const data = await authService.register(registerData);
      setUser(data.user);
      setToken(data.token);
      toast.success(`Account created successfully! Welcome, ${data.user.name}! 🎉`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
