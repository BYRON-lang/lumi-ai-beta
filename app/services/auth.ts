// FILE: src/services/auth.ts
import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async signup(data: SignupData) {
    try {
      const requestData = {
        email: data.email,
        password: data.password,
        fullName: data.fullName
      };

      console.log('Sending signup request with data:', requestData);
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        credentials: 'include',
      });

      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        console.error('Signup failed:', {
          status: response.status,
          statusText: response.statusText,
          responseData
        });
        
        const errorMessage = responseData?.error || 
                           responseData?.message || 
                           `Signup failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      console.log('Signup successful:', responseData);
      return responseData.data || responseData;
    } catch (error) {
      console.error('Signup error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred during signup');
    }
  },

  async login(data: LoginData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Login failed:', responseData);
        const errorMessage = responseData?.error || responseData?.message || 'Login failed';
        throw new Error(errorMessage);
      }

      const userData = responseData.data?.user || responseData.user;
      
      if (!userData) {
        console.error('No user data in response:', responseData);
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User logged in and stored:', userData);
      
      return { user: userData };
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('user');
      throw error;
    }
  },

  async verifyEmail(code: string, email: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, email }),
        credentials: 'include',
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        const errorMessage = responseData?.error || responseData?.message || 'Email verification failed';
        throw new Error(errorMessage);
      }

      if (responseData.data?.user) {
        localStorage.setItem('user', JSON.stringify(responseData.data.user));
      }
      
      return responseData.data || responseData;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error instanceof Error ? error : new Error('Email verification failed');
    }
  },

  async resendVerificationEmail(email: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        const errorMessage = responseData?.error || responseData?.message || 'Failed to resend verification email';
        throw new Error(errorMessage);
      }

      return true;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error instanceof Error ? error : new Error('Failed to resend verification email');
    }
  },

  getGoogleOAuthUrl(redirectTo: string = '/'): string {
    const state = encodeURIComponent(JSON.stringify({ redirectTo }));
    return `${API_BASE_URL}/auth/google?state=${state}`;
  },

  async handleGoogleCallback(): Promise<{ user: any }> {
    try {
      // Get the token from the URL
      const url = new URL(window.location.href);
      const token = url.searchParams.get('token');
      const error = url.searchParams.get('error');

      if (error) {
        throw new Error(decodeURIComponent(error));
      }

      if (!token) {
        throw new Error('No authentication token found in the URL');
      }

      // Store the token
      localStorage.setItem('token', token);

      // Get user data
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData?.error || responseData?.message || 'Failed to fetch user data';
        throw new Error(errorMessage);
      }

      const userData = responseData.data?.user || responseData.user;
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error('No user data received');
      }

      return { user: userData };
    } catch (error) {
      console.error('Google callback error:', error);
      throw error instanceof Error ? error : new Error('Failed to authenticate with Google');
    }
  },

  async logout() {
    localStorage.removeItem('user');
    
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser(forceRefresh = false) {
    const getCachedUser = () => {
      try {
        const cachedUser = localStorage.getItem('user');
        if (!cachedUser) return null;
        
        const parsed = JSON.parse(cachedUser);
        return parsed && typeof parsed === 'object' ? parsed : null;
      } catch (e) {
        console.warn('Error parsing cached user data, clearing...');
        localStorage.removeItem('user');
        return null;
      }
    };

    if (!forceRefresh) {
      const cachedUser = getCachedUser();
      if (cachedUser) {
        console.log('Returning cached user:', cachedUser);
        return cachedUser;
      }
    }

    try {
      console.log('Fetching current user from:', `${API_BASE_URL}/auth/me`);
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn('Failed to fetch current user:', response.status, response.statusText);
        localStorage.removeItem('user');
        return null;
      }
      
      const responseData = await response.json();
      console.log('User data from /me:', responseData);
      
      const userData = responseData.data?.user || responseData.user;
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      
      localStorage.removeItem('user');
      return null;
      
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return getCachedUser();
    }
  },

  async isAuthenticated() {
    try {
      const cachedUser = (() => {
        try {
          const user = localStorage.getItem('user');
          return user ? JSON.parse(user) : null;
        } catch (e) {
          return null;
        }
      })();
      
      if (cachedUser) {
        console.log('Found cached user, checking with server...');
        const freshUser = await this.getCurrentUser(true);
        return !!freshUser;
      }
      
      const user = await this.getCurrentUser();
      return !!user;
      
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }
};