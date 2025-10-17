import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PersonalAssistantSettingsProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const PersonalAssistantSettings: React.FC<PersonalAssistantSettingsProps> = ({ user, onUpdate }) => {
  // Personal Assistant settings state
  const [responseStyle, setResponseStyle] = useState('conversational');
  const [personality, setPersonality] = useState('friendly');
  const [communicationTone, setCommunicationTone] = useState('mixed');
  const [proactiveLevel, setProactiveLevel] = useState('moderate');
  const [autoSuggestTasks, setAutoSuggestTasks] = useState(true);
  const [taskCategories, setTaskCategories] = useState(['work', 'personal']);
  const [reminderFrequency, setReminderFrequency] = useState('daily');
  const [learningPreferences, setLearningPreferences] = useState(['productivity', 'technology']);
  const [memoryRetention, setMemoryRetention] = useState('30-days');
  const [patternRecognition, setPatternRecognition] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [dataSharing, setDataSharing] = useState('limited');
  const [suggestionFrequency, setSuggestionFrequency] = useState('moderate');
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '17:00' });
  const [weeklyReports, setWeeklyReports] = useState(true);
  
  // Dropdown state
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownType, setDropdownType] = useState<'response-style' | 'personality' | 'tone' | 'proactive' | 'reminder' | 'memory' | 'sharing' | 'frequency' | 'task-categories' | 'learning-preferences' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const responseStyleOptions = [
    { value: 'quick', label: 'Quick', description: 'Brief and to-the-point responses' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive and thorough answers' },
    { value: 'conversational', label: 'Conversational', description: 'Natural and engaging dialogue' }
  ];

  const personalityOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'casual', label: 'Casual' },
    { value: 'motivational', label: 'Motivational' }
  ];

  const toneOptions = [
    { value: 'formal', label: 'Formal' },
    { value: 'informal', label: 'Informal' },
    { value: 'mixed', label: 'Mixed' }
  ];

  const proactiveOptions = [
    { value: 'low', label: 'Low', description: 'Only suggest when directly asked' },
    { value: 'moderate', label: 'Moderate', description: 'Suggest helpful actions occasionally' },
    { value: 'high', label: 'High', description: 'Actively suggest actions and improvements' }
  ];

  const reminderOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'daily', label: 'Daily Summary' },
    { value: 'weekly', label: 'Weekly Summary' }
  ];

  const memoryOptions = [
    { value: '7-days', label: '7 Days' },
    { value: '30-days', label: '30 Days' },
    { value: '90-days', label: '90 Days' },
    { value: 'forever', label: 'Forever' }
  ];

  const sharingOptions = [
    { value: 'minimal', label: 'Minimal', description: 'Only basic conversation context' },
    { value: 'limited', label: 'Limited', description: 'Conversation patterns and preferences' },
    { value: 'comprehensive', label: 'Comprehensive', description: 'Full context for better assistance' }
  ];

  const frequencyOptions = [
    { value: 'low', label: 'Low', description: 'Suggestions only when needed' },
    { value: 'moderate', label: 'Moderate', description: 'Regular helpful suggestions' },
    { value: 'high', label: 'High', description: 'Frequent proactive suggestions' }
  ];

  const taskCategoryOptions = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'health', label: 'Health' },
    { value: 'learning', label: 'Learning' },
    { value: 'finance', label: 'Finance' },
    { value: 'social', label: 'Social' }
  ];

  const learningTopicOptions = [
    { value: 'productivity', label: 'Productivity' },
    { value: 'technology', label: 'Technology' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'education', label: 'Education' },
    { value: 'business', label: 'Business' },
    { value: 'creativity', label: 'Creativity' }
  ];

  const handleDropdownChange = (type: string, value: any) => {
    switch (type) {
      case 'response-style':
        setResponseStyle(value.value);
        break;
      case 'personality':
        setPersonality(value.value);
        break;
      case 'tone':
        setCommunicationTone(value.value);
        break;
      case 'proactive':
        setProactiveLevel(value.value);
        break;
      case 'reminder':
        setReminderFrequency(value.value);
        break;
      case 'memory':
        setMemoryRetention(value.value);
        break;
      case 'sharing':
        setDataSharing(value.value);
        break;
      case 'frequency':
        setSuggestionFrequency(value.value);
        break;
      case 'task-categories':
        toggleTaskCategory(value.value);
        break;
      case 'learning-preferences':
        toggleLearningPreference(value.value);
        break;
    }
    setDropdownType(null);
  };

  const openDropdown = (type: 'response-style' | 'personality' | 'tone' | 'proactive' | 'reminder' | 'memory' | 'sharing' | 'frequency' | 'task-categories' | 'learning-preferences', triggerElement?: HTMLElement) => {
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
      case 'response-style':
        return responseStyleOptions;
      case 'personality':
        return personalityOptions;
      case 'tone':
        return toneOptions;
      case 'proactive':
        return proactiveOptions;
      case 'reminder':
        return reminderOptions;
      case 'memory':
        return memoryOptions;
      case 'sharing':
        return sharingOptions;
      case 'frequency':
        return frequencyOptions;
      case 'task-categories':
        return taskCategoryOptions;
      case 'learning-preferences':
        return learningTopicOptions;
      default:
        return [];
    }
  };

  const toggleTaskCategory = (category: string) => {
    setTaskCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLearningPreference = (topic: string) => {
    setLearningPreferences(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
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
              onClick={() => {
                if (dropdownType === 'task-categories') {
                  toggleTaskCategory(option.value);
                } else if (dropdownType === 'learning-preferences') {
                  toggleLearningPreference(option.value);
                } else {
                  handleDropdownChange(dropdownType, option);
                }
              }}
            >
              {dropdownType === 'task-categories' || dropdownType === 'learning-preferences' ? (
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{option.label}</div>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    (dropdownType === 'task-categories' && taskCategories.includes(option.value)) ||
                    (dropdownType === 'learning-preferences' && learningPreferences.includes(option.value))
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-[#666]'
                  }`}>
                    {((dropdownType === 'task-categories' && taskCategories.includes(option.value)) ||
                      (dropdownType === 'learning-preferences' && learningPreferences.includes(option.value))) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="font-medium text-white">{option.label}</div>
                  {(option as any).description && (
                    <div className="text-xs text-[#808080]">{(option as any).description}</div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      {/* Assistant Behavior */}
      <h3 className="text-white text-[13px] font-semibold mb-2">Assistant Behavior</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Response Style */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Response Style</h4>
          <p className="text-[#808080] text-sm">How Lumi structures and delivers responses.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('response-style', e.currentTarget)}
          >
            <span className="text-sm mr-2 capitalize">
              {responseStyleOptions.find(opt => opt.value === responseStyle)?.label || 'Conversational'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Personality */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Personality</h4>
          <p className="text-[#808080] text-sm">Choose Lumi's personality traits.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('personality', e.currentTarget)}
          >
            <span className="text-sm mr-2 capitalize">
              {personalityOptions.find(opt => opt.value === personality)?.label || 'Friendly'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Communication Tone */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Communication Tone</h4>
          <p className="text-[#808080] text-sm">The formality level of Lumi's communication.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('tone', e.currentTarget)}
          >
            <span className="text-sm mr-2 capitalize">
              {toneOptions.find(opt => opt.value === communicationTone)?.label || 'Mixed'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Proactive Level */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Proactive Level</h4>
          <p className="text-[#808080] text-sm">How often Lumi suggests actions and improvements.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('proactive', e.currentTarget)}
          >
            <span className="text-sm mr-2 capitalize">
              {proactiveOptions.find(opt => opt.value === proactiveLevel)?.label || 'Moderate'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Task Management */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Task Management</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Auto-suggest Tasks */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Auto-suggest Tasks</h4>
          <p className="text-[#808080] text-sm">Automatically suggest tasks based on conversations and patterns.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoSuggestTasks ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setAutoSuggestTasks(!autoSuggestTasks)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoSuggestTasks ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Task Categories */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Task Categories</h4>
          <p className="text-[#808080] text-sm">Select which categories Lumi should focus on for task suggestions.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('task-categories', e.currentTarget)}
          >
            <span className="text-sm mr-2">
              {taskCategories.length > 0 
                ? `${taskCategories.length} selected` 
                : 'Select categories'
              }
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Reminder Frequency */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Reminder Frequency</h4>
          <p className="text-[#808080] text-sm">How often to receive task reminders and summaries.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('reminder', e.currentTarget)}
          >
            <span className="text-sm mr-2">
              {reminderOptions.find(opt => opt.value === reminderFrequency)?.label || 'Daily Summary'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Learning & Memory */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Learning & Memory</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Learning Preferences */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Learning Preferences</h4>
          <p className="text-[#808080] text-sm">What topics should Lumi focus on learning about.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('learning-preferences', e.currentTarget)}
          >
            <span className="text-sm mr-2">
              {learningPreferences.length > 0 
                ? `${learningPreferences.length} selected` 
                : 'Select topics'
              }
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Memory Retention */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Memory Retention</h4>
          <p className="text-[#808080] text-sm">How long Lumi remembers conversations and patterns.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('memory', e.currentTarget)}
          >
            <span className="text-sm mr-2">
              {memoryOptions.find(opt => opt.value === memoryRetention)?.label || '30 Days'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Pattern Recognition */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Pattern Recognition</h4>
          <p className="text-[#808080] text-sm">Learn from your habits and preferences to provide better assistance.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${patternRecognition ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setPatternRecognition(!patternRecognition)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${patternRecognition ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Productivity Features */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Productivity Features</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Focus Mode */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Focus Mode</h4>
          <p className="text-[#808080] text-sm">Enable distraction-free assistance for deep work sessions.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${focusMode ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setFocusMode(!focusMode)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${focusMode ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      {/* Privacy & Control */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Privacy & Control</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Data Sharing */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Data Sharing</h4>
          <p className="text-[#808080] text-sm">Control what information Lumi can access for better assistance.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('sharing', e.currentTarget)}
          >
            <span className="text-sm mr-2 capitalize">
              {sharingOptions.find(opt => opt.value === dataSharing)?.label || 'Limited'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Suggestion Frequency */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Suggestion Frequency</h4>
          <p className="text-[#808080] text-sm">How often Lumi provides proactive suggestions.</p>
        </div>
        <div className="relative">
          <div 
            className="flex items-center text-[#808080] cursor-pointer"
            data-dropdown-trigger
            onClick={(e) => openDropdown('frequency', e.currentTarget)}
          >
            <span className="text-sm mr-2 capitalize">
              {frequencyOptions.find(opt => opt.value === suggestionFrequency)?.label || 'Moderate'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Working Hours */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Working Hours</h4>
          <p className="text-[#808080] text-sm">When Lumi should be most active with suggestions.</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="time"
            value={workingHours.start}
            onChange={(e) => setWorkingHours(prev => ({ ...prev, start: e.target.value }))}
            className="bg-[#333] text-white border border-[#444] rounded px-2 py-1 text-sm focus:outline-none focus:border-[#4a9eff]"
          />
          <span className="text-[#808080] text-sm">to</span>
          <input
            type="time"
            value={workingHours.end}
            onChange={(e) => setWorkingHours(prev => ({ ...prev, end: e.target.value }))}
            className="bg-[#333] text-white border border-[#444] rounded px-2 py-1 text-sm focus:outline-none focus:border-[#4a9eff]"
          />
        </div>
      </div>
      
      {/* Analytics & Insights */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Analytics & Insights</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Weekly Reports */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Weekly Reports</h4>
          <p className="text-[#808080] text-sm">Receive weekly summaries of assistant activity and productivity insights.</p>
        </div>
        <button 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${weeklyReports ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => setWeeklyReports(!weeklyReports)}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${weeklyReports ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      
      <DropdownModal />
    </div>
  );
};

export default PersonalAssistantSettings;
