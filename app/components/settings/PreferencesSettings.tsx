import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PreferencesSettingsProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({ user, onUpdate }) => {
  const [selectedTheme, setSelectedTheme] = useState('Dark mode');
  const [selectedLanguage, setSelectedLanguage] = useState('English (UK)');
  const [isTimezoneAuto, setIsTimezoneAuto] = useState(true);
  const [selectedTimezone, setSelectedTimezone] = useState(user.timezone || 'London, United Kingdom');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownType, setDropdownType] = useState<'theme' | 'language' | 'timezone' | 'cookies' | 'data-retention' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  // Windows App settings
  const [startWithWindows, setStartWithWindows] = useState(false);
  const [minimizeToTray, setMinimizeToTray] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  
  // Cookie settings
  const [cookieSettings, setCookieSettings] = useState('strictly-necessary');
  const [strictlyNecessary, setStrictlyNecessary] = useState(true);
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  
  // Data privacy settings
  const [collectUsageData, setCollectUsageData] = useState(false);
  const [shareCrashReports, setShareCrashReports] = useState(true);
  const [encryptLocalData, setEncryptLocalData] = useState(true);
  const [autoDeleteHistory, setAutoDeleteHistory] = useState(false);
  const [dataRetention, setDataRetention] = useState('30-days');

  const themes = ['Use system setting', 'Dark mode', 'Light mode'];
  const languages = [
    { main: 'English (UK)', subtitle: 'English (UK)' },
    { main: 'Dansk', subtitle: 'Danish' },
    { main: 'Suomi', subtitle: 'Finnish' },
    { main: 'Deutsch', subtitle: 'German' },
    { main: 'Français', subtitle: 'French' },
    { main: 'Español', subtitle: 'Spanish' },
    { main: 'Italiano', subtitle: 'Italian' },
    { main: 'Nederlands', subtitle: 'Dutch' }
  ];
  const timezones = [
    { location: 'Midway Island', offset: 'GMT-11' },
    { location: 'Honolulu, Hawaii', offset: 'GMT-10' },
    { location: 'Anchorage, Alaska', offset: 'GMT-9' },
    { location: 'Los Angeles, California', offset: 'GMT-8' },
    { location: 'Denver, Colorado', offset: 'GMT-7' },
    { location: 'Chicago, Illinois', offset: 'GMT-6' },
    { location: 'New York, New York', offset: 'GMT-5' },
    { location: 'Caracas, Venezuela', offset: 'GMT-4' },
    { location: 'Buenos Aires, Argentina', offset: 'GMT-3' },
    { location: 'South Georgia Island', offset: 'GMT-2' },
    { location: 'Azores, Portugal', offset: 'GMT-1' },
    { location: 'London, United Kingdom', offset: 'GMT+0' },
    { location: 'Paris, France', offset: 'GMT+1' },
    { location: 'Athens, Greece', offset: 'GMT+2' },
    { location: 'Moscow, Russia', offset: 'GMT+3' },
    { location: 'Dubai, UAE', offset: 'GMT+4' },
    { location: 'Karachi, Pakistan', offset: 'GMT+5' },
    { location: 'Dhaka, Bangladesh', offset: 'GMT+6' },
    { location: 'Bangkok, Thailand', offset: 'GMT+7' },
    { location: 'Shanghai, China', offset: 'GMT+8' },
    { location: 'Tokyo, Japan', offset: 'GMT+9' },
    { location: 'Sydney, Australia', offset: 'GMT+10' },
    { location: 'Norfolk Island', offset: 'GMT+11' },
    { location: 'Auckland, New Zealand', offset: 'GMT+12' }
  ];
  
  const cookieOptions = [
    { 
      value: 'strictly-necessary', 
      label: 'Strictly Necessary',
      subtitle: 'Essential cookies required for basic functionality.',
      enabled: strictlyNecessary,
      onToggle: () => setStrictlyNecessary(!strictlyNecessary)
    },
    { 
      value: 'functional', 
      label: 'Functional',
      subtitle: 'Cookies that enhance user experience and functionality.',
      enabled: functional,
      onToggle: () => setFunctional(!functional)
    },
    { 
      value: 'analytics', 
      label: 'Analytics',
      subtitle: 'Cookies used to analyze website usage and performance.',
      enabled: analytics,
      onToggle: () => setAnalytics(!analytics)
    }
  ];
  
  const dataRetentionOptions = [
    { value: '1-day', label: '1 Day' },
    { value: '7-days', label: '7 Days' },
    { value: '30-days', label: '30 Days' },
    { value: '90-days', label: '90 Days' },
    { value: 'forever', label: 'Forever' }
  ];

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setDropdownType(null);
  };

  const handleLanguageChange = (language: any) => {
    setSelectedLanguage(language.main);
    setDropdownType(null);
  };

  const handleTimezoneChange = (timezone: any) => {
    setSelectedTimezone(timezone.location);
    setDropdownType(null);
  };

  const handleDataRetentionChange = (retention: any) => {
    setDataRetention(retention.value);
    setDropdownType(null);
  };

  const openDropdown = (type: 'theme' | 'language' | 'timezone' | 'cookies' | 'data-retention', triggerElement?: HTMLElement) => {
    const element = triggerElement || triggerRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Different heights for different dropdown types
      let dropdownHeight = 200; // Default for theme
      if (type === 'language') dropdownHeight = 300;
      if (type === 'timezone') dropdownHeight = 450;
      if (type === 'cookies') dropdownHeight = 300;
      if (type === 'data-retention') dropdownHeight = 200;
      
      // Check if dropdown would go off-screen and adjust position
      let top = rect.bottom + window.scrollY + 5;
      if (top + dropdownHeight > viewportHeight + window.scrollY) {
        top = rect.top + window.scrollY - dropdownHeight - 5;
      }
      
      // Special positioning for cookies dropdown - align with content
      if (type === 'cookies') {
        top = rect.top + window.scrollY - 10; // Position slightly above the trigger
      }
      
      // Special positioning for data retention dropdown - align with content
      if (type === 'data-retention') {
        top = rect.top + window.scrollY - 10; // Position slightly above the trigger
      }
      
      setDropdownPosition({ top, left: rect.left + window.scrollX });
    }
    setDropdownType(type);
    setSearchTerm('');
  };

  const closeDropdown = () => {
    setDropdownType(null);
    setSearchTerm('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Also check if the click is not on any trigger element
        const target = event.target as HTMLElement;
        const isTriggerClick = target.closest('[data-dropdown-trigger]');
        if (!isTriggerClick) {
          closeDropdown();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (dropdownType) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [dropdownType]);

  const getFilteredOptions = () => {
    switch (dropdownType) {
      case 'theme':
        return themes.filter(theme => theme.toLowerCase().includes(searchTerm.toLowerCase()));
      case 'language':
        return languages.filter(language => language.main.toLowerCase().includes(searchTerm.toLowerCase()) || language.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
      case 'timezone':
        return timezones.filter(timezone => timezone.location.toLowerCase().includes(searchTerm.toLowerCase()) || timezone.offset.toLowerCase().includes(searchTerm.toLowerCase()));
      case 'cookies':
        return cookieOptions.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
      case 'data-retention':
        return dataRetentionOptions.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
      default:
        return [];
    }
  };

  const DropdownModal = () => {
    if (!dropdownType) return null;

    const options = getFilteredOptions();

    return createPortal(
      <div
        ref={dropdownRef}
        className="fixed bg-[#262626] border border-[#333] rounded-lg shadow-lg z-[9999] overflow-hidden"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownType === 'timezone' ? '340px' : dropdownType === 'language' ? '200px' : dropdownType === 'cookies' ? '350px' : dropdownType === 'data-retention' ? '200px' : '250px',
          maxHeight: dropdownType === 'timezone' ? '450px' : dropdownType === 'language' ? '300px' : dropdownType === 'cookies' ? '300px' : dropdownType === 'data-retention' ? '200px' : '200px',
        }}
      >
        {/* Search input for timezone dropdown */}
        {dropdownType === 'timezone' && (
          <div className="p-2 border-b border-[#333]">
            <input
              type="text"
              placeholder="Search timezone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-[#333] text-white rounded border border-[#444] text-sm focus:outline-none focus:border-[#4a9eff] focus:ring-1 focus:ring-[#4a9eff]"
              autoFocus
            />
          </div>
        )}
        
        {/* Options list */}
        <div className={`overflow-y-auto ${
          dropdownType === 'timezone' ? 'max-h-[410px]' : 
          dropdownType === 'language' ? 'max-h-[260px]' : 
          dropdownType === 'cookies' ? 'max-h-[260px]' :
          dropdownType === 'data-retention' ? 'max-h-[160px]' :
          'max-h-[160px]'
        }`}>
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-[#666] text-center">
              No options found
        </div>
          ) : (
            options.map((option) => (
            <div
              key={dropdownType === 'language' ? (option as any).main : dropdownType === 'timezone' ? (option as any).location : dropdownType === 'cookies' ? (option as any).value : dropdownType === 'data-retention' ? (option as any).value : option}
                className="px-3 py-2 text-sm text-[#e0e0e0] hover:bg-[#333] cursor-pointer transition-colors"
              onClick={() => {
                if (dropdownType === 'theme') handleThemeChange(option as string);
                else if (dropdownType === 'language') handleLanguageChange(option);
                else if (dropdownType === 'timezone') handleTimezoneChange(option);
                else if (dropdownType === 'data-retention') handleDataRetentionChange(option);
                // Cookie options don't close dropdown on click - handled by individual toggles
              }}
            >
              {dropdownType === 'language' ? (
                <div>
                    <div className="font-medium text-white">{(option as { main: string; subtitle: string }).main}</div>
                    <div className="text-xs text-[#808080]">{(option as { main: string; subtitle: string }).subtitle}</div>
                </div>
              ) : dropdownType === 'timezone' ? (
                <div>
                    <div className="font-medium text-white">{(option as { location: string; offset: string }).location}</div>
                    <div className="text-xs text-[#808080]">{(option as { location: string; offset: string }).offset}</div>
                </div>
              ) : dropdownType === 'cookies' ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1">
                    <div className="font-medium text-white">{(option as any).label}</div>
                    <div className="text-xs text-[#808080]">{(option as any).subtitle}</div>
                  </div>
                  <button 
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ml-3 ${(option as any).enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      (option as any).onToggle();
                    }}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${(option as any).enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              ) : dropdownType === 'data-retention' ? (
                <div className="text-white">{(option as { value: string; label: string }).label}</div>
              ) : (
                  <div className="text-white">{option as string}</div>
              )}
            </div>
            ))
          )}
          
          {/* Add bottom padding for timezone dropdown */}
          {dropdownType === 'timezone' && (
            <div className="h-3"></div>
          )}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      <h2 className="text-white text-[13px] font-semibold mb-2">Preference</h2>
      <hr className="border-[#303030] mb-4" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white text-[13px] font-semibold mb-1">Appearance</h3>
          <p className="text-[#808080] text-sm">Customise how Lumi Looks on your device</p>
        </div>
        <div className="relative">
          <div 
            ref={triggerRef}
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('theme', e.currentTarget)}
          >
            <span className="text-sm mr-2">{selectedTheme}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Language and Time</h3>
      <hr className="border-[#303030] mb-4" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Language</h4>
          <p className="text-[#808080] text-sm">Change the language used in the user interface.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('language', e.currentTarget)}
          >
            <span className="text-sm mr-2">{selectedLanguage === 'English(us)' ? 'English(US)' : selectedLanguage}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Set timezone automatically using your location</h4>
          <p className="text-[#808080] text-sm">Reminders, notifications are delivered based on your time zone.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isTimezoneAuto ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setIsTimezoneAuto(!isTimezoneAuto)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isTimezoneAuto ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Timezone</h4>
          <p className="text-[#808080] text-sm">Current timezone setting.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('timezone', e.currentTarget)}
          >
            <span className="text-sm mr-2">{selectedTimezone}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Windows App Section */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Windows App</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Start with Windows */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Start with Windows</h4>
          <p className="text-[#808080] text-sm">Automatically launch Lumi when Windows starts.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${startWithWindows ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setStartWithWindows(!startWithWindows)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${startWithWindows ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Minimize to System Tray */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Minimize to System Tray</h4>
          <p className="text-[#808080] text-sm">Keep Lumi running in the background when minimized.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${minimizeToTray ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setMinimizeToTray(!minimizeToTray)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${minimizeToTray ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Show Notifications */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Show Notifications</h4>
          <p className="text-[#808080] text-sm">Display system notifications for reminders and updates.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showNotifications ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Auto Update */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Auto Update</h4>
          <p className="text-[#808080] text-sm">Automatically download and install updates.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoUpdate ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setAutoUpdate(!autoUpdate)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoUpdate ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Privacy Section */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Privacy</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Cookie Settings */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Cookie Settings</h4>
          <p className="text-[#808080] text-sm">Customize cookies. See cookies notice for more details.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('cookies', e.currentTarget)}
          >
            <span className="text-sm mr-2">
              {cookieOptions.find(opt => opt.value === cookieSettings)?.label || 'Strictly Necessary'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Data Privacy Settings */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Data Privacy</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Collect Usage Data */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Collect Usage Data</h4>
          <p className="text-[#808080] text-sm">Help improve Lumi by sharing anonymous usage statistics.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${collectUsageData ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setCollectUsageData(!collectUsageData)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${collectUsageData ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Share Crash Reports */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Share Crash Reports</h4>
          <p className="text-[#808080] text-sm">Automatically send crash reports to help fix issues.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${shareCrashReports ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setShareCrashReports(!shareCrashReports)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shareCrashReports ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Encrypt Local Data */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Encrypt Local Data</h4>
          <p className="text-[#808080] text-sm">Encrypt all data stored locally on your device.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${encryptLocalData ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setEncryptLocalData(!encryptLocalData)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${encryptLocalData ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Auto Delete History */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Auto Delete History</h4>
          <p className="text-[#808080] text-sm">Automatically delete old conversation history.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoDeleteHistory ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setAutoDeleteHistory(!autoDeleteHistory)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoDeleteHistory ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Data Retention Period */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Data Retention Period</h4>
          <p className="text-[#808080] text-sm">How long to keep your data before automatic deletion.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('data-retention', e.currentTarget)}
          >
            <span className="text-sm mr-2">
              {dataRetentionOptions.find(opt => opt.value === dataRetention)?.label || '30 Days'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <DropdownModal />
    </div>
  );
};

export default PreferencesSettings;
