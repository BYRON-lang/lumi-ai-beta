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

        console.log('AuthCallback: Processing token from URL:', token ? 'Token found' : 'No token');

        if (!token) {
          // Check if we have auth=success but no token - this might be the issue
          const authSuccess = url.searchParams.get('auth');
          if (authSuccess === 'success') {
            console.log('AuthCallback: auth=success but no token, trying to get user data');
            // Try to get user data directly using the setToken method
            try {
              await setToken(''); // This will trigger the AuthContext to fetch user data
              window.history.replaceState({}, document.title, window.location.pathname);
              navigate('/', { replace: true });
              return;
            } catch (fallbackError) {
              console.error('AuthCallback: Fallback authentication failed:', fallbackError);
            }
          }

          throw new Error('No authentication token found in the URL');
        }

        // Use the AuthContext's setToken method to properly authenticate
        console.log('AuthCallback: Calling setToken with token');
        await setToken(token);
        console.log('AuthCallback: setToken completed successfully');

        // Clean up URL and redirect
        window.history.replaceState({}, document.title, window.location.pathname);
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
  }, [navigate, setToken]);
  
  // Show a loading state while processing
  if (!error) {
    return (
      <div style={styles.container}>
        <h2>Completing Authentication...</h2>
        <p>Please wait while we log you in.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {error ? (
        <>
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <p>Redirecting to login page...</p>
        </>
      ) : (
        <>
          <h2>Completing Authentication...</h2>
          <p>Please wait while we log you in.</p>
        </>
      )}
    </div>
  );
}
