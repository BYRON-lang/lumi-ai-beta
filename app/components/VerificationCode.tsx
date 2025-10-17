import React, { useState, useRef, useEffect } from 'react';

interface VerificationCodeProps {
  onCodeComplete: (code: string) => void;
  onCodeChange?: (code: string) => void;
  loading?: boolean;
  error?: string;
  length?: number;
  autoFocus?: boolean;
}

export default function VerificationCode({
  onCodeComplete,
  onCodeChange,
  loading = false,
  error,
  length = 6,
  autoFocus = true,
}: VerificationCodeProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, value: string) => {
    if (loading) return;

    // Only allow digits
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    
    if (sanitizedValue.length > 1) {
      // Handle paste case
      const digits = sanitizedValue.slice(0, length).split('');
      const newCode = [...code];
      
      digits.forEach((digit, i) => {
        if (index + i < length) {
          newCode[index + i] = digit;
        }
      });
      
      setCode(newCode);
      onCodeChange?.(newCode.join(''));
      
      // Focus next empty input or last input if all filled
      const nextEmptyIndex = newCode.findIndex((digit, i) => i > index && !digit);
      const focusIndex = nextEmptyIndex === -1 ? Math.min(index + digits.length, length - 1) : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
      setActiveIndex(focusIndex);
      
      // Check if code is complete
      if (newCode.every(digit => digit) && newCode.join('').length === length) {
        onCodeComplete(newCode.join(''));
      }
    } else {
      // Single character input
      const newCode = [...code];
      newCode[index] = sanitizedValue;
      setCode(newCode);
      onCodeChange?.(newCode.join(''));
      
      // Move to next input if current is filled
      if (sanitizedValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
        setActiveIndex(index + 1);
      }
      
      // Check if code is complete
      if (newCode.every(digit => digit) && newCode.join('').length === length) {
        onCodeComplete(newCode.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (loading) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (code[index]) {
        // Clear current input
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
        onCodeChange?.(newCode.join(''));
      } else if (index > 0) {
        // Move to previous input and clear it
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        onCodeChange?.(newCode.join(''));
        inputRefs.current[index - 1]?.focus();
        setActiveIndex(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handleFocus = (index: number) => {
    setActiveIndex(index);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/[^0-9]/g, '').slice(0, length);
    
    if (digits) {
      const newCode = digits.split('').concat(Array(length).fill('')).slice(0, length);
      setCode(newCode);
      onCodeChange?.(newCode.join(''));
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newCode.findIndex(digit => !digit);
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
      setActiveIndex(focusIndex);
      
      // Check if code is complete
      if (newCode.every(digit => digit)) {
        onCodeComplete(newCode.join(''));
      }
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div 
        style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            onPaste={handlePaste}
            disabled={loading}
            style={{
              width: '48px',
              height: '48px',
              border: `2px solid ${
                error 
                  ? '#ef4444' 
                  : activeIndex === index 
                    ? '#ffffff' 
                    : '#404040'
              }`,
              borderRadius: '8px',
              backgroundColor: '#2d2d2d',
              color: 'white',
              fontSize: '20px',
              fontWeight: '600',
              textAlign: 'center',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: activeIndex === index ? '0 0 0 3px rgba(255, 255, 255, 0.1)' : 'none',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'text',
            }}
            onMouseEnter={(e) => {
              if (!loading && !error) {
                e.currentTarget.style.borderColor = '#666666';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && activeIndex !== index) {
                e.currentTarget.style.borderColor = error ? '#ef4444' : '#404040';
              }
            }}
          />
        ))}
      </div>
      
      {error && (
        <div 
          style={{
            color: '#ef4444',
            fontSize: '14px',
            textAlign: 'center',
            marginTop: '8px'
          }}
        >
          {error}
        </div>
      )}
      
      <div 
        style={{
          color: '#888888',
          fontSize: '14px',
          textAlign: 'center',
          marginTop: '8px'
        }}
      >
        Enter the {length}-digit code sent to your email
      </div>
    </div>
  );
}