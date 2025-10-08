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
  const { setToken } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const completeAuth = async () => {
      try {
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');
        const authSuccess = url.searchParams.get('auth');

        console.log('AuthCallback: Processing callback', { 
          token: !!token, 
          authSuccess,
          fullUrl: window.location.href,
          searchParams: Object.fromEntries(url.searchParams.entries())
        });

        // If we're on the home page without a token, redirect to login
        if (window.location.pathname === '/' && !token && !authSuccess) {
          console.log('AuthCallback: On home page without auth params, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }

        if (!token) {
          throw new Error('No authentication token found in the URL');
        }

        // Use the AuthContext's setToken method to properly authenticate
        console.log('AuthCallback: Calling setToken with token');
        await setToken(token);
        console.log('AuthCallback: setToken completed successfully');

        // Clean up URL and redirect to home page
        window.history.replaceState({}, document.title, '/');
        navigate('/', { replace: true });

      } catch (err) {
        console.error('AuthCallback: Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Redirect to login with error
        navigate('/login', {
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
