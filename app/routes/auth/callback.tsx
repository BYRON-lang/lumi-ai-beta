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
            // Try to get user data directly
            const response = await fetch(`${config.API_BASE_URL}/auth/me`, {
              credentials: 'include',
            });

            if (response.ok) {
              const responseData = await response.json();
              const userData = responseData.data?.user || responseData.user;

              if (userData) {
                localStorage.setItem('user', JSON.stringify(userData));
                window.history.replaceState({}, document.title, window.location.pathname);
                navigate('/', { replace: true });
                return;
              }
            }
          }

          throw new Error('No authentication token found in the URL');
        }

        // Store the token
        localStorage.setItem('token', token);
        console.log('AuthCallback: Token stored, fetching user data');

        // Get user data
        const response = await fetch(`${config.API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const responseData = await response.json();
        console.log('AuthCallback: Response status:', response.status, 'Response data:', responseData);

        if (!response.ok) {
          throw new Error(responseData?.error || 'Failed to authenticate');
        }

        const userData = responseData.data?.user || responseData.user;

        if (!userData) {
          throw new Error('No user data received');
        }

        // Store user data
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('AuthCallback: User data stored, redirecting to home');

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Redirect to home page
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
  }, [navigate]);
  
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
