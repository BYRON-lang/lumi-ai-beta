import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { chatStorage } from '../services/chatStorage';
import { DeleteDialog } from './DeleteDialog';
import type { StoredChat } from '../lib/lumiApi';

interface SidebarProps {
  onNewSession?: () => void;
  onLoadChat?: (chatId: string) => void;
  currentChatId?: string | null;
}

export function Sidebar({ onNewSession, onLoadChat, currentChatId }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chats, setChats] = useState<StoredChat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    chatId: string;
    chatTitle: string;
  }>({
    isOpen: false,
    chatId: '',
    chatTitle: ''
  });
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const { user, logout } = useAuth();
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '';

  // Load chats when user is authenticated
  useEffect(() => {
    if (user) {
      loadChats();
    } else {
      setChats([]);
    }
  }, [user]);

  const loadChats = async () => {
    setIsLoadingChats(true);
    try {
      const userChats = await chatStorage.getChats();
      setChats(userChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const handleLoadChat = (chatId: string) => {
    onLoadChat?.(chatId);
  };

  const handleMenuClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === chatId ? null : chatId);
  };

  const handleRename = async (chatId: string) => {
    const newTitle = prompt('Enter new title:');
    if (newTitle && newTitle.trim()) {
      try {
        await chatStorage.updateChatTitle(chatId, newTitle.trim());
        await loadChats(); // Reload chats to reflect changes
      } catch (error) {
        console.error('Error renaming chat:', error);
      }
    }
    setOpenDropdown(null);
  };

  const handleDelete = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setDeleteDialog({
        isOpen: true,
        chatId: chatId,
        chatTitle: chat.title
      });
    }
    setOpenDropdown(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await chatStorage.deleteChat(deleteDialog.chatId);
      await loadChats(); // Reload chats to reflect changes
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
    setDeleteDialog({
      isOpen: false,
      chatId: '',
      chatTitle: ''
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      chatId: '',
      chatTitle: ''
    });
  };

  const handleStar = async (chatId: string) => {
    try {
      // Toggle star status
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        await chatStorage.updateChatTitle(chatId, chat.title, !chat.starred);
        await loadChats(); // Reload chats to reflect changes
      }
    } catch (error) {
      console.error('Error starring chat:', error);
    }
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

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
          className={`flex items-center rounded-lg transition-colors ${isExpanded ? 'p-1.5' : 'p-1'}`}
          onClick={toggleSidebar}
        >
          <div className={`rounded-lg transition-colors cursor-pointer ${isExpanded ? 'p-1.5 hover:bg-[#3a3a3a]' : 'p-1 hover:bg-[#3a3a3a]'}`}>
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
          </div>
          {isExpanded && (
            <span className="text-white text-2xl font-light ml-3 brand-text lowercase">lumi ai</span>
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
      {isExpanded && user && (
        <div className="px-4 mt-6 mb-2">
          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">Recents</h3>
        </div>
      )}

      {/* Chat History List */}
      {isExpanded && user && (
        <div className="flex-1 overflow-y-auto px-2">
          {isLoadingChats ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : chats.length > 0 ? (
            <div className="space-y-0.5">
              {chats.slice(0, 10).map((chat) => (
                <div
                  key={chat.id}
                  className={`p-1.5 rounded-lg transition-colors group relative ${
                    currentChatId === chat.id
                      ? 'bg-orange-500/20 border border-orange-500/30'
                      : 'hover:bg-[#3a3a3a]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleLoadChat(chat.id)}
                    >
                      <p className="text-white text-md font-medium truncate">
                        {chat.title}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 relative">
                      <button
                        onClick={(e) => handleMenuClick(e, chat.id)}
                        className="p-0.5 rounded hover:bg-[#4a4a4a] transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
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
                          className="text-gray-400"
                        >
                          <circle cx="12" cy="12" r="1"/>
                          <circle cx="12" cy="5" r="1"/>
                          <circle cx="12" cy="19" r="1"/>
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openDropdown === chat.id && (
                        <div className="absolute right-0 top-8 w-32 bg-[#171717] border border-[#3a3a3a] rounded-lg shadow-lg z-50">
                          <button
                            onClick={() => handleRename(chat.id)}
                            className="w-full px-3 py-2 text-left text-sm text-white hover:bg-[#3a3a3a] rounded-t-lg flex items-center cursor-pointer"
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
                              className="mr-2"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Rename
                          </button>
                          <button
                            onClick={() => handleStar(chat.id)}
                            className="w-full px-3 py-2 text-left text-sm text-white hover:bg-[#3a3a3a] flex items-center cursor-pointer"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="14" 
                              height="14" 
                              viewBox="0 0 24 24" 
                              fill={chat.starred ? "currentColor" : "none"} 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                            </svg>
                            {chat.starred ? 'Unstar' : 'Star'}
                          </button>
                          <button
                            onClick={() => handleDelete(chat.id)}
                            className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-[#3a3a3a] rounded-b-lg flex items-center cursor-pointer"
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
                              className="mr-2"
                            >
                              <polyline points="3,6 5,6 21,6"/>
                              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                              <line x1="10" y1="11" x2="10" y2="17"/>
                              <line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No chats yet</p>
              <p className="text-gray-500 text-xs mt-1">Start a new conversation</p>
            </div>
          )}
        </div>
      )}
      
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

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Chat"
        message="Are you sure you want to delete this chat? This action cannot be undone and all messages in this conversation will be permanently removed."
        itemName={deleteDialog.chatTitle}
      />
    </div>
  );
}

export default Sidebar;