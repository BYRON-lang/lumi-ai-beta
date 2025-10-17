import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';
import { authService } from '~/services/auth';
import config from '~/config';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#171717',
    color: 'white',
    padding: '1rem',
    textAlign: 'center' as const,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    backgroundColor: '#262624',
    borderRadius: '16px',
    padding: '3rem 2rem',
    maxWidth: '400px',
    width: '100%',
    border: '1px solid #3a3a3a',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '3px solid #3a3a3a',
    borderTop: '3px solid #FFA500',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'white',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '2rem',
    lineHeight: '1.5',
  },
  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#ff6b6b',
  },
  errorMessage: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  redirectMessage: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  logo: {
    width: '32px',
    height: '32px',
    margin: '0 auto 1rem',
    filter: 'invert(55%) sepia(95%) saturate(1000%) hue-rotate(350deg) brightness(100%) contrast(100%)',
  },
};

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const completeAuth = async () => {
      try {
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');
        const authSuccess = url.searchParams.get('auth');
        const state = url.searchParams.get('state');

        console.log('AuthCallback: Processing callback', { 
          token: !!token, 
          authSuccess,
          state,
          fullUrl: window.location.href,
          searchParams: Object.fromEntries(url.searchParams.entries())
        });

        // Check if this is from Windows app via state parameter
        let isWindowsApp = false;
        if (state) {
          try {
            const stateData = JSON.parse(decodeURIComponent(state));
            isWindowsApp = stateData.platform === 'windows';
          } catch (e) {
            console.log('Could not parse state parameter:', e);
          }
        }

        // If we're on the home page without a token, redirect to login
        if (window.location.pathname === '/' && !token && !authSuccess) {
          console.log('AuthCallback: On home page without auth params, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }

        // For web app, the OAuth callback sets an HTTP-only cookie
        // We don't need the token parameter for web app authentication
        // We need to validate the authentication by calling /auth/me
        console.log('AuthCallback: Validating authentication with cookie');
        try {
          // The backend sets an HTTP-only cookie, so we just need to call /auth/me
          const response = await fetch(`${config.API_BASE_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include', // This will send the HTTP-only cookie
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Authentication validation failed');
          }

          const userData = await response.json();
          console.log('AuthCallback: User data received', { userData });
          
          // Handle both response structures: { user: {...} } and { success: true, data: { user: {...} } }
          const user = userData?.data?.user || userData?.user;
          
          if (user) {
            // Store user data in localStorage for immediate access
            localStorage.setItem('user', JSON.stringify(user));
            console.log('AuthCallback: User authenticated successfully');
          } else {
            throw new Error('Invalid user data received');
          }
        } catch (error) {
          console.error('AuthCallback: Authentication validation failed:', error);
          throw new Error('Failed to authenticate user');
        }

        // Check if we need to redirect to Windows app
        if (isWindowsApp) {
          console.log('AuthCallback: Redirecting to Windows app with token');
          window.location.href = `http://localhost:3948/auth-callback?token=${token}`;
        } else {
          // Clean up URL and redirect to auth-loading page
          window.history.replaceState({}, document.title, '/auth-loading');
          navigate('/auth-loading', { replace: true });
        }

      } catch (err) {
        console.error('AuthCallback: Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Redirect to login with error
        navigate('/', {
          state: {
            error: err instanceof Error ? err.message : 'Authentication failed',
          },
          replace: true
        });
      }
    };

    completeAuth();
  }, []); // Remove dependencies to prevent infinite loop
  
  // Show a loading state while processing
  if (!error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <img src="/logo.png" alt="Lumi" style={styles.logo} />
          <div style={styles.spinner} />
          <h2 style={styles.title}>Completing Authentication</h2>
          <p style={styles.subtitle}>
            Please wait while we log you in securely...
          </p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src="/logo.png" alt="Lumi" style={styles.logo} />
        <h2 style={styles.errorTitle}>Authentication Error</h2>
        <p style={styles.errorMessage}>{error}</p>
        <p style={styles.redirectMessage}>Redirecting to login page...</p>
      </div>
    </div>
  );
}
