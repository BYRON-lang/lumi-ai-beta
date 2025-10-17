import { useEffect, useState } from 'react';

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
    console.log('AuthCallback: useEffect running');
    
    // Simple redirect without any complex logic
    setTimeout(() => {
      console.log('AuthCallback: Redirecting to home');
      window.location.href = '/home';
    }, 1000);
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