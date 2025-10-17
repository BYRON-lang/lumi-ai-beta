import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthLoading() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Wait for auth loading to complete
      if (authLoading) return;

      // If user is authenticated, redirect to home
      if (user) {
        setAuthCheckComplete(true);
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 1500); // Show success message for 1.5 seconds
        return;
      }

      // If auth loading is complete but no user, authentication failed
      if (!authLoading && !user) {
        setAuthFailed(true);
        setAuthCheckComplete(true);
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000); // Show error message for 3 seconds
      }
    };

    checkAuthStatus();
  }, [user, authLoading, navigate]);

  if (authFailed) {
    return (
      <div style={{
        backgroundColor: '#171717',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '1rem',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            color: '#ef4444'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#ef4444'
          }}>
            Login Failed
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '1rem'
          }}>
            Please try again later
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#171717',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 2rem',
          animation: 'spin 2s linear infinite'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 48 48">
            <path 
              fill="none" 
              stroke="white" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="4" 
              d="M24 4v8m14.142-2.142l-5.657 5.657M44 24h-8m2.142 14.142l-5.657-5.657M24 44v-8M9.858 38.142l5.657-5.657M4 24h8M9.858 9.858l5.657 5.657m.832-9.993l1.53 3.696M5.522 16.346l3.696 1.53M5.522 31.654l3.696-1.531m7.129 12.355l1.53-3.696m13.777 3.696l-1.531-3.696m12.355-7.128l-3.696-1.531m3.696-13.777l-3.696 1.53M31.654 5.522l-1.531 3.696"
            />
          </svg>
        </div>
        
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '0.5rem'
        }}>
          Please wait while we redirect you
        </h1>
        
        {authCheckComplete && user && (
          <p style={{
            fontSize: '1rem',
            color: '#10b981',
            marginBottom: '1rem'
          }}>
            ✓ Authentication successful!
          </p>
        )}
        
        <p style={{
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          {authCheckComplete && user ? 'Redirecting to home page...' : 'Verifying your authentication...'}
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
