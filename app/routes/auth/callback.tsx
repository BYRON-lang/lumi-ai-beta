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
        // First, try to handle the Google OAuth callback
        const { user } = await authService.handleGoogleCallback();
        
        // If we have a user, update the auth context
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          
          // Clean up the URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Redirect to home page
          navigate('/', { replace: true });
        } else {
          throw new Error('No user data received from authentication');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirect to login after showing error
        setTimeout(() => navigate('/login', { 
          state: { 
            error: err instanceof Error ? err.message : 'Authentication failed' 
          } 
        }), 3000);
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
