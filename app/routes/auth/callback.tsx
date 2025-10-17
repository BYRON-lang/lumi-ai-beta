import { useEffect, useState } from 'react';
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
  const [error, setError] = useState('');

  console.log('AuthCallback: Component rendered');

  useEffect(() => {
    const validateAuth = async () => {
      try {
        console.log('AuthCallback: Validating authentication with cookie');
        console.log('AuthCallback: Making request to', `${config.API_BASE_URL}/auth/me`);
        console.log('AuthCallback: Current cookies', document.cookie);
        
        // Validate the authentication by calling /auth/me
        const response = await fetch(`${config.API_BASE_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include', // This will send the HTTP-only cookie
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('AuthCallback: Response status', response.status, response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('AuthCallback: Response error', errorText);
          throw new Error(`Authentication validation failed: ${response.status} ${response.statusText}`);
        }

        const userData = await response.json();
        console.log('AuthCallback: User data received', { userData });
        console.log('AuthCallback: User data structure', {
          hasData: !!userData?.data,
          hasUser: !!userData?.user,
          dataUser: userData?.data?.user,
          directUser: userData?.user,
          keys: Object.keys(userData || {}),
          fullStructure: JSON.stringify(userData, null, 2)
        });
        
        // Handle both response structures: { user: {...} } and { success: true, data: { user: {...} } }
        const user = userData?.data?.user || userData?.user;
        console.log('AuthCallback: Extracted user', { user });
        
        if (user) {
          // Store user data in localStorage for immediate access
          localStorage.setItem('user', JSON.stringify(user));
          console.log('AuthCallback: User authenticated successfully');
          
          // Redirect to home
          console.log('AuthCallback: Redirecting to home');
          window.location.href = '/home';
        } else {
          console.error('AuthCallback: No user found in response', {
            userData,
            extractedUser: user,
            dataUser: userData?.data?.user,
            directUser: userData?.user
          });
          
          // Try fallback: check if we have a token in the URL
          const url = new URL(window.location.href);
          const token = url.searchParams.get('token');
          
          if (token) {
            console.log('AuthCallback: Trying fallback with URL token');
            // For now, just redirect to home and let the home page handle auth
            // This is a temporary workaround
            window.location.href = '/home';
            return;
          }
          
          throw new Error('Invalid user data received');
        }
      } catch (err) {
        console.error('AuthCallback: Authentication validation failed:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');

        // Redirect to login on error
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    };

    validateAuth();
  }, []);
  
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
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '1rem', textAlign: 'left' }}>
            <p>Debug Info:</p>
            <p>URL: {window.location.href}</p>
            <p>Cookies: {document.cookie || 'None'}</p>
          </div>
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