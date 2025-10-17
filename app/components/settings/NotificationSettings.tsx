import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface NotificationSettingsProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ user, onUpdate }) => {
  // Notification settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState('immediate');
  const [quietHours, setQuietHours] = useState(false);
  const [quietStartTime, setQuietStartTime] = useState('22:00');
  const [quietEndTime, setQuietEndTime] = useState('08:00');
  const [showPreview, setShowPreview] = useState(true);
  const [notificationPosition, setNotificationPosition] = useState('top-right');
  
  // Dropdown state
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownType, setDropdownType] = useState<'frequency' | 'position' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'batched', label: 'Batched (Every 5 minutes)' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily Summary' }
  ];

  const positionOptions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' }
  ];

  const handleFrequencyChange = (frequency: any) => {
    setNotificationFrequency(frequency.value);
    setDropdownType(null);
  };

  const handlePositionChange = (position: any) => {
    setNotificationPosition(position.value);
    setDropdownType(null);
  };

  const openDropdown = (type: 'frequency' | 'position', triggerElement?: HTMLElement) => {
    const element = triggerElement || triggerRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 200;
      
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
      case 'frequency':
        return frequencyOptions;
      case 'position':
        return positionOptions;
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
          width: '200px',
          maxHeight: '200px',
        }}
      >
        <div className="max-h-[160px] overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 text-sm text-[#e0e0e0] hover:bg-[#333] cursor-pointer transition-colors"
              onClick={() => {
                if (dropdownType === 'frequency') handleFrequencyChange(option);
                else if (dropdownType === 'position') handlePositionChange(option);
              }}
            >
              <div className="text-white">{option.label}</div>
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      <h2 className="text-white text-[13px] font-semibold mb-2">Notifications</h2>
      <hr className="border-[#303030] mb-4" />
      
      {/* Push Notifications */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Push Notifications</h4>
          <p className="text-[#808080] text-sm">Receive push notifications for new messages and updates.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushNotifications ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setPushNotifications(!pushNotifications)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Sound Notifications */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Sound Notifications</h4>
          <p className="text-[#808080] text-sm">Play sound when receiving notifications.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${soundNotifications ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setSoundNotifications(!soundNotifications)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${soundNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Desktop Notifications */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Desktop Notifications</h4>
          <p className="text-[#808080] text-sm">Show system desktop notifications.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${desktopNotifications ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setDesktopNotifications(!desktopNotifications)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${desktopNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Show Preview */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Show Preview</h4>
          <p className="text-[#808080] text-sm">Show message preview in notifications.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showPreview ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setShowPreview(!showPreview)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showPreview ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Notification Frequency */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Notification Frequency</h4>
          <p className="text-[#808080] text-sm">How often to receive notifications.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('frequency', e.currentTarget)}
          >
            <span className="text-sm mr-2">
              {frequencyOptions.find(opt => opt.value === notificationFrequency)?.label || 'Immediate'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Notification Position */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Notification Position</h4>
          <p className="text-[#808080] text-sm">Where to display notifications on screen.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('position', e.currentTarget)}
          >
            <span className="text-sm mr-2">
              {positionOptions.find(opt => opt.value === notificationPosition)?.label || 'Top Right'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Quiet Hours */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Quiet Hours</h3>
      <hr className="border-[#303030] mb-4" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Enable Quiet Hours</h4>
          <p className="text-[#808080] text-sm">Disable notifications during specified hours.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${quietHours ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setQuietHours(!quietHours)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${quietHours ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Quiet Hours Time Settings */}
      {quietHours && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-white text-[13px] font-semibold mb-1">Start Time</h4>
              <p className="text-[#808080] text-sm">When quiet hours begin.</p>
            </div>
            <div className="relative">
              <input
                type="time"
                value={quietStartTime}
                onChange={(e) => setQuietStartTime(e.target.value)}
                className="bg-[#333] text-white border border-[#444] rounded px-3 py-1 text-sm focus:outline-none focus:border-[#4a9eff]"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-white text-[13px] font-semibold mb-1">End Time</h4>
              <p className="text-[#808080] text-sm">When quiet hours end.</p>
            </div>
            <div className="relative">
              <input
                type="time"
                value={quietEndTime}
                onChange={(e) => setQuietEndTime(e.target.value)}
                className="bg-[#333] text-white border border-[#444] rounded px-3 py-1 text-sm focus:outline-none focus:border-[#4a9eff]"
              />
            </div>
          </div>
        </>
      )}
      
      <DropdownModal />
    </div>
  );
};

export default NotificationSettings;
