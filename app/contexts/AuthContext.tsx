import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { authService } from "../services/auth";

interface User {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  isVerified: boolean;
  profilePicture?: string;
  avatar?: string;
  initials?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  authStep: any;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  startPasswordlessLogin: (email: string) => Promise<void>;
  startPasswordlessSignup: (email: string) => Promise<void>;
  verifyPasswordlessLogin: (email: string, code: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  submitFullName: (sessionToken: string, fullName: string) => Promise<void>;
  completeRegistration: (sessionToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authStep, setAuthStep] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing authentication');
        const userData = await authService.getCurrentUser();
        console.log('AuthContext: User data from auth service', { userData });
        if (userData) {
          setUser(userData);
          console.log('AuthContext: User set in context');
        } else {
          console.log('AuthContext: No user data found');
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
        console.log('AuthContext: Authentication initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.signup({ email, password });
      // Don't log in automatically after signup, wait for email verification
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
      throw err;
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
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      navigate("/auth-loading");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await authService.loginWithGoogle(credential);

      // Store minimal user data in localStorage for quick access
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      navigate("/auth-loading");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
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
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      // Still proceed with local logout even if server logout fails
      setUser(null);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await authService.verifyEmail(token);
      if (success && user) {
        setUser({ ...user, isVerified: true });
      }
      return success;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Email verification failed",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      return await authService.resendVerificationEmail(email);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to resend verification email",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startPasswordlessLogin = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await authService.startPasswordlessLogin(email);
      navigate(`/login-verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to start passwordless login",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyPasswordlessLogin = async (
    email: string,
    code: string,
  ): Promise<void> => {
    try {
      console.log('AuthContext: Starting passwordless login verification', { email });
      setLoading(true);
      setError(null);
      const responseData = await authService.verifyPasswordlessLogin(email, code);
      console.log('AuthContext: Passwordless login response', { responseData });
      
      // Handle both response structures: { user: {...} } and { success: true, data: { user: {...} } }
      const user = responseData?.data?.user || responseData?.user;
      console.log('AuthContext: Passwordless login successful', { user });

      // Store minimal user data in localStorage for quick access
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      console.log('AuthContext: User data stored and set in context');

      navigate("/auth-loading");
      console.log('AuthContext: Navigated to auth loading page');
    } catch (err) {
      console.error('AuthContext: Passwordless login verification failed', err);
      setError(
        err instanceof Error ? err.message : "Invalid verification code",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startPasswordlessSignup = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.startPasswordlessSignup(email);
      setAuthStep(response);
      // Navigate to verification step
      navigate(`/signup-verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start signup process",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitFullName = async (
    sessionToken: string,
    fullName: string,
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.submitFullName(sessionToken, fullName);
      setAuthStep(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit full name",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async (sessionToken: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const responseData = await authService.completeRegistration(sessionToken);
      // Handle both response structures: { user: {...} } and { success: true, data: { user: {...} } }
      const user = responseData?.data?.user || responseData?.user;

      // Store minimal user data in localStorage for quick access
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      navigate("/auth-loading");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete registration",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Alias for verifyPasswordlessLogin to match the expected function name in login-verify
  const verifyCode = verifyPasswordlessLogin;

  const value = {
    user,
    loading,
    error,
    authStep,
    signup,
    login,
    loginWithGoogle,
    logout,
    verifyEmail,
    resendVerificationEmail,
    startPasswordlessLogin,
    startPasswordlessSignup,
    verifyPasswordlessLogin,
    verifyCode,
    submitFullName,
    completeRegistration,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
