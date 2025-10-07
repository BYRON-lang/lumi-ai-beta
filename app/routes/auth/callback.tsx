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
        const response = await fetch(`${config.API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData?.error || 'Failed to authenticate');
        }

        const userData = responseData.data?.user || responseData.user;
        
        if (!userData) {
          throw new Error('No user data received');
        }

        // Store user data
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirect to home page
        navigate('/', { replace: true });

      } catch (err) {
        console.error('Authentication error:', err);
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
