import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PrivacyDataSettingsProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const PrivacyDataSettings: React.FC<PrivacyDataSettingsProps> = ({ user, onUpdate }) => {
  // Privacy & Data settings state
  const [messageEncryption, setMessageEncryption] = useState(true);
  const [searchHistory, setSearchHistory] = useState(true);
  const [conversationPrivacy, setConversationPrivacy] = useState('encrypted');
  const [locationServices, setLocationServices] = useState(false);
  const [ipAddressCollection, setIpAddressCollection] = useState(false);
  const [deviceFingerprinting, setDeviceFingerprinting] = useState(false);
  const [crossSiteTracking, setCrossSiteTracking] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(true);
  const [ccpaRights, setCcpaRights] = useState(true);
  const [dataProcessingBasis, setDataProcessingBasis] = useState('consent');
  const [dataBreachNotifications, setDataBreachNotifications] = useState(true);
  
  // Dropdown state
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownType, setDropdownType] = useState<'conversation-privacy' | 'data-basis' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const conversationPrivacyOptions = [
    { value: 'encrypted', label: 'End-to-End Encrypted', description: 'Maximum security for conversations' },
    { value: 'standard', label: 'Standard Encryption', description: 'Basic encryption for conversations' },
    { value: 'unencrypted', label: 'No Encryption', description: 'No encryption (not recommended)' }
  ];

  const dataBasisOptions = [
    { value: 'consent', label: 'Consent', description: 'Based on your explicit consent' },
    { value: 'contract', label: 'Contract', description: 'Necessary for service provision' },
    { value: 'legitimate', label: 'Legitimate Interest', description: 'For legitimate business purposes' },
    { value: 'legal', label: 'Legal Obligation', description: 'Required by law' }
  ];

  const handleDropdownChange = (type: string, value: any) => {
    switch (type) {
      case 'conversation-privacy':
        setConversationPrivacy(value.value);
        break;
      case 'data-basis':
        setDataProcessingBasis(value.value);
        break;
    }
    setDropdownType(null);
  };

  const openDropdown = (type: 'conversation-privacy' | 'data-basis', triggerElement?: HTMLElement) => {
    const element = triggerElement || triggerRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 250;
      
      let top = rect.bottom + window.scrollY + 5;
      if (top + dropdownHeight > viewportHeight + window.scrollY) {
        top = rect.top + window.scrollY - dropdownHeight - 5;
      }
      
      setDropdownPosition({ top, left: rect.left + window.scrollX });
    }
    setDropdownType(type);
  };

  const closeDropdown = () => {
    setDropdownType(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
      case 'conversation-privacy':
        return conversationPrivacyOptions;
      case 'data-basis':
        return dataBasisOptions;
      default:
        return [];
    }
  };

  const handleDataExport = () => {
    // Data export functionality
    console.log('Exporting user data...');
  };

  const handleDataPortability = () => {
    // Data portability functionality
    console.log('Preparing data for portability...');
  };

  const handleRightToErasure = () => {
    // Right to erasure functionality
    console.log('Processing right to erasure request...');
  };

  const handleDataRectification = () => {
    // Data rectification functionality
    console.log('Opening data rectification form...');
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
          width: '300px',
          maxHeight: '250px',
        }}
      >
        <div className="max-h-[210px] overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 text-sm text-[#e0e0e0] hover:bg-[#333] cursor-pointer transition-colors"
              onClick={() => handleDropdownChange(dropdownType, option)}
            >
              <div className="font-medium text-white">{option.label}</div>
              <div className="text-xs text-[#808080]">{option.description}</div>
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      {/* Data Management */}
      <h3 className="text-white text-[13px] font-semibold mb-2">Data Management</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Data Export */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Data Export</h4>
          <p className="text-[#808080] text-sm">Download all your data in a portable format.</p>
        </div>
        <button
          onClick={handleDataExport}
          className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer"
        >
          Export Data
        </button>
      </div>
      
      {/* Data Portability */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Data Portability</h4>
          <p className="text-[#808080] text-sm">Export your data in different formats for easy transfer.</p>
        </div>
        <button
          onClick={handleDataPortability}
          className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer"
        >
          Export Formats
        </button>
      </div>
      
      {/* Right to Erasure */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Right to Erasure</h4>
          <p className="text-[#808080] text-sm">Request deletion of specific data types.</p>
        </div>
        <button
          onClick={handleRightToErasure}
          className="border border-red-500 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
        >
          Delete Data
        </button>
      </div>
      
      {/* Data Rectification */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Data Rectification</h4>
          <p className="text-[#808080] text-sm">Correct inaccurate or incomplete information.</p>
        </div>
        <button
          onClick={handleDataRectification}
          className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer"
        >
          Correct Data
        </button>
      </div>
      
      {/* Content Privacy */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Content Privacy</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Message Encryption */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Message Encryption</h4>
          <p className="text-[#808080] text-sm">Enable end-to-end encryption for all messages.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${messageEncryption ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setMessageEncryption(!messageEncryption)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${messageEncryption ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Search History */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Search History</h4>
          <p className="text-[#808080] text-sm">Save and use search history to improve results.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${searchHistory ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setSearchHistory(!searchHistory)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${searchHistory ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Conversation Privacy */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Conversation Privacy</h4>
          <p className="text-[#808080] text-sm">Control privacy level for chat conversations.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('conversation-privacy', e.currentTarget)}
          >
            <span className="text-sm mr-2">
              {conversationPrivacyOptions.find(opt => opt.value === conversationPrivacy)?.label || 'End-to-End Encrypted'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Location & Tracking */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Location & Tracking</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Location Services */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Location Services</h4>
          <p className="text-[#808080] text-sm">Allow Lumi to access your location for better services.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${locationServices ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setLocationServices(!locationServices)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${locationServices ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* IP Address Collection */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">IP Address Collection</h4>
          <p className="text-[#808080] text-sm">Collect IP addresses for security and analytics.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ipAddressCollection ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setIpAddressCollection(!ipAddressCollection)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ipAddressCollection ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Device Fingerprinting */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Device Fingerprinting</h4>
          <p className="text-[#808080] text-sm">Use device characteristics for identification and security.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${deviceFingerprinting ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setDeviceFingerprinting(!deviceFingerprinting)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${deviceFingerprinting ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Cross-site Tracking */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Cross-site Tracking</h4>
          <p className="text-[#808080] text-sm">Prevent tracking across different websites.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${crossSiteTracking ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setCrossSiteTracking(!crossSiteTracking)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${crossSiteTracking ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Compliance & Legal */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Compliance & Legal</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* GDPR Consent */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">GDPR Consent</h4>
          <p className="text-[#808080] text-sm">Manage your consent for data processing under GDPR.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${gdprConsent ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setGdprConsent(!gdprConsent)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${gdprConsent ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* CCPA Rights */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">CCPA Rights</h4>
          <p className="text-[#808080] text-sm">Exercise your California Consumer Privacy Act rights.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ccpaRights ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setCcpaRights(!ccpaRights)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ccpaRights ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Data Processing Basis */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Data Processing Basis</h4>
          <p className="text-[#808080] text-sm">Legal basis for processing your personal data.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('data-basis', e.currentTarget)}
          >
            <span className="text-sm mr-2 capitalize">
              {dataBasisOptions.find(opt => opt.value === dataProcessingBasis)?.label || 'Consent'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Data Breach Notifications */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Data Breach Notifications</h4>
          <p className="text-[#808080] text-sm">Receive notifications about data breaches affecting your account.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dataBreachNotifications ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setDataBreachNotifications(!dataBreachNotifications)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dataBreachNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Transparency */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Transparency</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Privacy Policy */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Privacy Policy</h4>
          <p className="text-[#808080] text-sm">Read our current privacy policy and data practices.</p>
        </div>
        <button className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer">
          View Policy
        </button>
      </div>
      
      {/* Data Processing Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Data Processing Information</h4>
          <p className="text-[#808080] text-sm">Learn what data we process and why.</p>
        </div>
        <button className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer">
          View Details
        </button>
      </div>
      
      {/* Third-party Sharing */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Third-party Sharing</h4>
          <p className="text-[#808080] text-sm">See who we share your data with and why.</p>
        </div>
        <button className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer">
          View Partners
        </button>
      </div>
      
      <DropdownModal />
    </div>
  );
};

export default PrivacyDataSettings;
