import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

interface SignupData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async signup(data: SignupData) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // Include cookies in the request
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return response.json();
  },

  async login(data: LoginData) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // Include cookies in the request
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      // Clear any existing user data on failed login
      localStorage.removeItem('user');
      throw new Error(responseData.message || 'Login failed');
    }

    // Store user data in localStorage for immediate access
    if (responseData.user) {
      localStorage.setItem('user', JSON.stringify(responseData.user));
    }

    return responseData;
  },

  async verifyEmail(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/verify?token=${token}`, {
      credentials: 'include', // Include cookies in the request
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Email verification failed');
    }

    return true;
  },
  async resendVerificationEmail(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to resend verification email');
    }

    return true;
  },

  async loginWithGoogle(credential: string) {
    const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Google login failed');
    }

    const { user } = await response.json();
    return { user }; // Token will be in httpOnly cookie
  },

  async logout() {
    // Clear the client-side user data first for immediate feedback
    localStorage.removeItem('user');
    
    // Call the server to clear the httpOnly cookie
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
      // Even if the server logout fails, we've already cleared the client-side state
    }
  },

  async getCurrentUser(forceRefresh = false) {
    console.log('AuthService: getCurrentUser called', { forceRefresh });
    
    // Try to get from localStorage first if not forcing refresh
    if (!forceRefresh) {
      const cachedUser = localStorage.getItem('user');
      console.log('AuthService: Cached user from localStorage', { cachedUser: !!cachedUser });
      if (cachedUser && cachedUser !== 'undefined' && cachedUser !== 'null') {
        try {
          const parsedUser = JSON.parse(cachedUser);
          console.log('AuthService: Returning cached user', { user: parsedUser });
          return parsedUser;
        } catch (e) {
          console.error('Error parsing cached user data:', e);
          // Clear invalid cached data and continue to fetch from server
          localStorage.removeItem('user');
        }
      }
    }

    try {
      console.log('AuthService: Fetching user from server', { API_BASE_URL });
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('AuthService: Server response', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        // Clear any cached user data if the request fails
        localStorage.removeItem('user');
        console.log('AuthService: Server request failed, cleared localStorage');
        return null;
      }
      
      const userData = await response.json();
      console.log('AuthService: Server user data', { userData });
      
      // Handle both response structures: { user: {...} } and { success: true, data: { user: {...} } }
      const user = userData?.data?.user || userData?.user;
      
      // Cache the user data in localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('AuthService: Cached user data in localStorage');
        return user; // Return just the user data, not the full response
      }
      
      console.log('AuthService: No user data in response');
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  async isAuthenticated() {
    // Check if we have a cached user first
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      return true;
    }
    
    // If no cached user, try to fetch from server
    try {
      const user = await this.getCurrentUser();
      return !!user; // user is now the user object directly, not wrapped in a response
    } catch (error) {
      return false;
    }
  },

  async startPasswordlessLogin(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/passwordless/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to start passwordless login');
    }

    return response.json();
  },

  async verifyPasswordlessLogin(email: string, code: string) {
    console.log('AuthService: Verifying passwordless login', { email, code: code.substring(0, 2) + '****' });
    
    const response = await fetch(`${API_BASE_URL}/auth/passwordless/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
      credentials: 'include',
    });

    console.log('AuthService: Passwordless verify response', { status: response.status, ok: response.ok });
    
    const responseData = await response.json();
    console.log('AuthService: Passwordless verify response data', { responseData });
    
    if (!response.ok) {
      console.error('AuthService: Passwordless verify failed', { error: responseData.message });
      throw new Error(responseData.message || 'Invalid verification code');
    }

    // Store user data in localStorage for immediate access
    if (responseData.user) {
      localStorage.setItem('user', JSON.stringify(responseData.user));
      console.log('AuthService: User data stored in localStorage');
    }

    return responseData;
  },

  getGoogleOAuthUrl(redirectTo: string = '/') {
    const state = encodeURIComponent(JSON.stringify({ redirectTo }));
    return `${API_BASE_URL}/auth/google?state=${state}`;
  },

  async startPasswordlessSignup(email: string) {
    // For signup, we use the same passwordless login endpoint
    // The backend will handle whether it's login or signup based on user existence
    return this.startPasswordlessLogin(email);
  },

  async submitFullName(sessionToken: string, fullName: string) {
    const response = await fetch(`${API_BASE_URL}/auth/passwordless/submit-name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionToken, fullName }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit full name');
    }

    return response.json();
  },

  async completeRegistration(sessionToken: string) {
    const response = await fetch(`${API_BASE_URL}/auth/passwordless/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionToken }),
      credentials: 'include',
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to complete registration');
    }

    // Store user data in localStorage for immediate access
    if (responseData.user) {
      localStorage.setItem('user', JSON.stringify(responseData.user));
    }

    return responseData;
  }
};
