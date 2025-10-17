import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';
import config from '~/config';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyPasswordlessLogin } = useAuth();
  const email = searchParams.get('email') || '';
  const [digits, setDigits] = React.useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start the countdown when component mounts
    startCountdown();
    
    // Clear interval on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Check for complete 6-digit code
  useEffect(() => {
    const code = digits.join('');
    if (code.length === 6) {
      verifyCode(code);
    }
  }, [digits]);

  const startCountdown = () => {
    setCanResend(false);
    setResendTimer(30);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const verifyCode = async (code: string) => {
    setIsLoading(true);
    setVerificationError('');
    
    try {
      // Use the AuthContext method for passwordless login verification
      await verifyPasswordlessLogin(email, code);
      
      // If successful, redirect to auth loading page to verify authentication
      navigate('/auth-loading', {
        state: {
          message: 'Welcome! Your email has been verified and you are now logged in.',
        },
        replace: true
      });
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : 'Verification failed. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!canResend || !email) return;
    
    try {
      setVerificationError('');
      const response = await fetch(
        `${config.API_BASE_URL}/auth/resend-verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to resend verification email');
      }
      
      startCountdown();
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : 'Failed to resend verification email');
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow one digit per box
    
    const newDigits = [...digits];
    newDigits[index] = value.replace(/[^0-9]/g, ''); // Only allow numbers
    setDigits(newDigits);

    // Move to next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Show loading screen during verification
  if (isLoading) {
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
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #333',
          borderTop: '3px solid #FFA500',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{
          marginTop: '1rem',
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.7)',
        }}>
          Verifying your email...
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
      <div style={{ 
        textAlign: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{ 
          fontWeight: 500,
          marginBottom: '0.5rem'
        }}>
          Verify Your Email
        </div>
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '1rem',
          marginBottom: '0.5rem'
        }}>
          Enter the 6-digit code sent to
        </div>
        <div style={{ 
          color: '#FFA500',
          fontWeight: 500,
          wordBreak: 'break-all',
          padding: '0 1rem',
          marginBottom: '2rem'
        }}>
          {email || 'your email'}
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '2rem',
        justifyContent: 'center'
      }}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={el => {
              if (el) inputRefs.current[index] = el;
              return undefined;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            style={{
              width: '3.5rem',
              height: '4.5rem',
              fontSize: '2rem',
              textAlign: 'center',
              borderRadius: '8px',
              border: '1px solid #333',
              backgroundColor: '#262626',
              color: 'white',
              outline: 'none',
              caretColor: '#FFA500',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#FFA500';
              e.target.style.boxShadow = '0 0 0 2px rgba(255, 165, 0, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#333';
              e.target.style.boxShadow = 'none';
            }}
          />
        ))}
      </div>
      <div style={{
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.875rem',
        textAlign: 'center',
        marginBottom: '2rem',
        maxWidth: '320px',
        lineHeight: '1.4'
      }}>
        We've sent a 6-digit verification code to your email address. Please check your inbox
      </div>
      
      {verificationError && (
        <div style={{
          color: '#ff6b6b',
          fontSize: '0.875rem',
          textAlign: 'center',
          margin: '-1rem 0 1rem',
          height: '1.25rem'
        }}>
          {verificationError}
        </div>
      )}
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <span style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.875rem',
          whiteSpace: 'nowrap'
        }}>
          Didn't receive the code?
        </span>
        <button
          onClick={handleResendEmail}
          disabled={!canResend}
          style={{
            background: 'none',
            border: 'none',
            color: canResend ? '#FFA500' : 'rgba(255, 255, 255, 0.3)',
            cursor: canResend ? 'pointer' : 'default',
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            transition: 'all 0.2s',
            textDecoration: 'none',
            pointerEvents: canResend ? 'auto' : 'none',
            whiteSpace: 'nowrap',
            margin: 0
          }}
          onMouseOver={(e) => {
            if (canResend) {
              e.currentTarget.style.opacity = '0.8';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
        </button>
      </div>
    </div>
  );
}
