import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import { authService } from '~/services/auth';
import VerificationCode from '~/components/VerificationCode';

export default function Signup() {
  const { 
    startPasswordlessSignup, 
    verifyCode, 
    submitFullName, 
    completeRegistration,
    loading, 
    error, 
    authStep 
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [formError, setFormError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    // Check for error in URL params (e.g., from OAuth callback)
    const error = searchParams.get('error');
    if (error) {
      setFormError(decodeURIComponent(error));
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    window.location.href = authService.getGoogleOAuthUrl();
  };

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email) {
      setFormError('Please enter your email address');
      return;
    }

    try {
      await startPasswordlessSignup(email);
    } catch (error) {
      console.error('Signup error:', error);
      setFormError(error instanceof Error ? error.message : 'Signup failed');
    }
  };

  const handleCodeVerification = async (code: string) => {
    try {
      setFormError('');
      await verifyCode(email, code);
    } catch (error) {
      console.error('Code verification error:', error);
      setFormError(error instanceof Error ? error.message : 'Invalid verification code');
    }
  };

  const handleFullNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Please enter your full name');
      return;
    }

    if (!authStep?.sessionToken) {
      setFormError('Session expired. Please start over.');
      return;
    }

    try {
      await submitFullName(authStep.sessionToken, fullName.trim());
      // Auto-complete registration after submitting name
      await completeRegistration(authStep.sessionToken);
    } catch (error) {
      console.error('Full name submission error:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to complete registration');
    }
  };
  const renderEmailStep = () => (
    <>
      <div style={{ fontSize: '2rem', opacity: 0.9, lineHeight: '1.6' }}>
        <div style={{ marginBottom: '1px' }}>Sign up below to <i style={{ color: '#FFA500' }} className="brand-text lowercase">experience</i></div>
        <div>the full potential of <span className="brand-text lowercase">lumi</span></div>
        <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '1rem' }}>
          By continuing you accept to our privacy and policy
        </div>
      </div>

      {/* Google Sign In Button */}
      <button 
        onClick={handleGoogleSignup}
        disabled={isGoogleLoading || loading}
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
          cursor: isGoogleLoading || loading ? 'not-allowed' : 'pointer',
          opacity: isGoogleLoading || loading ? 0.7 : 1,
          width: '100%',
          maxWidth: '350px',
          transition: 'opacity 0.2s',
          margin: '2rem auto 0',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.14 8.33v-2.6h6.69c.1.44.18.85.18 1.44 0 4-2.74 6.84-6.86 6.84S0 10.86 0 7s3.2-7 7.14-7c1.93 0 3.54.69 4.78 1.83L9.89 3.76c-.51-.48-1.41-1.04-2.75-1.04c-2.36 0-4.29 1.93-4.29 4.28s1.93 4.28 4.29 4.28c2.74 0 3.74-1.86 3.93-2.95H7.13Z" fill="#000000"/>
        </svg>
        {isGoogleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
      </button>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        margin: '1.5rem 0',
        maxWidth: '350px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
        <span style={{ padding: '0 1rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>or</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
      </div>
      
      <form onSubmit={handleEmailSubmit} style={{ width: '100%', maxWidth: '350px', margin: '0 auto' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          style={{
            ...inputStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'text'
          }}
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading || !email}
          style={{
            width: '100%',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading || !email ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s',
            opacity: loading || !email ? 0.7 : 1,
            marginBottom: '1rem',
            marginTop: '1rem'
          }}
        >
          {loading ? 'Sending...' : 'Continue with email'}
        </button>
      </form>
    </>
  );

  const renderVerificationStep = () => (
    <>
      <div style={{ fontSize: '2rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1px' }}>Check your <i style={{ color: '#FFA500' }} className="brand-text lowercase">email</i></div>
        <div>for the verification code</div>
        <div style={{ fontSize: '1rem', opacity: 0.7, marginTop: '1rem' }}>
          We sent a 6-digit code to <strong>{email}</strong>
        </div>
      </div>

      <VerificationCode
        onCodeComplete={handleCodeVerification}
        loading={loading}
        error={formError}
        length={6}
        autoFocus={true}
      />

      <button
        onClick={() => {
          // Reset to email step
          setEmail('');
          setFormError('');
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#888888',
          fontSize: '14px',
          cursor: 'pointer',
          textDecoration: 'underline',
          marginTop: '16px'
        }}
      >
        Use a different email address
      </button>
    </>
  );

  const renderFullNameStep = () => (
    <>
      <div style={{ fontSize: '2rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1px' }}>What should we <i style={{ color: '#FFA500' }} className="brand-text lowercase">call</i> you?</div>
        <div style={{ fontSize: '1rem', opacity: 0.7, marginTop: '1rem' }}>
          Enter your full name to complete your account setup
        </div>
      </div>

      <form onSubmit={handleFullNameSubmit} style={{ width: '100%', maxWidth: '350px', margin: '0 auto' }}>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          style={{
            ...inputStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'text'
          }}
          disabled={loading}
          required
          minLength={2}
          maxLength={100}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !fullName.trim()}
          style={{
            width: '100%',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading || !fullName.trim() ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s',
            opacity: loading || !fullName.trim() ? 0.7 : 1,
            marginBottom: '1rem',
            marginTop: '1rem'
          }}
        >
          {loading ? 'Creating account...' : 'Complete signup'}
        </button>
      </form>
    </>
  );

  const getCurrentStep = () => {
    if (!authStep || authStep.step === 'email_sent') {
      return authStep ? 'verification' : 'email';
    }
    if (authStep.step === 'name_required') {
      return 'fullname';
    }
    return 'email';
  };

  const currentStep = getCurrentStep();

  return (
    <div style={{
      backgroundColor: '#171717',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      padding: '1rem'
    }}>
      <div style={{ 
        textAlign: 'center', 
        width: '100%',
        maxWidth: '500px',
        padding: '2rem',
        margin: '0 auto'
      }}>
        {/* Error Message */}
        {(error || formError) && (
          <div style={{
            color: '#ff6b6b',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error || formError}
          </div>
        )}

        {/* Step Content */}
        {currentStep === 'email' && renderEmailStep()}
        {currentStep === 'verification' && renderVerificationStep()}
        {currentStep === 'fullname' && renderFullNameStep()}
        
        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem', 
          fontSize: '0.9rem', 
          color: 'rgba(255, 255, 255, 0.7)' 
        }}>
          Already have an account?{' '}
          <a 
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: 500, 
              cursor: 'pointer',
              transition: 'text-decoration 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}