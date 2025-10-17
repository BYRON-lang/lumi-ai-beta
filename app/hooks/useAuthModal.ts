import { useState, useCallback } from 'react';

interface AuthModalState {
  isOpen: boolean;
  remainingMessages: number;
  resetTime: string | null;
}

export const useAuthModal = () => {
  const [modalState, setModalState] = useState<AuthModalState>({
    isOpen: false,
    remainingMessages: 0,
    resetTime: null
  });

  const showAuthModal = useCallback((remainingMessages: number = 0, resetTime?: string) => {
    setModalState({
      isOpen: true,
      remainingMessages,
      resetTime: resetTime || null
    });
  }, []);

  const hideAuthModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const handleLogin = useCallback(() => {
    // TODO: Implement login logic
    console.log('Login clicked');
    hideAuthModal();
  }, [hideAuthModal]);

  const handleSignup = useCallback(() => {
    // TODO: Implement signup logic
    console.log('Signup clicked');
    hideAuthModal();
  }, [hideAuthModal]);

  return {
    modalState,
    showAuthModal,
    hideAuthModal,
    handleLogin,
    handleSignup
  };
};
