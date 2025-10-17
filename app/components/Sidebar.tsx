import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { SettingsModal } from './SettingsModal';
import { SearchModal } from './SearchModal';

interface SidebarProps {
  onNewSession?: () => void;
}

export function Sidebar({ onNewSession }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(() => {
    // Initialize from localStorage, default to false if not found
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-expanded');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-expanded', JSON.stringify(newState));
    }
  };

  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(false);
    };
    if (profileDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [profileDropdownOpen]);

  return (
    <div className={`${isExpanded ? 'w-60' : 'w-12'} bg-[#202020] border-r border-[#262626] min-h-screen flex flex-col py-0 transition-all duration-200 ease-in-out`}>
      {/* Logo with tooltip */}
      <div 
        className={`group relative mb-2 ${isExpanded ? 'px-2' : 'flex justify-center'}`}
      >
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#252525] text-[#808080] text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
            Toggle Sidebar
            <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
              <div className="w-2 h-2 bg-[#252525] transform rotate-45"></div>
            </div>
          </div>
        )}
        <div 
          className={`flex items-center rounded-lg transition-colors ${isExpanded ? 'p-1.5' : 'p-1 justify-center'}`}
          onClick={toggleSidebar}
        >
          <div className={`rounded-lg transition-colors cursor-pointer ${isExpanded ? 'p-1.5 hover:bg-[#2a2a2a]' : 'p-1 hover:bg-[#2a2a2a]'}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24"
              className="text-[#808080] flex-shrink-0"
            >
              <path 
                fill="currentColor" 
                d={isExpanded 
                  ? "M11.92 19.92L4 12l7.92-7.92l1.41 1.42l-5.5 5.5H22v2H7.83l5.51 5.5l-1.42 1.42M4 12V2H2v20h2V12Z"
                  : "M12.08 4.08L20 12l-7.92 7.92l-1.41-1.42l5.5-5.5H2v-2h14.17l-5.51-5.5l1.42-1.42M20 12V22h2V2h-2V12Z"
                }
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Lumi AI Button with tooltip */}
      <div 
        className={`group relative mb-1 ${isExpanded ? 'px-2' : 'flex justify-center'}`}
      >
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#252525] text-[#808080] text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
            Lumi AI
            <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
              <div className="w-2 h-2 bg-[#252525] transform rotate-45"></div>
            </div>
          </div>
        )}
        <Link to="/" className={`flex items-center rounded-lg transition-colors cursor-pointer ${isExpanded ? 'w-full p-1.5 hover:bg-[#2a2a2a]' : 'p-1 hover:bg-[#2a2a2a] justify-center'} ${location.pathname === '/' ? 'bg-[#2a2a2a]' : ''}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24"
            className="text-[#808080] flex-shrink-0"
          >
            <g fill="none">
              <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
              <path fill="currentColor" d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"/>
            </g>
            </svg>
          {isExpanded && (
            <span className="text-[#808080] text-sm font-medium ml-2">Lumi AI</span>
          )}
        </Link>
      </div>

      {/* Search Button with tooltip */}
      <div 
        className={`group relative mb-1 ${isExpanded ? 'px-2' : 'flex justify-center'}`}
      >
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#252525] text-[#808080] text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
            Search
            <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
              <div className="w-2 h-2 bg-[#252525] transform rotate-45"></div>
            </div>
          </div>
        )}
        <button 
          onClick={() => setSearchModalOpen(true)}
          className={`flex items-center rounded-lg transition-colors cursor-pointer ${isExpanded ? 'w-full p-1.5 hover:bg-[#2a2a2a]' : 'p-1 hover:bg-[#2a2a2a] justify-center'}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 20 20"
            className="text-[#808080] flex-shrink-0"
          >
            <path 
              fill="currentColor" 
              d="M8.195 0c4.527 0 8.196 3.62 8.196 8.084a7.989 7.989 0 0 1-1.977 5.267l5.388 5.473a.686.686 0 0 1-.015.98a.71.71 0 0 1-.993-.014l-5.383-5.47a8.23 8.23 0 0 1-5.216 1.849C3.67 16.169 0 12.549 0 8.084C0 3.62 3.67 0 8.195 0Zm0 1.386c-3.75 0-6.79 2.999-6.79 6.698c0 3.7 3.04 6.699 6.79 6.699s6.791-3 6.791-6.699c0-3.7-3.04-6.698-6.79-6.698Z"
            />
          </svg>
          {isExpanded && (
            <span className="text-[#808080] text-sm font-medium ml-2">Search</span>
          )}
        </button>
      </div>

      {/* Chat History Button */}
      <div 
        className={`group relative mb-1 ${isExpanded ? 'px-2' : 'flex justify-center'}`}
      >
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#252525] text-[#808080] text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
            Chat History
            <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
              <div className="w-2 h-2 bg-[#252525] transform rotate-45"></div>
            </div>
          </div>
        )}
        <Link to="/chat-history" className={`flex items-center rounded-lg transition-colors cursor-pointer ${isExpanded ? 'w-full p-1.5 hover:bg-[#2a2a2a]' : 'p-1 hover:bg-[#2a2a2a] justify-center'} ${location.pathname === '/chat-history' ? 'bg-[#2a2a2a]' : ''}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24"
            className="text-[#808080] flex-shrink-0"
          >
            <g fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12a8 8 0 1 1 16 0v5.09c0 .848 0 1.27-.126 1.609a2 2 0 0 1-1.175 1.175C18.36 20 17.937 20 17.09 20H12a8 8 0 0 1-8-8z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6m-3 4h3"/>
            </g>
          </svg>
          {isExpanded && (
            <span className="text-[#808080] text-sm font-medium ml-2">Chat History</span>
          )}
        </Link>
      </div>

      {/* Notes Button */}
      <div 
        className={`group relative mb-1 ${isExpanded ? 'px-2' : 'flex justify-center'}`}
      >
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#252525] text-[#808080] text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
            Notes
            <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
              <div className="w-2 h-2 bg-[#252525] transform rotate-45"></div>
            </div>
          </div>
        )}
        <Link to="/notes" className={`flex items-center rounded-lg transition-colors cursor-pointer ${isExpanded ? 'w-full p-1.5 hover:bg-[#2a2a2a]' : 'p-1 hover:bg-[#2a2a2a] justify-center'} ${location.pathname === '/notes' ? 'bg-[#2a2a2a]' : ''}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24"
            className="text-[#808080] flex-shrink-0"
          >
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
              <path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"/>
              <path d="M20.5 14.5A2.5 2.5 0 0 1 18 17c-.5 0-1.088-.087-1.573.043a1.25 1.25 0 0 0-.884.884c-.13.485-.043 1.074-.043 1.573A2.5 2.5 0 0 1 13 22"/>
            </g>
          </svg>
          {isExpanded && (
            <span className="text-[#808080] text-sm font-medium ml-2">Notes</span>
          )}
        </Link>
      </div>

      {/* Goals Button */}
      <div 
        className={`group relative mb-1 ${isExpanded ? 'px-2' : 'flex justify-center'}`}
      >
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#252525] text-[#808080] text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
            Goals
            <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
              <div className="w-2 h-2 bg-[#252525] transform rotate-45"></div>
            </div>
          </div>
        )}
        <Link to="/goals" className={`flex items-center rounded-lg transition-colors cursor-pointer ${isExpanded ? 'w-full p-1.5 hover:bg-[#2a2a2a]' : 'p-1 hover:bg-[#2a2a2a] justify-center'} ${location.pathname === '/goals' ? 'bg-[#2a2a2a]' : ''}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24"
            className="text-[#808080] flex-shrink-0"
          >
            <path 
              fill="currentColor" 
              d="M20.172 6.75h-1.861l-4.566 4.564a1.874 1.874 0 1 1-1.06-1.06l4.565-4.565V3.828a.94.94 0 0 1 .275-.664l1.73-1.73a.249.249 0 0 1 .25-.063c.089.026.155.1.173.191l.46 2.301l2.3.46c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.731 1.73a.937.937 0 0 1-.663.275Z"
            />
            <path 
              fill="currentColor" 
              d="M2.625 12A9.375 9.375 0 0 0 12 21.375A9.375 9.375 0 0 0 21.375 12c0-.898-.126-1.766-.361-2.587A.75.75 0 0 1 22.455 9c.274.954.42 1.96.42 3c0 6.006-4.869 10.875-10.875 10.875S1.125 18.006 1.125 12S5.994 1.125 12 1.125c1.015-.001 2.024.14 3 .419a.75.75 0 1 1-.413 1.442A9.39 9.39 0 0 0 12 2.625A9.375 9.375 0 0 0 2.625 12Z"
            />
            <path 
              fill="currentColor" 
              d="M7.125 12a4.874 4.874 0 1 0 9.717-.569a.748.748 0 0 1 1.047-.798c.251.112.42.351.442.625a6.373 6.373 0 0 1-10.836 5.253a6.376 6.376 0 0 1 5.236-10.844a.75.75 0 1 1-.17 1.49A4.876 4.876 0 0 0 7.125 12Z"
            />
          </svg>
          {isExpanded && (
            <span className="text-[#808080] text-sm font-medium ml-2">Goals</span>
          )}
        </Link>
      </div>

      {/* Reminders Button */}
      <div 
        className={`group relative mb-1 ${isExpanded ? 'px-2' : 'flex justify-center'}`}
      >
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#252525] text-[#808080] text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
            Reminders
            <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
              <div className="w-2 h-2 bg-[#252525] transform rotate-45"></div>
            </div>
          </div>
        )}
        <Link to="/reminders" className={`flex items-center rounded-lg transition-colors cursor-pointer ${isExpanded ? 'w-full p-1.5 hover:bg-[#2a2a2a]' : 'p-1 hover:bg-[#2a2a2a] justify-center'} ${location.pathname === '/reminders' ? 'bg-[#2a2a2a]' : ''}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 48 48"
            className="text-[#808080] flex-shrink-0"
          >
            <path 
              fill="none" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2"
              d="M37.275 32.678V21.47A13.27 13.27 0 0 0 27.08 8.569v-.985a3.102 3.102 0 0 0-6.203 0v.996a13.27 13.27 0 0 0-10.152 12.89v11.208L6.52 36.883v1.942h34.96v-1.942Zm-17.948 6.147a4.65 4.65 0 0 0 9.301.048v-.048"
            />
          </svg>
          {isExpanded && (
            <span className="text-[#808080] text-sm font-medium ml-2">Reminders</span>
          )}
        </Link>
      </div>

      
      {/* User Profile - Only show when user is logged in */}
      {user && (
        <div className="mt-auto mb-4 px-1">
          {/* What is Lumi Button - Above Windows App */}
          <div 
            className={`group relative mb-4 ${isExpanded ? 'px-2' : 'flex justify-center'}`}
          >
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#252525] text-[#808080] text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
                What is Lumi
                <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-[#252525] transform rotate-45"></div>
                </div>
              </div>
            )}
            <button 
              onClick={() => alert('Learn more about Lumi coming soon!')}
              className={`flex items-center rounded-lg transition-colors cursor-pointer ${isExpanded ? 'w-full p-1.5 hover:bg-[#2a2a2a]' : 'p-1 hover:bg-[#2a2a2a] justify-center'}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24"
                className="text-[#808080] flex-shrink-0"
              >
                <path 
                  fill="currentColor" 
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41c0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                />
              </svg>
              {isExpanded && (
                <span className="text-[#808080] text-sm font-medium ml-2">What is Lumi</span>
              )}
            </button>
          </div>

          {/* Get Windows App Button - Same level as profile */}
          <div 
            className={`group relative mb-4 ${isExpanded ? 'px-2' : 'flex justify-center'}`}
          >
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#252525] text-[#808080] text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
                Get Windows App
                <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-[#252525] transform rotate-45"></div>
                </div>
              </div>
            )}
            <button 
              onClick={() => alert('Windows App download coming soon!')}
              className={`flex items-center rounded-lg transition-colors cursor-pointer ${isExpanded ? 'w-full p-1.5 hover:bg-[#2a2a2a]' : 'p-1 hover:bg-[#2a2a2a] justify-center'}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24"
                className="text-[#808080] flex-shrink-0"
              >
                <path 
                  fill="currentColor" 
                  d="m2.03 4.832l8.147-1.11l.004 7.86l-8.144.046l-.008-6.796Zm8.144 7.655l.006 7.867l-8.144-1.12l-.001-6.8l8.138.053Zm.987-8.91L21.965 2v9.482l-10.804.085v-7.99Zm10.807 8.984L21.965 22l-10.804-1.525l-.015-7.932Z"
                />
              </svg>
              {isExpanded && (
                <span className="text-[#808080] text-sm font-medium ml-2">Get Windows App</span>
              )}
            </button>
          </div>

          <div className={`relative flex items-center ${isExpanded ? 'justify-start' : 'justify-center'}`}>
            <div 
              className="flex items-center justify-between cursor-pointer rounded-lg p-1 hover:bg-[#2a2a2a] transition-colors w-full"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <div className="flex items-center">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-600"
                  />
                ) : (
                      <div className="w-8 h-8 rounded-lg bg-[#191919] flex items-center justify-center text-[#808080] font-medium text-sm">
                    {user.fullName 
                      ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                      : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                  </div>
                )}
                {isExpanded && (
                  <div className="ml-3 overflow-hidden min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {user.fullName || user.email}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-[#808080] text-xs">Free Plan</span>
                    </div>
                  </div>
                )}
              </div>
              {isExpanded && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24"
                  className="text-[#808080] hover:text-[#808080] transition-colors flex-shrink-0"
                >
                  <path 
                    fill="currentColor" 
                    fillRule="evenodd" 
                    d="M5.93 5.35A9 9 0 0 0 3.8 8.28L.9 7.34l-.62 1.9l2.9.95a9 9 0 0 0 0 3.62l-2.9.95l.62 1.9l2.9-.94a9 9 0 0 0 2.13 2.93l-1.8 2.47l1.63 1.18l1.8-2.47c1.03.59 2.2.98 3.44 1.12V24h2v-3.05a8.9 8.9 0 0 0 3.45-1.12l1.8 2.47l1.61-1.18l-1.8-2.47a9 9 0 0 0 2.14-2.93l2.9.94l.62-1.9l-2.9-.95a9 9 0 0 0 0-3.62l2.9-.95l-.62-1.9l-2.9.94a9 9 0 0 0-2.13-2.93l1.8-2.47l-1.63-1.18l-1.8 2.47A8.9 8.9 0 0 0 13 3.05V0h-2v3.05a8.9 8.9 0 0 0-3.45 1.12L5.75 1.7l-1.6 1.18l1.8 2.47zM12 19a7 7 0 1 1 0-14a7 7 0 0 1 0 14m4-7a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-6 0a2 2 0 1 0 4 0a2 2 0 0 0-4 0" 
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            
            {/* Profile Modal */}
            {profileDropdownOpen && (
              <div className="absolute left-full ml-2 -top-70 bg-[#252525] border border-[#3a3a3a] rounded-lg shadow-lg p-3 w-64 z-50">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[#808080] text-sm font-medium">Profile Settings</h2>
                  <button 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="text-[#808080] hover:text-[#808080] transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border border-gray-600"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-[#191919] flex items-center justify-center text-[#808080] font-medium text-xs">
                        {user.fullName 
                          ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                          : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium text-xs">
                        {user.fullName || user.email}
                      </p>
                      <p className="text-[#808080] text-xs">
                        {user.email}
                      </p>
                      <p className="text-[#808080] text-xs">
                        Free Plan
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-[#3a3a3a] pt-3 space-y-2">
                    <button 
                      onClick={() => {
                        setSettingsModalOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-[#808080] hover:text-[#808080] transition-colors text-xs py-1.5 px-2 rounded hover:bg-[#2a2a2a] text-left"
                    >
                      Settings
                    </button>
                    <button className="w-full text-[#808080] hover:text-[#808080] transition-colors text-xs py-1.5 px-2 rounded hover:bg-[#2a2a2a] text-left">
                      Help & FAQ
                    </button>
                    <button className="w-full text-[#808080] hover:text-[#808080] transition-colors text-xs py-1.5 px-2 rounded hover:bg-[#2a2a2a] text-left">
                      Privacy Policy
                    </button>
                    <button className="w-full text-[#808080] hover:text-[#808080] transition-colors text-xs py-1.5 px-2 rounded hover:bg-[#2a2a2a] text-left">
                      Terms
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full text-[#808080] hover:text-[#808080] transition-colors text-xs py-1.5 px-2 rounded hover:bg-[#2a2a2a] text-left"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
                <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-[#252525] border-l border-t border-[#3a3a3a] transform rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)} 
      />

      {/* Search Modal */}
      <SearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)}
        user={user ? {
          fullName: user.fullName || user.name,
          avatar: user.avatar,
          initials: user.initials || (user.fullName || user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()
        } : undefined}
      />

    </div>
  );
}

export default Sidebar;