import React, { useEffect, useState } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    fullName?: string;
    avatar?: string;
    initials?: string;
  };
}

export function SearchModal({ isOpen, onClose, user }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCreatedByDropdown, setShowCreatedByDropdown] = useState(false);
  const [showContentTypeDropdown, setShowContentTypeDropdown] = useState(false);
  const [showDateRangeDropdown, setShowDateRangeDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('created-last');
  const [titleOnly, setTitleOnly] = useState(false);
  const [createdBy, setCreatedBy] = useState('all');
  const [contentType, setContentType] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Mock data for search results
  const mockData = {
    chats: [
      { id: 1, title: "How to implement React hooks", content: "I need help with useState and useEffect...", date: "2024-01-15", type: "chat" },
      { id: 2, title: "Database optimization tips", content: "What are the best practices for...", date: "2024-01-14", type: "chat" },
      { id: 3, title: "API integration discussion", content: "Let's talk about RESTful APIs...", date: "2024-01-13", type: "chat" }
    ],
    notes: [
      { id: 1, title: "Meeting Notes - Project Planning", content: "Discussed Q1 goals and deliverables...", date: "2024-01-15", type: "note" },
      { id: 2, title: "Ideas for new features", content: "User feedback suggests we need...", date: "2024-01-14", type: "note" },
      { id: 3, title: "Code review checklist", content: "Before submitting PR, check...", date: "2024-01-13", type: "note" }
    ],
    reminders: [
      { id: 1, title: "Team standup meeting", content: "Daily standup at 9 AM", date: "2024-01-15", type: "reminder" },
      { id: 2, title: "Submit project report", content: "Due by end of week", date: "2024-01-14", type: "reminder" },
      { id: 3, title: "Review code changes", content: "Check pending PRs", date: "2024-01-13", type: "reminder" }
    ],
    settings: [
      { id: 1, title: "Profile Settings", content: "Update your personal information", date: "2024-01-15", type: "setting" },
      { id: 2, title: "Notification Preferences", content: "Configure how you receive notifications", date: "2024-01-14", type: "setting" },
      { id: 3, title: "Privacy & Security", content: "Manage your privacy settings", date: "2024-01-13", type: "setting" }
    ],
    goals: [
      { id: 1, title: "Learn React Hooks", content: "Master useState, useEffect, and custom hooks", date: "2024-01-15", type: "goal" },
      { id: 2, title: "Complete Project", content: "Finish the Lumi AI application by end of month", date: "2024-01-14", type: "goal" },
      { id: 3, title: "Improve Performance", content: "Optimize app loading times and responsiveness", date: "2024-01-13", type: "goal" }
    ]
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      setIsLoading(true);
      // Simulate search
      setTimeout(() => {
        const results = performSearch(value);
        setSearchResults(results);
        setIsLoading(false);
        
        // Add to recent searches
        if (!recentSearches.includes(value)) {
          setRecentSearches(prev => [value, ...prev.slice(0, 4)]);
        }
      }, 500);
    } else {
      setIsLoading(false);
      setSearchResults([]);
    }
  };

  const performSearch = (query: string) => {
    const allData = [
      ...mockData.chats,
      ...mockData.notes,
      ...mockData.reminders,
      ...mockData.settings,
      ...mockData.goals
    ];
    
    return allData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-[#808080] flex-shrink-0">
            <g fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12a8 8 0 1 1 16 0v5.09c0 .848 0 1.27-.126 1.609a2 2 0 0 1-1.175 1.175C18.36 20 17.937 20 17.09 20H12a8 8 0 0 1-8-8z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6m-3 4h3"/>
            </g>
          </svg>
        );
      case 'note':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-[#808080] flex-shrink-0">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
              <path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"/>
              <path d="M20.5 14.5A2.5 2.5 0 0 1 18 17c-.5 0-1.088-.087-1.573.043a1.25 1.25 0 0 0-.884.884c-.13.485-.043 1.074-.043 1.573A2.5 2.5 0 0 1 13 22"/>
            </g>
          </svg>
        );
      case 'reminder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="text-[#808080] flex-shrink-0">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M37.275 32.678V21.47A13.27 13.27 0 0 0 27.08 8.569v-.985a3.102 3.102 0 0 0-6.203 0v.996a13.27 13.27 0 0 0-10.152 12.89v11.208L6.52 36.883v1.942h34.96v-1.942Zm-17.948 6.147a4.65 4.65 0 0 0 9.301.048v-.048"/>
          </svg>
        );
      case 'setting':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-[#808080] flex-shrink-0">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/>
          </svg>
        );
      case 'goal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-[#808080] flex-shrink-0">
            <path fill="currentColor" d="M20.172 6.75h-1.861l-4.566 4.564a1.874 1.874 0 1 1-1.06-1.06l4.565-4.565V3.828a.94.94 0 0 1 .275-.664l1.73-1.73a.249.249 0 0 1 .25-.063c.089.026.155.1.173.191l.46 2.301l2.3.46c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.731 1.73a.937.937 0 0 1-.663.275Z"/>
            <path fill="currentColor" d="M2.625 12A9.375 9.375 0 0 0 12 21.375A9.375 9.375 0 0 0 21.375 12c0-.898-.126-1.766-.361-2.587A.75.75 0 0 1 22.455 9c.274.954.42 1.96.42 3c0 6.006-4.869 10.875-10.875 10.875S1.125 18.006 1.125 12S5.994 1.125 12 1.125c1.015-.001 2.024.14 3 .419a.75.75 0 1 1-.413 1.442A9.39 9.39 0 0 0 12 2.625A9.375 9.375 0 0 0 2.625 12Z"/>
            <path fill="currentColor" d="M7.125 12a4.874 4.874 0 1 0 9.717-.569a.748.748 0 0 1 1.047-.798c.251.112.42.351.442.625a6.373 6.373 0 0 1-10.836 5.253a6.376 6.376 0 0 1 5.236-10.844a.75.75 0 1 1-.17 1.49A4.876 4.876 0 0 0 7.125 12Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      
      if (showSortDropdown && !target.closest('.sort-dropdown-container')) {
        setShowSortDropdown(false);
      }
      
      if (showCreatedByDropdown && !target.closest('.created-by-dropdown-container')) {
        setShowCreatedByDropdown(false);
      }
      
      if (showContentTypeDropdown && !target.closest('.content-type-dropdown-container')) {
        setShowContentTypeDropdown(false);
      }
      
      if (showDateRangeDropdown && !target.closest('.date-range-dropdown-container')) {
        setShowDateRangeDropdown(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, showSortDropdown, showCreatedByDropdown, showContentTypeDropdown, showDateRangeDropdown]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />
      
      {/* Modal */}
          <div 
            className="relative bg-[#202020] border border-[#262626] rounded-2xl w-[900px] h-[650px] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Search Icon and Input - Full Width */}
        <div className="px-6 pt-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-[#808080] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"/>
                </svg>
              )}
            </div>
            <input
              type="text"
              placeholder="Search everything in your space"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-transparent border-none outline-none text-white text-lg font-medium placeholder-[#808080] flex-1"
              autoFocus
            />
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="text-[#808080] hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                <path fill="currentColor" fillRule="evenodd" d="M7.999 15.999a8 8 0 1 1 0-16a8 8 0 0 1 0 16M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14M3.5 5h9a.5.5 0 1 1 0 1h-9a.5.5 0 0 1 0-1m2 3h5a.5.5 0 1 1 0 1h-5a.5.5 0 0 1 0-1m2 3h1a.5.5 0 1 1 0 1h-1a.5.5 0 1 1 0-1"/>
              </svg>
            </button>
          </div>
        </div>

            {/* Filters */}
            {showFilters && (
              <div className="px-6 py-4 border-t border-[#262626]">
                <div className="flex items-center space-x-6 text-sm">
               {/* Sort */}
               <div className="relative sort-dropdown-container">
                 <button 
                   onClick={() => setShowSortDropdown(!showSortDropdown)}
                   className="flex items-center space-x-2 px-4 py-2 hover:bg-[#2a2a2a] hover:rounded-full transition-colors cursor-pointer"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 21 21" className="text-[#808080]">
                     <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m10.5 12.5l4 4.107l4-4.107m-8-4l-4-4l-4 3.997m4-3.997v12m8-12v12"/>
                   </svg>
                   <span className="text-[#808080] text-sm">Sort</span>
                   <svg className="w-3 h-3 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                   </svg>
                 </button>
                 
                 {/* Dropdown Menu */}
                 {showSortDropdown && (
                   <div className="absolute top-full left-0 mt-1 bg-[#262626] border border-[#333] rounded-lg shadow-lg z-10 min-w-[160px]">
                     <div className="py-1">
                      <button
                        onClick={() => {
                          setSortBy('created-first');
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                          sortBy === 'created-first' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        Created first
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('created-last');
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                          sortBy === 'created-last' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        Created last
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('last-edited');
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                          sortBy === 'last-edited' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        Last edited
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('first-edited');
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                          sortBy === 'first-edited' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        First edited
                      </button>
                     </div>
                   </div>
                 )}
               </div>

               {/* Title Only */}
               <div className="flex items-center space-x-2">
                 <button 
                   onClick={() => setTitleOnly(!titleOnly)}
                   className={`flex items-center space-x-2 px-4 py-2 hover:bg-[#2a2a2a] hover:rounded-full transition-colors cursor-pointer ${
                     titleOnly ? 'bg-[#2a2a2a] rounded-full' : ''
                   }`}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" className={`${titleOnly ? 'text-white' : 'text-[#808080]'}`}>
                     <path fill="currentColor" d="M87.24 52.59a8 8 0 0 0-14.48 0l-64 136a8 8 0 1 0 14.48 6.81L39.9 160h80.2l16.66 35.4a8 8 0 1 0 14.48-6.81ZM47.43 144L80 74.79L112.57 144ZM200 96c-12.76 0-22.73 3.47-29.63 10.32a8 8 0 0 0 11.26 11.36c3.8-3.77 10-5.68 18.37-5.68c13.23 0 24 9 24 20v3.22a42.76 42.76 0 0 0-24-7.22c-22.06 0-40 16.15-40 36s17.94 36 40 36a42.73 42.73 0 0 0 24-7.25a8 8 0 0 0 16-.75v-60c0-19.85-17.94-36-40-36Zm0 88c-13.23 0-24-9-24-20s10.77-20 24-20s24 9 24 20s-10.77 20-24 20Z"/>
                   </svg>
                   <span className={`text-sm ${titleOnly ? 'text-white' : 'text-[#808080]'}`}>Title only</span>
                 </button>
               </div>

              {/* Created By */}
              <div className="relative created-by-dropdown-container">
                <button 
                  onClick={() => setShowCreatedByDropdown(!showCreatedByDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-[#2a2a2a] hover:rounded-full transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-[#808080]">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20.75a1 1 0 0 0 1-1v-1.246c.004-2.806-3.974-5.004-8-5.004s-8 2.198-8 5.004v1.246a1 1 0 0 0 1 1zM15.604 6.854a3.604 3.604 0 1 1-7.208 0a3.604 3.604 0 0 1 7.208 0"/>
                  </svg>
                   <span className="text-[#808080] text-sm">Created by</span>
                  <svg className="w-3 h-3 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showCreatedByDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-[#262626] border border-[#333] rounded-lg shadow-lg z-10 min-w-[160px]">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCreatedBy('all');
                          setShowCreatedByDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                          createdBy === 'all' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => {
                          setCreatedBy('user');
                          setShowCreatedByDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors flex items-center space-x-2 ${
                          createdBy === 'user' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.fullName || 'User'} 
                            className="w-6 h-6 rounded-full flex-shrink-0 object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {user?.initials || 'U'}
                          </div>
                        )}
                        <span>{user?.fullName || 'User'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setCreatedBy('lumi');
                          setShowCreatedByDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors flex items-center space-x-2 ${
                          createdBy === 'lumi' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0">
                          <g fill="none">
                            <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
                            <path fill="currentColor" d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"/>
                          </g>
                        </svg>
                        <span>Lumi</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Type */}
              <div className="relative content-type-dropdown-container">
                <button 
                  onClick={() => setShowContentTypeDropdown(!showContentTypeDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-[#2a2a2a] hover:rounded-full transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-[#808080]">
                    <path fill="currentColor" d="M20 8.94a1.31 1.31 0 0 0-.06-.27v-.09a1.07 1.07 0 0 0-.19-.28l-6-6a1.07 1.07 0 0 0-.28-.19h-.09L13.06 2H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8.94Zm-6-3.53L16.59 8H14ZM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v5a1 1 0 0 0 1 1h5Z"/>
                  </svg>
                   <span className="text-[#808080] text-sm">In</span>
                  <svg className="w-3 h-3 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showContentTypeDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-[#262626] border border-[#333] rounded-lg shadow-lg z-10 min-w-[160px]">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setContentType('all');
                          setShowContentTypeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors flex items-center space-x-2 ${
                          contentType === 'all' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0">
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2H8V5z"/>
                        </svg>
                        <span>All</span>
                      </button>
                      <button
                        onClick={() => {
                          setContentType('chats');
                          setShowContentTypeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors flex items-center space-x-2 ${
                          contentType === 'chats' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0">
                          <g fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 12a8 8 0 1 1 16 0v5.09c0 .848 0 1.27-.126 1.609a2 2 0 0 1-1.175 1.175C18.36 20 17.937 20 17.09 20H12a8 8 0 0 1-8-8z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6m-3 4h3"/>
                          </g>
                        </svg>
                        <span>Chats</span>
                      </button>
                      <button
                        onClick={() => {
                          setContentType('reminders');
                          setShowContentTypeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors flex items-center space-x-2 ${
                          contentType === 'reminders' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" className="flex-shrink-0">
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M37.275 32.678V21.47A13.27 13.27 0 0 0 27.08 8.569v-.985a3.102 3.102 0 0 0-6.203 0v.996a13.27 13.27 0 0 0-10.152 12.89v11.208L6.52 36.883v1.942h34.96v-1.942Zm-17.948 6.147a4.65 4.65 0 0 0 9.301.048v-.048"/>
                        </svg>
                        <span>Reminders</span>
                      </button>
                      <button
                        onClick={() => {
                          setContentType('notes');
                          setShowContentTypeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors flex items-center space-x-2 ${
                          contentType === 'notes' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0">
                          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                            <path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"/>
                            <path d="M20.5 14.5A2.5 2.5 0 0 1 18 17c-.5 0-1.088-.087-1.573.043a1.25 1.25 0 0 0-.884.884c-.13.485-.043 1.074-.043 1.573A2.5 2.5 0 0 1 13 22"/>
                          </g>
                        </svg>
                        <span>Notes</span>
                      </button>
                      <button
                        onClick={() => {
                          setContentType('goals');
                          setShowContentTypeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors flex items-center space-x-2 ${
                          contentType === 'goals' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0">
                          <path fill="currentColor" d="M20.172 6.75h-1.861l-4.566 4.564a1.874 1.874 0 1 1-1.06-1.06l4.565-4.565V3.828a.94.94 0 0 1 .275-.664l1.73-1.73a.249.249 0 0 1 .25-.063c.089.026.155.1.173.191l.46 2.301l2.3.46c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.731 1.73a.937.937 0 0 1-.663.275Z"/>
                          <path fill="currentColor" d="M2.625 12A9.375 9.375 0 0 0 12 21.375A9.375 9.375 0 0 0 21.375 12c0-.898-.126-1.766-.361-2.587A.75.75 0 0 1 22.455 9c.274.954.42 1.96.42 3c0 6.006-4.869 10.875-10.875 10.875S1.125 18.006 1.125 12S5.994 1.125 12 1.125c1.015-.001 2.024.14 3 .419a.75.75 0 1 1-.413 1.442A9.39 9.39 0 0 0 12 2.625A9.375 9.375 0 0 0 2.625 12Z"/>
                          <path fill="currentColor" d="M7.125 12a4.874 4.874 0 1 0 9.717-.569a.748.748 0 0 1 1.047-.798c.251.112.42.351.442.625a6.373 6.373 0 0 1-10.836 5.253a6.376 6.376 0 0 1 5.236-10.844a.75.75 0 1 1-.17 1.49A4.876 4.876 0 0 0 7.125 12Z"/>
                        </svg>
                        <span>Goals</span>
                      </button>
                      <button
                        onClick={() => {
                          setContentType('settings');
                          setShowContentTypeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors flex items-center space-x-2 ${
                          contentType === 'settings' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0">
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/>
                        </svg>
                        <span>Settings</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div className="relative date-range-dropdown-container">
                <button 
                  onClick={() => setShowDateRangeDropdown(!showDateRangeDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-[#2a2a2a] hover:rounded-full transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 15 15" className="text-[#808080]">
                    <path fill="currentColor" fillRule="evenodd" d="M4.5 1a.5.5 0 0 1 .5.5V2h5v-.5a.5.5 0 0 1 1 0V2h1.5A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 1 12.5v-9A1.5 1.5 0 0 1 2.5 2H4v-.5a.5.5 0 0 1 .5-.5ZM10 3v.5a.5.5 0 0 0 1 0V3h1.5a.5.5 0 0 1 .5.5V5H2V3.5a.5.5 0 0 1 .5-.5H4v.5a.5.5 0 0 0 1 0V3h5ZM2 6v6.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V6H2Zm5 1.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0ZM9.5 7a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1Zm1.5.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0Zm.5 1.5a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1ZM9 9.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0ZM7.5 9a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1ZM5 9.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0ZM3.5 9a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1ZM3 11.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0Zm2.5-.5a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1Zm1.5.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0Zm2.5-.5a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1Z" clipRule="evenodd"/>
                  </svg>
                   <span className="text-[#808080] text-sm">Date</span>
                  <svg className="w-3 h-3 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showDateRangeDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-[#262626] border border-[#333] rounded-lg shadow-lg z-10 min-w-[160px]">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setDateRange('all');
                          setShowDateRangeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                          dateRange === 'all' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        All time
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('today');
                          setShowDateRangeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                          dateRange === 'today' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        Today
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('week');
                          setShowDateRangeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                          dateRange === 'week' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        This week
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('month');
                          setShowDateRangeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                          dateRange === 'month' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        This month
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('year');
                          setShowDateRangeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                          dateRange === 'year' ? 'text-white' : 'text-[#808080]'
                        }`}
                      >
                        This year
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          {searchQuery.trim() ? (
            // Search Results
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-[#808080] text-sm">Searching...</div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-[#808080] text-sm">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </div>
                  {searchResults.map((result, index) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="flex items-start space-x-4 p-4 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors"
                    >
                      <div className="text-[#808080] mt-1">
                        {getCategoryIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm mb-1">
                          {result.title}
                        </div>
                        <div className="text-[#808080] text-xs">
                          {result.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#808080]">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <div className="text-[#808080] text-sm text-center">
                    No results found for "{searchQuery}"
                  </div>
                  <div className="text-[#666] text-xs text-center mt-1">
                    Try different keywords or check your spelling
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Empty State - Recent Searches and Quick Actions
                <div className="space-y-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white text-sm font-medium">Recent Searches</h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[#808080] hover:text-white text-xs transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        className="w-full text-left p-3 rounded hover:bg-[#2a2a2a] transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#808080]">
                            <path d="M3 3l6 6"/>
                            <path d="M21 21l-6-6"/>
                            <path d="M11 11l6 6"/>
                            <path d="M3 3l6 6"/>
                          </svg>
                          <span className="text-[#808080] text-sm">{search}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="text-white text-sm font-medium mt-6 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                  <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-[#808080] flex-shrink-0">
                      <g fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12a8 8 0 1 1 16 0v5.09c0 .848 0 1.27-.126 1.609a2 2 0 0 1-1.175 1.175C18.36 20 17.937 20 17.09 20H12a8 8 0 0 1-8-8z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6m-3 4h3"/>
                      </g>
                    </svg>
                    <span className="text-white text-sm font-medium">Chat History</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-[#808080] flex-shrink-0">
                      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                        <path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"/>
                        <path d="M20.5 14.5A2.5 2.5 0 0 1 18 17c-.5 0-1.088-.087-1.573.043a1.25 1.25 0 0 0-.884.884c-.13.485-.043 1.074-.043 1.573A2.5 2.5 0 0 1 13 22"/>
                      </g>
                    </svg>
                    <span className="text-white text-sm font-medium">Notes</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-[#808080] flex-shrink-0">
                      <path fill="currentColor" d="M20.172 6.75h-1.861l-4.566 4.564a1.874 1.874 0 1 1-1.06-1.06l4.565-4.565V3.828a.94.94 0 0 1 .275-.664l1.73-1.73a.249.249 0 0 1 .25-.063c.089.026.155.1.173.191l.46 2.301l2.3.46c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.731 1.73a.937.937 0 0 1-.663.275Z"/>
                      <path fill="currentColor" d="M2.625 12A9.375 9.375 0 0 0 12 21.375A9.375 9.375 0 0 0 21.375 12c0-.898-.126-1.766-.361-2.587A.75.75 0 0 1 22.455 9c.274.954.42 1.96.42 3c0 6.006-4.869 10.875-10.875 10.875S1.125 18.006 1.125 12S5.994 1.125 12 1.125c1.015-.001 2.024.14 3 .419a.75.75 0 1 1-.413 1.442A9.39 9.39 0 0 0 12 2.625A9.375 9.375 0 0 0 2.625 12Z"/>
                      <path fill="currentColor" d="M7.125 12a4.874 4.874 0 1 0 9.717-.569a.748.748 0 0 1 1.047-.798c.251.112.42.351.442.625a6.373 6.373 0 0 1-10.836 5.253a6.376 6.376 0 0 1 5.236-10.844a.75.75 0 1 1-.17 1.49A4.876 4.876 0 0 0 7.125 12Z"/>
                    </svg>
                    <span className="text-white text-sm font-medium">Goals</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="text-[#808080] flex-shrink-0">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M37.275 32.678V21.47A13.27 13.27 0 0 0 27.08 8.569v-.985a3.102 3.102 0 0 0-6.203 0v.996a13.27 13.27 0 0 0-10.152 12.89v11.208L6.52 36.883v1.942h34.96v-1.942Zm-17.948 6.147a4.65 4.65 0 0 0 9.301.048v-.048"/>
                    </svg>
                    <span className="text-white text-sm font-medium">Reminders</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-[#808080] flex-shrink-0">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/>
                    </svg>
                    <span className="text-white text-sm font-medium">Settings</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
