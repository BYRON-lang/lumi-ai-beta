import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

interface User {
  id: string;
  email: string;
  fullName?: string;
  profilePicture?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  verifyEmail: (code: string, email: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  setToken: (token: string) => Promise<void>;
}

// Create a default context value that matches the AuthContextType
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  signup: async () => { throw new Error('AuthProvider not initialized') },
  login: async () => { throw new Error('AuthProvider not initialized') },
  loginWithGoogle: async () => { throw new Error('AuthProvider not initialized') },
  logout: () => { throw new Error('AuthProvider not initialized') },
  verifyEmail: async () => { throw new Error('AuthProvider not initialized') },
  resendVerificationEmail: async () => { throw new Error('AuthProvider not initialized') },
  setToken: async () => { throw new Error('AuthProvider not initialized') }
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const initializeAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          console.log('User authenticated:', userData);
        } else {
          console.log('No authenticated user found');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting signup for:', email);
      const response = await authService.signup({ email, password, fullName });
      
      console.log('Signup response:', response);
      
      // Navigate to verify-email page with the email as a URL parameter
      navigate(`/verify-email?email=${encodeURIComponent(email)}`, { 
        state: {
          message: response?.message || 'Please check your email to verify your account.'
        }
      });
      
      return response;
    } catch (error) {
      console.error('Signup error in AuthContext:', error);
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await authService.login({ email, password });
      
      // Store minimal user data in localStorage for quick access
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setToken = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      // Store the token in localStorage
      localStorage.setItem('token', token);
      // Fetch user data using the token
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set authentication token');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await authService.handleGoogleCallback();
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Still proceed with local logout even if server logout fails
      setUser(null);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (code: string, email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.verifyEmail(code, email);
      if (result && user) {
        setUser({ ...user, isVerified: true });
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement resend verification email logic
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    verifyEmail,
    resendVerificationEmail,
    setToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the auth context
 * @returns The auth context with user data and auth methods
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  // In development, we want to know if the hook is used outside of a provider
  if (process.env.NODE_ENV !== 'production') {
    // If we're using the default context, it means the hook is used outside of a provider
    if (context === defaultAuthContext) {
      console.warn(
        'useAuth is being used outside of an AuthProvider. ' +
        'Make sure to wrap your app with <AuthProvider>.'
      );
    }
  }
  
  return context;
}
