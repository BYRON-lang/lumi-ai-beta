import React, { useState, useEffect } from 'react';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
  onCustomize: (preferences: { analytics: boolean; functional: boolean; marketing: boolean }) => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onDecline,
  onCustomize
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: true,
    functional: true,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('lumi-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('lumi-cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('lumi-cookie-consent', 'declined');
    setIsVisible(false);
    onDecline();
  };

  const handleCustomize = () => {
    setShowDetails(true);
  };

  const handleSavePreferences = () => {
    onCustomize(preferences);
    setIsVisible(false);
  };

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="bg-[#1f1f1f] rounded-lg border border-[#3a3a3a] max-w-6xl mx-auto shadow-2xl">
        {/* Header - Compact */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">
              Cookie Preferences
            </h2>
          </div>
          <button
            onClick={handleDecline}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          {!showDetails ? (
            // Simple view - Compact horizontal layout
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <p className="text-gray-200 text-sm leading-relaxed">
                  We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                  By continuing to use Lumi, you consent to our use of cookies.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 bg-blue-500/20 rounded flex items-center justify-center">
                    <svg className="w-2 h-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <span className="text-gray-300 text-xs">Essential cookies always active</span>
                </div>
              </div>

              {/* Action Buttons - Compact */}
              <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                <button
                  onClick={handleAccept}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                >
                  Accept All
                </button>
                <button
                  onClick={handleCustomize}
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium py-2 px-4 rounded-lg border border-[#3a3a3a] transition-colors text-sm"
                >
                  Customize
                </button>
                <button
                  onClick={handleDecline}
                  className="bg-transparent hover:bg-[#2a2a2a] text-gray-400 hover:text-white font-medium py-2 px-4 rounded-lg border border-[#3a3a3a] transition-colors text-sm"
                >
                  Decline
                </button>
              </div>
            </div>
          ) : (
            // Detailed view - Compact
            <div className="max-h-96 overflow-y-auto">
              <div className="mb-4">
                <p className="text-gray-200 text-sm leading-relaxed mb-4">
                  Choose which cookies you'd like to allow. You can change these settings at any time.
                </p>

                {/* Cookie Categories - Compact */}
                <div className="space-y-3">
                  {/* Essential Cookies */}
                  <div className="bg-[#2a2a2a] rounded-lg p-3 border border-[#3a3a3a]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-blue-500/20 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-sm">Essential Cookies</h3>
                          <p className="text-gray-400 text-xs">Always active</p>
                        </div>
                      </div>
                      <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                        Required
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="bg-[#2a2a2a] rounded-lg p-3 border border-[#3a3a3a]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-purple-500/20 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-sm">Analytics Cookies</h3>
                          <p className="text-gray-400 text-xs">Help us improve our service</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={preferences.analytics}
                          onChange={(e) => updatePreference('analytics', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="bg-[#2a2a2a] rounded-lg p-3 border border-[#3a3a3a]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500/20 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-sm">Functional Cookies</h3>
                          <p className="text-gray-400 text-xs">Enhance your experience</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={preferences.functional}
                          onChange={(e) => updatePreference('functional', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="bg-[#2a2a2a] rounded-lg p-3 border border-[#3a3a3a]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-yellow-500/20 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-sm">Marketing Cookies</h3>
                          <p className="text-gray-400 text-xs">Personalized content and ads</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={preferences.marketing}
                          onChange={(e) => updatePreference('marketing', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Compact */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium py-2 px-4 rounded-lg border border-[#3a3a3a] transition-colors text-sm"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Footer - Compact */}
          <div className="mt-4 pt-3 border-t border-[#3a3a3a]">
            <p className="text-xs text-gray-400 text-center">
              By using our website, you agree to our{' '}
              <button className="text-orange-400 hover:text-orange-300 transition-colors">
                Privacy Policy
              </button>{' '}
              and{' '}
              <button className="text-orange-400 hover:text-orange-300 transition-colors">
                Terms of Service
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
