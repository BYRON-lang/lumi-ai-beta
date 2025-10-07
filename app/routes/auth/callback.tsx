import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';
import { authService } from '~/services/auth';

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
    const error = searchParams.get('error');
    const token = searchParams.get('token');
    const redirectTo = searchParams.get('redirectTo') || '/';
    
    const completeAuth = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token received');
        }
        
        // Save the token
        await setToken(token);
        
        // Redirect to the intended URL or home
        navigate(redirectTo);
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirect to login after showing error
        setTimeout(() => navigate('/login'), 5000);
      }
    };

    if (error) {
      setError(decodeURIComponent(error));
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Redirect to login after showing error
      setTimeout(() => navigate('/login'), 5000);
    } else {
      completeAuth();
    }
  }, [searchParams, navigate, setToken]);
  
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
