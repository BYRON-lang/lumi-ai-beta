import * as React from "react";

interface ChatHistory {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: string;
  date: string;
  messageCount: number;
  isArchived?: boolean;
}

interface ChatHistoryListProps {
  // Add any props you might need in the future
}

export function ChatHistoryList({}: ChatHistoryListProps) {
  const [showMenuModal, setShowMenuModal] = React.useState(false);
  const [hoveredChat, setHoveredChat] = React.useState<number | null>(null);
  const [menuModalChatId, setMenuModalChatId] = React.useState<number | null>(null);
  const [menuModalPosition, setMenuModalPosition] = React.useState({ top: 0, left: 0 });
  const [showSearchBar, setShowSearchBar] = React.useState(false);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [showSortModal, setShowSortModal] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<'all' | 'archived'>('all');
  const [archivedChats, setArchivedChats] = React.useState<ChatHistory[]>([]);
  const [chatHistories, setChatHistories] = React.useState<ChatHistory[]>([
    {
      id: 1,
      title: "React Development Help",
      lastMessage: "How do I implement state management in React?",
      timestamp: "@ 2:30 PM",
      date: "Monday 16 April 2025",
      messageCount: 15
    },
    {
      id: 2,
      title: "Python Data Analysis",
      lastMessage: "Can you help me with pandas dataframes?",
      timestamp: "@ 10:00 AM",
      date: "Tuesday 17 April 2025",
      messageCount: 8
    },
    {
      id: 3,
      title: "JavaScript Questions",
      lastMessage: "What's the difference between let and const?",
      timestamp: "@ 6:00 PM",
      date: "Wednesday 18 April 2025",
      messageCount: 12
    },
    {
      id: 4,
      title: "CSS Styling Help",
      lastMessage: "How do I center a div vertically?",
      timestamp: "@ 3:45 PM",
      date: "Thursday 19 April 2025",
      messageCount: 6
    }
  ]);

  const handleViewChat = (chatId: number) => {
    // Navigate to chat or open chat in modal
    console.log(`Viewing chat ${chatId}`);
    // You can implement navigation here
  };

  const handleDeleteChat = (chatId: number) => {
    if (currentView === 'all') {
    setChatHistories(prev => prev.filter(chat => chat.id !== chatId));
    } else {
      setArchivedChats(prev => prev.filter(chat => chat.id !== chatId));
    }
    setShowMenuModal(false);
    setMenuModalChatId(null);
  };

  const handleArchiveChat = (chatId: number) => {
    const chatToArchive = chatHistories.find(chat => chat.id === chatId);
    if (chatToArchive) {
      // Add to archived chats
      setArchivedChats(prev => [...prev, { ...chatToArchive, isArchived: true }]);
      // Remove from active chats
      setChatHistories(prev => prev.filter(chat => chat.id !== chatId));
    }
    setShowMenuModal(false);
    setMenuModalChatId(null);
  };

  const handleUnarchiveChat = (chatId: number) => {
    const chatToUnarchive = archivedChats.find(chat => chat.id === chatId);
    if (chatToUnarchive) {
      // Add back to active chats
      setChatHistories(prev => [...prev, { ...chatToUnarchive, isArchived: false }]);
      // Remove from archived chats
      setArchivedChats(prev => prev.filter(chat => chat.id !== chatId));
    }
    setShowMenuModal(false);
    setMenuModalChatId(null);
  };

  return (
    <div className="w-full relative">
      {/* Action Icons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* All Chats Button */}
          <button 
            onClick={() => setCurrentView('all')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
              currentView === 'all' ? 'bg-[#313131] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="M4 12a8 8 0 1 1 16 0v5.09c0 .848 0 1.27-.126 1.609a2 2 0 0 1-1.175 1.175C18.36 20 17.937 20 17.09 20H12a8 8 0 0 1-8-8z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6m-3 4h3"/>
              </g>
            </svg>
            <span className="text-xs">All Chats</span>
          </button>
          
          {/* Archived Chats Button */}
          <button 
            onClick={() => setCurrentView('archived')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
              currentView === 'archived' ? 'bg-[#313131] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18l-2 13H5L3 6zM3 6L2 4M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            <span className="text-xs">Archived</span>
          </button>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 relative">
          <button 
            onClick={() => setShowFilterModal(!showFilterModal)}
            className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.5 7.25h15M7.385 12h9.23m-6.345 4.75h3.46"/>
            </svg>
          </button>
          
          {/* Filter Modal */}
          {showFilterModal && (
            <div className="absolute top-full -left-15 mt-2 z-50">
              <div className="bg-[#252525] border border-[#3a3a3a] rounded-lg p-4 w-64 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-sm">Filter Options</h3>
                  <button 
                    onClick={() => setShowFilterModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Chat Type</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Recent</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Archived</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Date Range</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Today</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">This Week</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">This Month</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setShowFilterModal(false)}
                      className="flex-1 px-3 py-2 bg-[#3a3a3a] text-white rounded-lg hover:bg-[#4a4a4a] transition-colors text-sm"
                    >
                      Apply
                    </button>
                    <button 
                      onClick={() => setShowFilterModal(false)}
                      className="flex-1 px-3 py-2 border border-[#3a3a3a] text-gray-400 rounded-lg hover:bg-[#3a3a3a] transition-colors text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => setShowSettingsModal(!showSettingsModal)}
            className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/>
            </svg>
          </button>
          
          {/* Settings Modal */}
          {showSettingsModal && (
            <div className="absolute top-full -left-15 mt-2 z-50">
              <div className="bg-[#252525] border border-[#3a3a3a] rounded-lg p-4 w-64 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-sm">Settings</h3>
                  <button 
                    onClick={() => setShowSettingsModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Display Options</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Show Timestamp</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Show Message Count</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Show Preview</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Layout</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="layout" className="border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Compact</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="layout" className="border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Spacious</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setShowSettingsModal(false)}
                      className="flex-1 px-3 py-2 bg-[#3a3a3a] text-white rounded-lg hover:bg-[#4a4a4a] transition-colors text-sm"
                    >
                      Apply
                    </button>
                    <button 
                      onClick={() => setShowSettingsModal(false)}
                      className="flex-1 px-3 py-2 border border-[#3a3a3a] text-gray-400 rounded-lg hover:bg-[#3a3a3a] transition-colors text-sm"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => setShowSearchBar(!showSearchBar)}
            className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M10.77 18.3a7.53 7.53 0 1 1 7.53-7.53a7.53 7.53 0 0 1-7.53 7.53Zm0-13.55a6 6 0 1 0 6 6a6 6 0 0 0-6-6Z"/>
              <path fill="currentColor" d="M20 20.75a.74.74 0 0 1-.53-.22l-4.13-4.13a.75.75 0 0 1 1.06-1.06l4.13 4.13a.75.75 0 0 1 0 1.06a.74.74 0 0 1-.53.22Z"/>
            </svg>
          </button>
          
          <button 
            onClick={() => setShowSortModal(!showSortModal)}
            className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M6.293 4.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L8 7.414V19a1 1 0 1 1-2 0V7.414L3.707 9.707a1 1 0 0 1-1.414-1.414l4-4zM16 16.586V5a1 1 0 1 1 2 0v11.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L16 16.586z"/>
            </svg>
          </button>
          
          {/* Sort Modal */}
          {showSortModal && (
            <div className="absolute top-full -left-15 mt-2 z-50">
              <div className="bg-[#252525] border border-[#3a3a3a] rounded-lg p-4 w-64 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-sm">Sort Options</h3>
                  <button 
                    onClick={() => setShowSortModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Sort By</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sortBy" className="border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Title</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sortBy" className="border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Last Message</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sortBy" className="border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Message Count</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sortBy" className="border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Created</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Order</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sortOrder" className="border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Ascending</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sortOrder" className="border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Descending</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setShowSortModal(false)}
                      className="flex-1 px-3 py-2 bg-[#3a3a3a] text-white rounded-lg hover:bg-[#4a4a4a] transition-colors text-sm"
                    >
                      Apply
                    </button>
                    <button 
                      onClick={() => setShowSortModal(false)}
                      className="flex-1 px-3 py-2 border border-[#3a3a3a] text-gray-400 rounded-lg hover:bg-[#3a3a3a] transition-colors text-sm"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        showSearchBar ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search chat history..."
              className="w-full px-4 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#3a3a3a] transition-colors"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <path fill="currentColor" d="M10.77 18.3a7.53 7.53 0 1 1 7.53-7.53a7.53 7.53 0 0 1-7.53 7.53Zm0-13.55a6 6 0 1 0 6 6a6 6 0 0 0-6-6Z"/>
              <path fill="currentColor" d="M20 20.75a.74.74 0 0 1-.53-.22l-4.13-4.13a.75.75 0 0 1 1.06-1.06l4.13 4.13a.75.75 0 0 1 0 1.06a.74.74 0 0 1-.53.22Z"/>
            </svg>
          </div>
          <button
            onClick={() => setShowSearchBar(false)}
            className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat History List */}
      <div className="space-y-2">
        {/* New Chat Button - Only show in All Chats view */}
        {currentView === 'all' && (
        <div 
          className="flex items-center justify-between py-2 px-4 rounded-lg cursor-pointer hover:bg-[#252525] transition-colors mb-0"
          onMouseEnter={() => setHoveredChat(0)}
          onMouseLeave={() => setHoveredChat(null)}
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#3a3a3a] flex items-center justify-center">
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
            <span className="text-white text-sm font-normal">New Chat</span>
          </div>
        </div>
        )}

        {/* Chat History Items */}
        {currentView === 'archived' && archivedChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#3a3a3a] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-gray-400">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18l-2 13H5L3 6zM3 6L2 4M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <h3 className="text-white text-lg font-medium mb-2">No Archived Chats</h3>
            <p className="text-gray-400 text-sm">Chats you archive will appear here</p>
          </div>
        ) : (
          (currentView === 'all' ? chatHistories : archivedChats).map((chat) => (
          <div 
            key={chat.id}
            className={`flex items-center justify-between py-2 px-4 rounded-lg cursor-pointer transition-colors ${
              hoveredChat === chat.id || (showMenuModal && menuModalChatId === chat.id) ? 'bg-[#252525]' : 'hover:bg-[#252525]'
            }`}
            onMouseEnter={() => setHoveredChat(chat.id)}
            onMouseLeave={() => setHoveredChat(null)}
            onClick={() => handleViewChat(chat.id)}
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Menu Icon */}
              {(hoveredChat === chat.id || (showMenuModal && menuModalChatId === chat.id)) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMenuModalPosition({
                      top: rect.bottom + 8,
                      left: rect.left
                    });
                    setMenuModalChatId(chat.id);
                    setShowMenuModal(true);
                  }}
                  className="p-1 rounded hover:bg-[#3a3a3a] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6a4 4 0 1 0-8 0a4 4 0 0 0 8 0m0 12a4 4 0 1 0-8 0a4 4 0 0 0 8 0M22 6a4 4 0 1 0-8 0a4 4 0 0 0 8 0m0 12a4 4 0 1 0-8 0a4 4 0 0 0 8 0"/>
                  </svg>
                </button>
              )}
              
              {/* Chat Icon */}
              <div className="w-6 h-6 rounded-full bg-[#3a3a3a] flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24"
                  className="text-white"
                >
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path d="M4 12a8 8 0 1 1 16 0v5.09c0 .848 0 1.27-.126 1.609a2 2 0 0 1-1.175 1.175C18.36 20 17.937 20 17.09 20H12a8 8 0 0 1-8-8z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6m-3 4h3"/>
                  </g>
                </svg>
              </div>
              
              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-sm font-normal truncate">{chat.title}</h3>
                  <span className="text-gray-400 text-xs ml-2">{chat.date} {chat.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))
        )}
      </div>

      {/* Menu Modal */}
      {showMenuModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50" onClick={() => {
          setShowMenuModal(false);
          setMenuModalChatId(null);
        }}>
          <div 
            className="fixed bg-[#252525] border border-[#3a3a3a] rounded-lg p-2 w-48 shadow-lg" 
            style={{
              top: `${menuModalPosition.top}px`,
              left: `${menuModalPosition.left}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <button 
                onClick={() => {
                  if (menuModalChatId) handleViewChat(menuModalChatId);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-[#3a3a3a] rounded transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z"/>
                </svg>
                View
              </button>
              <div className="border-t border-[#3a3a3a] my-1"></div>
              {currentView === 'all' ? (
              <button 
                onClick={() => {
                  if (menuModalChatId) handleArchiveChat(menuModalChatId);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-[#3a3a3a] rounded transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M3 6h18l-2 13H5L3 6zM3 6L2 4M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Archive
              </button>
              ) : (
                <button 
                  onClick={() => {
                    if (menuModalChatId) handleUnarchiveChat(menuModalChatId);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-[#3a3a3a] rounded transition-colors text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M3 6h18l-2 13H5L3 6zM3 6L2 4M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Unarchive
                </button>
              )}
              <button 
                onClick={() => {
                  if (menuModalChatId) {
                    if (confirm('Are you sure you want to delete this chat?')) {
                      handleDeleteChat(menuModalChatId);
                    }
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-[#3a3a3a] rounded transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
