import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VerificationCode from '../components/VerificationCode';

export default function LoginVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    verifyCode, 
    error: authError, 
    loading: authLoading, 
    startPasswordlessLogin 
  } = useAuth();
  
  const email = searchParams.get('email');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleCodeVerification = async (code: string) => {
    if (!email) return;
    
    try {
      setError('');
      await verifyCode(email, code);
    } catch (error) {
      console.error('Code verification error:', error);
      setError(error instanceof Error ? error.message : 'Invalid verification code');
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    try {
      setError('');
      await startPasswordlessLogin(email);
    } catch (error) {
      console.error('Resend code error:', error);
      setError(error instanceof Error ? error.message : 'Failed to resend code');
    }
  };

  if (!email) {
    return null; // Will redirect to login
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
        <div style={{ fontSize: '2rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1px' }}>Check your <i style={{ color: '#FFA500' }} className="brand-text lowercase">email</i></div>
          <div>for your verification code</div>
        </div>

        <div style={{ 
          fontSize: '1.1rem', 
          marginBottom: '2rem', 
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: '1.5'
        }}>
          We sent a 6-digit verification code to<br />
          <strong style={{ color: 'white' }}>{email}</strong>
        </div>
        
        <div style={{ width: '100%', maxWidth: '350px', margin: '0 auto' }}>
          {/* Error Message */}
          {(authError || error) && (
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              {authError || error}
            </div>
          )}
          
          <VerificationCode
            onCodeComplete={handleCodeVerification}
            loading={authLoading}
            error={error}
            length={6}
            autoFocus={true}
          />
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              onClick={handleResendCode}
              disabled={authLoading}
              style={{
                background: 'none',
                border: 'none',
                color: authLoading ? '#666' : '#888888',
                fontSize: '14px',
                cursor: authLoading ? 'not-allowed' : 'pointer',
                textDecoration: 'underline',
                marginBottom: '1rem'
              }}
              onMouseEnter={(e) => {
                if (!authLoading) {
                  (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!authLoading) {
                  (e.currentTarget as HTMLButtonElement).style.color = '#888888';
                }
              }}
            >
              {authLoading ? 'Sending...' : 'Resend verification code'}
            </button>
            
            <div>
              <Link 
                to="/login" 
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#888888',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#888888'; }}
              >
                Use a different email address
              </Link>
            </div>
          </div>
        </div>

        <div style={{ 
          position: 'absolute', 
          bottom: '2rem', 
          left: '50%', 
          transform: 'translateX(-50%)',
          textAlign: 'center', 
          fontSize: '0.9rem', 
          color: 'rgba(255, 255, 255, 0.7)' 
        }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}