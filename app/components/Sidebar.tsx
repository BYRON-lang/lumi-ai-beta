import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface SidebarProps {
  onNewSession?: () => void;
}

export function Sidebar({ onNewSession }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const { user, logout } = useAuth();
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '';

  return (
    <div className={`${isExpanded ? 'w-64' : 'w-12'} bg-[#262624] border-r border-[#3a3a3a] min-h-screen flex flex-col py-3 transition-all duration-200 ease-in-out`}>
      {/* Logo with tooltip */}
      <div 
        className={`group relative mb-10 ${isExpanded ? 'px-2' : 'flex justify-center'}`}
      >
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#171717] text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
            Toggle Sidebar
            <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
              <div className="w-2 h-2 bg-[#171717] transform rotate-45"></div>
            </div>
          </div>
        )}
        <div 
          className={`flex items-center rounded-lg transition-colors cursor-pointer ${isExpanded ? 'p-1.5 hover:bg-[#3a3a3a]' : 'p-1 hover:bg-[#3a3a3a]'}`}
          onClick={toggleSidebar}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 28 28"
            className="text-white flex-shrink-0"
          >
            <path 
              fill="currentColor" 
              d="M17.72 11.53a.75.75 0 1 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72h-5.69a.75.75 0 0 1 0-1.5h5.69l-1.72-1.72ZM26 7.75A3.75 3.75 0 0 0 22.25 4H5.755a3.75 3.75 0 0 0-3.75 3.75v12.5A3.75 3.75 0 0 0 5.754 24H22.25A3.75 3.75 0 0 0 26 20.25V7.75ZM22.25 5.5a2.25 2.25 0 0 1 2.25 2.25v12.5a2.25 2.25 0 0 1-2.25 2.25H11.005v-17H22.25Zm-12.745 0v17H5.754a2.25 2.25 0 0 1-2.25-2.25V7.75a2.25 2.25 0 0 1 2.25-2.25h3.75Z"
            />
          </svg>
          {isExpanded && (
            <span className="text-white text-2xl font-bold ml-2">Lumi</span>
          )}
        </div>
      </div>

      {/* New Chat Button with tooltip */}
      <div 
        className={`group relative mb-4 ${isExpanded ? 'px-2' : 'flex justify-center'}`}
      >
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#171717] text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
            New Chat
            <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
              <div className="w-2 h-2 bg-[#171717] transform rotate-45"></div>
            </div>
          </div>
        )}
        <div 
          className={`flex items-center rounded-lg transition-colors cursor-pointer ${isExpanded ? 'p-1.5 hover:bg-[#3a3a3a]' : 'p-1 hover:bg-[#3a3a3a]'}`}
          onClick={onNewSession}
        >
          <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center group-hover:bg-orange-600 transition-colors flex-shrink-0">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 512 512"
              className="text-white"
            >
              <path 
                fill="none" 
                stroke="currentColor" 
                strokeLinejoin="round" 
                strokeWidth="32" 
                d="M256 112v288m144-144H112"
              />
            </svg>
          </div>
          {isExpanded && (
            <span className="text-white text-sm font-medium ml-2">New Chat</span>
          )}
        </div>
      </div>

      {/* Chat History Button */}
      <div 
        className={`group relative mb-4 ${isExpanded ? 'px-2' : 'flex justify-center'}`}
      >
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#171717] text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
            Chat History
            <div className="absolute top-1/2 right-full w-2 h-2 -translate-y-1/2">
              <div className="w-2 h-2 bg-[#171717] transform rotate-45"></div>
            </div>
          </div>
        )}
        <div className={`flex items-center rounded-lg transition-colors cursor-pointer ${isExpanded ? 'p-1.5 hover:bg-[#3a3a3a]' : 'p-1 hover:bg-[#3a3a3a]'}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24"
            className="text-white flex-shrink-0"
          >
            <path 
              fill="currentColor" 
              d="M22 12c0-5.523-4.477-10-10-10a9.97 9.97 0 0 0-7 2.859V3.75a.75.75 0 0 0-1.5 0v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 0-1.5H5.519a8.5 8.5 0 1 1 2.348 12.93l-.27-.15-3.986 1.111 1.113-3.984-.151-.27A8.46 8.46 0 0 1 3.5 12c0-.675.079-1.332.227-1.962c.08-.301.065-.888-.536-1.02c-.613-.134-.87.355-.935.719h.001A10 10 0 0 0 2 12a9.96 9.96 0 0 0 1.115 4.592l-1.068 3.823a1.25 1.25 0 0 0 1.54 1.54l3.826-1.067A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10M12 8.75a.75.75 0 0 0-1.5 0v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 0-1.5H12z"
            />
          </svg>
          {isExpanded && (
            <span className="text-white text-sm font-medium ml-2">Chat History</span>
          )}
        </div>
      </div>

      {/* Recents Heading */}
      {isExpanded && (
        <div className="px-4 mt-6 mb-2">
          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">Recents</h3>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1"></div>
      
      {/* User Profile - Only show when user is logged in */}
      {user && (
        <div className="mt-auto mb-4 px-1">
          <div className={`flex items-center ${isExpanded ? 'justify-start' : 'justify-center'}`}>
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-600"
                title={user.fullName || user.email}
              />
            ) : (
              <div 
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm cursor-pointer"
                title={user.fullName || user.email}
              >
                {user.fullName 
                  ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </div>
            )}
            {isExpanded && (
              <div className="ml-3 overflow-hidden min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {user.fullName || user.email}
                </p>
                {user.fullName && (
                  <p className="text-gray-400 text-xs truncate">
                    {user.email}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <span className="text-gray-400 text-xs">Free Plan</span>
                  <button 
                    onClick={logout}
                    className="ml-2 text-gray-400 hover:text-white transition-colors"
                    title="Sign out"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="hover:scale-110 transition-transform"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;