import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface AIModelsSettingsProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const AIModelsSettings: React.FC<AIModelsSettingsProps> = ({ user, onUpdate }) => {
  // AI & Models settings state
  const [activeModel, setActiveModel] = useState('lumi-default');
  const [responseStyle, setResponseStyle] = useState('balanced');
  const [personalityTone, setPersonalityTone] = useState('friendly');
  const [rememberUserInfo, setRememberUserInfo] = useState(true);
  const [experimentalModels, setExperimentalModels] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  
  // Dropdown state
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownType, setDropdownType] = useState<'model' | 'personality' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const modelOptions = [
    { 
      value: 'lumi-default', 
      label: 'Lumi Default',
      tagline: 'Balanced and friendly for daily use'
    },
    { 
      value: 'lumi-pro', 
      label: 'Lumi Pro',
      tagline: 'Smarter and more detailed responses'
    },
    { 
      value: 'lumi-coder', 
      label: 'Lumi Coder',
      tagline: 'Specialized for coding help'
    },
    { 
      value: 'lumi-therapist', 
      label: 'Lumi Therapist',
      tagline: 'Calming and empathy-based responses'
    }
  ];

  const personalityOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'calm', label: 'Calm' },
    { value: 'motivational', label: 'Motivational' },
    { value: 'neutral', label: 'Neutral' }
  ];

  const responseStyleOptions = [
    { value: 'concise', label: 'Concise' },
    { value: 'balanced', label: 'Balanced' },
    { value: 'detailed', label: 'Detailed' }
  ];

  const handleModelChange = (model: any) => {
    setActiveModel(model.value);
    setDropdownType(null);
  };

  const handlePersonalityChange = (personality: any) => {
    setPersonalityTone(personality.value);
    setDropdownType(null);
  };

  const openDropdown = (type: 'model' | 'personality', triggerElement?: HTMLElement) => {
    const element = triggerElement || triggerRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = type === 'model' ? 300 : 200;
      
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
      case 'model':
        return modelOptions;
      case 'personality':
        return personalityOptions;
      default:
        return [];
    }
  };

  const handleResetSettings = () => {
    setActiveModel('lumi-default');
    setResponseStyle('balanced');
    setPersonalityTone('friendly');
    setRememberUserInfo(true);
    setExperimentalModels(false);
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
          width: dropdownType === 'model' ? '350px' : '200px',
          maxHeight: dropdownType === 'model' ? '300px' : '200px',
        }}
      >
        <div className={`overflow-y-auto ${
          dropdownType === 'model' ? 'max-h-[260px]' : 'max-h-[160px]'
        }`}>
          {options.map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 text-sm text-[#e0e0e0] hover:bg-[#333] cursor-pointer transition-colors"
              onClick={() => {
                if (dropdownType === 'model') handleModelChange(option);
                else if (dropdownType === 'personality') handlePersonalityChange(option);
              }}
            >
              {dropdownType === 'model' ? (
                <div>
                  <div className="font-medium text-white">{option.label}</div>
                  <div className="text-xs text-[#808080]">{(option as any).tagline}</div>
                </div>
              ) : (
                <div className="text-white">{option.label}</div>
              )}
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  const MemoryModal = () => {
    if (!showMemoryModal) return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMemoryModal(false)} />
        <div className="relative bg-[#202020] border border-[#262626] rounded-lg w-[600px] h-[400px] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Stored Memory Data</h3>
            <button
              onClick={() => setShowMemoryModal(false)}
              className="text-[#808080] hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="text-white text-sm mb-4">
            <p>Here you can view and manage the information Lumi remembers about you.</p>
          </div>
          
          <div className="bg-[#262626] rounded-lg p-4 mb-4 h-[200px] overflow-y-auto">
            <div className="text-[#808080] text-sm">
              <p>• Your preferred communication style: Friendly</p>
              <p>• Favorite topics: Technology, Productivity</p>
              <p>• Goals: Learn new programming languages</p>
              <p>• Recurring questions: Help with React development</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {/* Clear memory logic */}}
              className="border border-red-500 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
            >
              Clear Memory
            </button>
            <button
              onClick={() => setShowMemoryModal(false)}
              className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      <h2 className="text-white text-[13px] font-semibold mb-2">AI & Models</h2>
      <hr className="border-[#303030] mb-4" />
      
      {/* Active Model */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Active Model</h4>
          <p className="text-[#808080] text-sm">Choose which AI model Lumi uses for responses.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('model', e.currentTarget)}
          >
            <span className="text-sm mr-2">
              {modelOptions.find(opt => opt.value === activeModel)?.label || 'Lumi Default'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Response Style */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Response Style</h4>
          <p className="text-[#808080] text-sm">Controls how long Lumi's replies are.</p>
        </div>
        <div className="flex space-x-2">
          {responseStyleOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setResponseStyle(option.value)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                responseStyle === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#333] text-[#808080] hover:bg-[#444] hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Personality & Tone */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Personality & Tone</h4>
          <p className="text-[#808080] text-sm">Choose how Lumi's tone feels in chats.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('personality', e.currentTarget)}
          >
            <span className="text-sm mr-2 capitalize">
              {personalityOptions.find(opt => opt.value === personalityTone)?.label || 'Friendly'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Memory & Context */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Memory & Context</h3>
      <hr className="border-[#303030] mb-4" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Remember user info</h4>
          <p className="text-[#808080] text-sm">When enabled, Lumi remembers your preferences, goals, and recurring topics.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${rememberUserInfo ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setRememberUserInfo(!rememberUserInfo)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rememberUserInfo ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">View Stored Data</h4>
          <p className="text-[#808080] text-sm">View and manage remembered facts about you.</p>
        </div>
        <button
          onClick={() => setShowMemoryModal(true)}
          className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer"
        >
          View Data
        </button>
      </div>
      
      {/* Experimental Settings */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Experimental Settings</h3>
      <hr className="border-[#303030] mb-4" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Enable experimental models</h4>
          <p className="text-[#808080] text-sm">Access to beta and experimental AI models like Lumi Next.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${experimentalModels ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setExperimentalModels(!experimentalModels)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${experimentalModels ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Reset */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Reset</h3>
      <hr className="border-[#303030] mb-4" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Reset AI preferences</h4>
          <p className="text-[#808080] text-sm">Reset all model, tone, and style options to defaults.</p>
        </div>
        <button
          onClick={handleResetSettings}
          className="border border-red-500 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
        >
          Reset Settings
        </button>
      </div>
      
      <DropdownModal />
      <MemoryModal />
    </div>
  );
};

export default AIModelsSettings;
