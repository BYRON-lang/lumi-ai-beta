import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  marginBottom: '0.75rem',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  height: '40px',
  backgroundColor: '#2d2d2d',
  color: 'white',
  transition: 'background-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
  outline: 'none',
};

export default function Login() {
  const navigate = useNavigate();
  const { 
    user,
    startPasswordlessLogin, 
    error: authError, 
    loading: authLoading
  } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (user) {
      console.log('Login: User already authenticated, redirecting to home');
      navigate('/home', { replace: true });
      return;
    }

    // Check for error in URL params (e.g., from OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    
    if (error) {
      const errorMessage = error === 'access_denied' 
        ? 'Google login was cancelled. Please try again.'
        : decodeURIComponent(error);
      
      setError(errorMessage);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Auto-clear error after 5 seconds
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      // Get the current path to redirect back after login
      const redirectTo = window.location.pathname || '/';
      // Get the Google OAuth URL with the redirect path
      const authUrl = authService.getGoogleOAuthUrl(redirectTo);
      // Redirect to the auth URL
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating Google login:', error);
      setError('Failed to start Google login. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setError('');
      await startPasswordlessLogin(email);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  }


  return (
    <div style={{
      backgroundColor: '#171717',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      width: '100%',
      margin: 0,
      padding: '1rem'
    }}>
      <div style={{ 
        textAlign: 'center', 
        width: '100%',
        maxWidth: '500px',
        padding: '2rem',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '2rem', opacity: 0.9, lineHeight: '1.6' }}>
          <div style={{ marginBottom: '1px' }}>Sign in to <i style={{ color: '#FFA500' }} className="brand-text lowercase">continue</i></div>
          <div>your journey with <span className="brand-text lowercase">lumi</span></div>
          <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '1rem' }}>
            By continuing you accept to our privacy and policy
          </div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <button 
            onClick={handleGoogleLogin}
            disabled={authLoading || isGoogleLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '1rem',
              fontWeight: '500',
              marginTop: '2rem',
              cursor: authLoading || isGoogleLoading ? 'not-allowed' : 'pointer',
              opacity: authLoading || isGoogleLoading ? 0.7 : 1,
              width: '100%',
              maxWidth: '350px',
              transition: 'opacity 0.2s',
              margin: '2rem auto 0',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = authLoading || isGoogleLoading ? '0.7' : '1')}
          >
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.14 8.33v-2.6h6.69c.1.44.18.85.18 1.44 0 4-2.74 6.84-6.86 6.84S0 10.86 0 7s3.2-7 7.14-7c1.93 0 3.54.69 4.78 1.83L9.89 3.76c-.51-.48-1.41-1.04-2.75-1.04c-2.36 0-4.29 1.93-4.29 4.28s1.93 4.28 4.29 4.28c2.74 0 3.74-1.86 3.93-2.95H7.13Z" fill="#000000"/>
            </svg>
            {isGoogleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
            <span style={{ padding: '0 1rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
          </div>
          
          <div style={{ width: '100%', maxWidth: '350px', margin: '0 auto' }}>
            {/* Error Message */}
            {(authError || error) && (
              <div style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {authError || error}
              </div>
            )}
            
            {/* Email Step */}
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={inputStyle}
                disabled={authLoading}
              />
              
              <button
                type="submit"
                disabled={authLoading || !email}
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: (authLoading || !email) ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s',
                  opacity: (authLoading || !email) ? 0.7 : 1,
                  marginBottom: '1rem',
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  if (!authLoading && email) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.opacity = (authLoading || !email) ? '0.7' : '1';
                }}
              >
                {authLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending code...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </form>
            
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
