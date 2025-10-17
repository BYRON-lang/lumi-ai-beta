import { useState, useEffect, useCallback } from 'react';

export type CookieConsentStatus = 'accepted' | 'declined' | 'customized' | null;

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

export const useCookieConsent = () => {
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true
    analytics: true,
    functional: true,
    marketing: false
  });

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedConsent = localStorage.getItem('lumi-cookie-consent');
    const savedPreferences = localStorage.getItem('lumi-cookie-preferences');
    
    if (savedConsent) {
      setConsentStatus(savedConsent as CookieConsentStatus);
    }
    
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  const acceptAll = useCallback(() => {
    const newPreferences = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true
    };
    
    setConsentStatus('accepted');
    setPreferences(newPreferences);
    
    localStorage.setItem('lumi-cookie-consent', 'accepted');
    localStorage.setItem('lumi-cookie-preferences', JSON.stringify(newPreferences));
    
    // Initialize analytics and other services
    initializeServices(newPreferences);
  }, []);

  const declineNonEssential = useCallback(() => {
    const newPreferences = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false
    };
    
    setConsentStatus('declined');
    setPreferences(newPreferences);
    
    localStorage.setItem('lumi-cookie-consent', 'declined');
    localStorage.setItem('lumi-cookie-preferences', JSON.stringify(newPreferences));
    
    // Initialize only essential services
    initializeServices(newPreferences);
  }, []);

  const saveCustomPreferences = useCallback((newPreferences: Partial<CookiePreferences>) => {
    const updatedPreferences = {
      ...preferences,
      ...newPreferences,
      essential: true // Always true
    };
    
    setConsentStatus('customized');
    setPreferences(updatedPreferences);
    
    localStorage.setItem('lumi-cookie-consent', 'customized');
    localStorage.setItem('lumi-cookie-preferences', JSON.stringify(updatedPreferences));
    
    // Initialize services based on preferences
    initializeServices(updatedPreferences);
  }, [preferences]);

  const initializeServices = useCallback((prefs: CookiePreferences) => {
    // Initialize Google Analytics if analytics is enabled
    if (prefs.analytics && typeof window !== 'undefined') {
      // Add Google Analytics initialization here
      console.log('Analytics cookies enabled');
    }
    
    // Initialize other services based on preferences
    if (prefs.functional) {
      console.log('Functional cookies enabled');
    }
    
    if (prefs.marketing) {
      console.log('Marketing cookies enabled');
    }
  }, []);

  const hasConsented = consentStatus !== null;
  const canUseAnalytics = preferences.analytics;
  const canUseFunctional = preferences.functional;
  const canUseMarketing = preferences.marketing;

  return {
    consentStatus,
    preferences,
    hasConsented,
    canUseAnalytics,
    canUseFunctional,
    canUseMarketing,
    acceptAll,
    declineNonEssential,
    saveCustomPreferences
  };
};
