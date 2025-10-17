import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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

export default function SignupName() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    submitFullName,
    completeRegistration,
    error: authError, 
    loading: authLoading, 
    authStep 
  } = useAuth();
  
  const email = searchParams.get('email');
  const sessionToken = searchParams.get('sessionToken');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email || !sessionToken) {
      navigate('/signup');
    }
  }, [email, sessionToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !sessionToken) return;
    
    try {
      setError('');
      
      // Submit full name
      await submitFullName(sessionToken, fullName.trim());
      
      // Complete registration
      await completeRegistration(sessionToken);
      
    } catch (error) {
      console.error('Name submission error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save full name');
    }
  };

  if (!email || !sessionToken) {
    return null; // Will redirect to signup
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
          <div style={{ marginBottom: '1px' }}>What should we <i style={{ color: '#FFA500' }} className="brand-text lowercase">call</i> you?</div>
          <div style={{ fontSize: '1.1rem', opacity: 0.7, marginTop: '1rem' }}>
            Enter your full name to complete your account setup
          </div>
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
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              style={{
                ...inputStyle,
                opacity: authLoading ? 0.7 : 1,
                cursor: authLoading ? 'not-allowed' : 'text'
              }}
              disabled={authLoading}
              required
              minLength={2}
              maxLength={100}
              autoFocus
            />
            
            <button
              type="submit"
              disabled={authLoading || !fullName.trim()}
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: (authLoading || !fullName.trim()) ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                opacity: (authLoading || !fullName.trim()) ? 0.7 : 1,
                marginBottom: '1rem',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                if (!authLoading && fullName.trim()) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = (authLoading || !fullName.trim()) ? '0.7' : '1';
              }}
            >
              {authLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Complete signup'
              )}
            </button>
          </form>
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
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}