import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import { authService } from '~/services/auth';

export default function Signup() {
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      await signup(formData.email, formData.password, formData.name);
    } catch (error) {
      console.error('Signup error:', error);
      setFormError(error instanceof Error ? error.message : 'Signup failed');
    }
  };
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
        <div style={{ fontSize: '2rem', opacity: 0.9, lineHeight: '1.6' }}>
          <div style={{ marginBottom: '1px' }}>Sign up below to <i style={{ color: '#FFA500' }}>experience</i></div>
          <div>the full potential of Lumi</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '1rem' }}>
            By continuing you accept to our privacy and policy
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
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
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
          
          {/* Error Message */}
          {(error || formError) && (
            <div style={{
              color: '#ff6b6b',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              minHeight: '1.25rem'
            }}>
              {error || formError}
            </div>
          )}
          
          {/* Signup Form */}
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '350px', margin: '0 auto' }}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={{
                ...inputStyle,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'text',
                marginBottom: '0.5rem'
              }}
              disabled={loading}
              required
              minLength={2}
              maxLength={100}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{
                ...inputStyle,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'text',
                marginBottom: '0.5rem'
              }}
              disabled={loading}
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              style={{
                ...inputStyle,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'text'
              }}
              disabled={loading}
              minLength={8}
              required
            />
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.email || !formData.password}
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                opacity: (loading || !formData.email || !formData.password) ? 0.7 : 1,
                marginBottom: '1rem',
                marginTop: '1rem'
              }}
              onMouseOver={(e) => {
                if (!loading && formData.email && formData.password) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = (loading || !formData.email || !formData.password) ? '0.7' : '1';
              }}
            >
              {loading ? 'Creating Account...' : 'Continue with email'}
            </button>
          </form>
          
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1rem', 
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
    </div>
  );
}