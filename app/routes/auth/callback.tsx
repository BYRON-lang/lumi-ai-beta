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
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');
        const authSuccess = url.searchParams.get('auth');
        
        console.log('AuthCallback: Processing callback', { 
          hasToken: !!token, 
          authSuccess,
          cookies: document.cookie
        });

        // If we have a token in the URL, use it directly
        if (token && authSuccess === 'success') {
          console.log('AuthCallback: Using token from URL');
          
          try {
            // Decode the JWT token to get user info
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('AuthCallback: Token payload', payload);
            
            if (payload.email) {
              const user = {
                id: payload.userId,
                email: payload.email,
                fullName: payload.email.split('@')[0], // Use email prefix as fallback
                isVerified: payload.isVerified || true,
                role: payload.role || 'user'
              };
              
              console.log('AuthCallback: Created user from token', user);
              
              // Store user data in localStorage
              localStorage.setItem('user', JSON.stringify(user));
              console.log('AuthCallback: User stored in localStorage');
              
              // Redirect to home
              console.log('AuthCallback: Redirecting to home');
              window.location.href = '/home';
              return;
            }
          } catch (tokenError) {
            console.error('AuthCallback: Token decode error', tokenError);
          }
        }

        // Fallback: try cookie-based authentication
        console.log('AuthCallback: Trying cookie-based authentication');
        console.log('AuthCallback: Making request to', `${config.API_BASE_URL}/auth/me`);
        
        const response = await fetch(`${config.API_BASE_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('AuthCallback: Response status', response.status, response.ok);

        if (response.ok) {
          const userData = await response.json();
          console.log('AuthCallback: User data received', { userData });
          
          const user = userData?.data?.user || userData?.user;
          
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            console.log('AuthCallback: User authenticated successfully');
            window.location.href = '/home';
            return;
          }
        }

        // If both methods fail, show error
        console.error('AuthCallback: All authentication methods failed');
        setError('Authentication failed. Please try again.');
        
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);

      } catch (err) {
        console.error('AuthCallback: Authentication error:', err);
        setError('Authentication failed. Please try again.');
        
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
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