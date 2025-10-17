import * as React from "react";
import type { Route } from "./+types/notes";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { useIsMobile } from "../utils/deviceDetect";
import { useAuth } from "../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Notes - Lumi.Ai" },
    {
      name: "description",
      content: "Notes page for Lumi.Ai",
    },
  ];
}

function NotesPage() {
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const toggleViewMode = () => {
    setViewMode(viewMode === 'gallery' ? 'list' : 'gallery');
  };

  const handleFilterClick = () => {
    setShowFilterModal(!showFilterModal);
  };

  const handleSearchClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      console.log('NotesPage: User not authenticated, redirecting to login');
      window.location.href = '/';
    }
  }, [user, authLoading]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#171717',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #333',
            borderTop: '2px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const handleSortClick = () => {
    setShowSortModal(!showSortModal);
  };
  return (
    <div className="flex h-screen overflow-hidden bg-[#191919]">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Notes Heading */}
        <div className="pt-8 px-8">
          <div className="flex items-center justify-start mb-2">
            <svg 
              width="24" 
              height="24" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              className="mr-3"
            >
              <g fill="none" fillRule="evenodd" clipRule="evenodd">
                <path fill="white" d="M7.175 5.083c-.22 3.002-.27 3.503-.26 3.673c0 .38.42.62.78.74c1.481.541 7.226 1.002 8.147.401a2.33 2.33 0 0 0 .72-1.581c.1-.771.09-3.884-.2-4.234c-.45-.59-1.37-.58-5.374-.71H7.855c-.71-.01-.67 1.61-.68 1.71m.72-1.001c2.038.015 4.072.183 6.086.5c.28 0 1.15 0 1.43.09c-.1.11 0 .52.05.651c.14 1 0 3.473-.26 3.633h-.22c-1.761-.18-3.292.51-6.866-.23c-.67-.18-.22-3.863-.22-4.674z"/>
                <path fill="white" d="M22.458 4.082c-.32-.11-2.262-.22-2.252.15c-.24.83 1.932.13 2.152.7c.256.84.371 1.716.34 2.593a4.63 4.63 0 0 0-2.602-.31c0-4.084.12-4.004 0-4.644a1.73 1.73 0 0 0-.65-1.141C15.991-.852 11.137.649 7.404.129a9.3 9.3 0 0 0-3.073 0c-1.301.34-1.281 1.5-.73 1.5a.34.34 0 0 0 .38-.37c0-.86 2.532-.5 3.313-.38c3.633.55 8.547-.78 11.61 1.331c.46.32.23.931 0 12.351c.07 1.994-.09 3.989-.48 5.945c-.14.54-.25 1.362-.691 1.662c-1.522 1-4.694.67-6.516.3s-3.373.17-5.004-.09c-.821-.13-2.783-.11-3.003-.76a3.6 3.6 0 0 1-.15-.781q1.007.052 2.002-.11a.35.35 0 0 0 0-.49a5 5 0 0 0-2.002-.531c0-.731.08-1.201.18-2.332c.613.04 1.228.002 1.832-.11a.35.35 0 0 0 0-.49a4.4 4.4 0 0 0-1.772-.491V13.79c.477.03.955-.006 1.421-.11a.35.35 0 0 0 0-.49a3.4 3.4 0 0 0-1.43-.44V9.667c.476.03.954-.007 1.42-.11a.35.35 0 0 0 0-.49c-.428-.25-.907-.4-1.4-.441V5.753c.476.03.954-.006 1.42-.11a.35.35 0 0 0 0-.49a3.4 3.4 0 0 0-1.43-.44c.18-2.583.15-2.232.13-2.323a.27.27 0 0 0-.371-.24c-.33.08-.25.36-.41 2.472c-.871-.11-2.563-.29-2.423.54c0 .101.12.201.32.271s1.732.26 2.103.31v2.783c-.861-.1-2.533-.28-2.393.55c0 .31.601.34 2.342.56c0 1.002-.06 2.003-.07 3.004c-.82-.09-2.412-.25-2.272.56c0 .1.12.2.32.27s1.392.21 1.942.28c0 .911 0 1.532-.08 2.433c-.73-.05-2.001-.13-1.871.6c0 .1.12.2.32.27c.05 0 .84.14 1.451.22c-.12 1.111-.19 1.602-.23 2.353c-.67 0-1.651 0-1.541.62c0 .1.12.2.32.28l1.211.18q.017.623.19 1.222c.44 1.37 2.633 1.29 3.774 1.5c1.56.281 3.503-.15 5.004.151c2.192.46 5.545.81 7.396-.45a3.47 3.47 0 0 0 1.161-2.352c.362-1.643.527-3.323.49-5.005c.475.155.974.223 1.472.2a3.2 3.2 0 0 1 .81 0c-.16 1.512-.07.861-.16 1.952c-.2.51-.35.78-.9.8c-.09 0-1.081-.21-1.291.14a.33.33 0 0 0 .05.421c.399.137.82.201 1.24.19c2.493.07 2.003-3.943 2.363-7.726c.07-1.712.43-7.127-1.241-7.667m.23 4.354c0 1.19-.15 2.372-.22 3.253c0 .5.31-.15-2.392.08V8.085c.85.235 1.73.353 2.612.35m-2.642 6.445v-2.13c.465.109.946.136 1.421.08q.48.014.95-.07v2.372a5 5 0 0 0-2.371-.25"/>
              </g>
            </svg>
            <h1 className="text-white text-3xl font-bold">Notes</h1>
          </div>
          <p className="text-gray-400 text-sm">Organize your thoughts and ideas</p>
          
          {/* View Buttons and Actions */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewMode('gallery')}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors cursor-pointer ${
                  viewMode === 'gallery' 
                    ? 'bg-[#313131] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg 
                  width="14" 
                  height="14" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  className="text-current"
                >
                  <g fill="none">
                    <path 
                      fillRule="evenodd" 
                      clipRule="evenodd" 
                      d="M5 9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5zm0 13a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5zm10 0a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4zm0-8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4z" 
                      fill="currentColor"
                    />
                  </g>
                </svg>
                <span className="text-xs">Gallery View</span>
              </button>
              
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors cursor-pointer ${
                  viewMode === 'list' 
                    ? 'bg-[#313131] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg 
                  width="14" 
                  height="14" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  className="text-current"
                >
                  <path 
                    fill="none" 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01"
                  />
                </svg>
                <span className="text-xs">List View</span>
              </button>
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center gap-3">
              {/* Filter Icon */}
              <div className="relative">
                <button 
                  onClick={handleFilterClick}
                  className="p-2 rounded-lg hover:bg-[#252525] transition-colors cursor-pointer"
                >
              <svg 
                    width="16" 
                    height="16" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                    className={`transition-colors ${showFilterModal ? 'text-orange-400' : 'text-gray-400'}`}
              >
                <path 
                  fill="currentColor" 
                  d="M9 5a1 1 0 1 0 0 2a1 1 0 0 0 0-2zM6.17 5a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 0 1 0-2h1.17zM15 11a1 1 0 1 0 0 2a1 1 0 0 0 0-2zm-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2h7.17zM9 17a1 1 0 1 0 0 2a1 1 0 0 0 0-2zm-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2h1.17z"
                />
              </svg>
                </button>
          
          {/* Filter Modal */}
          {showFilterModal && (
                  <div className="absolute top-full right-0 mt-2 z-50">
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
                          <label className="text-gray-400 text-xs font-medium mb-2 block">Note Type</label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                              <span className="text-white text-sm">User Generated</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                              <span className="text-white text-sm">AI Generated</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                              <span className="text-white text-sm">Conversation</span>
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
                            className="flex-1 px-3 py-2 bg-[#3a3a3a] text-white rounded-lg hover:bg-[#4a4a4a] transition-colors text-sm cursor-pointer"
                          >
                            Apply
                          </button>
                    <button 
                      onClick={() => setShowFilterModal(false)}
                            className="flex-1 px-3 py-2 border border-[#3a3a3a] text-gray-400 rounded-lg hover:bg-[#3a3a3a] transition-colors text-sm cursor-pointer"
                    >
                            Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
              </div>
              
              {/* Search Icon */}
              <button 
                onClick={handleSearchClick}
                className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
              >
                <svg 
                  width="16" 
                  height="16" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 21 21"
                  className={`transition-colors ${showSearchBar ? 'text-orange-400' : 'text-gray-400'}`}
              >
                <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8.5" cy="8.5" r="5"/>
                  <path d="M17.571 17.5L12 12"/>
                </g>
              </svg>
              </button>
              
              {/* Sort Icon */}
              <div className="relative">
                <button 
                  onClick={handleSortClick}
                  className="p-2 rounded-lg hover:bg-[#252525] transition-colors cursor-pointer"
                >
              <svg 
                    width="16" 
                    height="16" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 21 21"
                    className={`transition-colors ${showSortModal ? 'text-orange-400' : 'text-gray-400'}`}
              >
                <path 
                  fill="none" 
                  stroke="currentColor" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="m10.5 12.5l4 4.107l4-4.107m-8-4l-4-4l-4 3.997m4-3.997v12m8-12v12"
                />
                    </svg>
                  </button>
          
          {/* Sort Modal */}
          {showSortModal && (
                  <div className="absolute top-full right-0 mt-2 z-50">
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
                              <span className="text-white text-sm">Date</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="sortBy" className="border-[#3a3a3a] bg-[#252525] text-white" />
                              <span className="text-white text-sm">Type</span>
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
                            className="flex-1 px-3 py-2 bg-[#3a3a3a] text-white rounded-lg hover:bg-[#4a4a4a] transition-colors text-sm cursor-pointer"
                          >
                            Apply
                          </button>
                    <button 
                      onClick={() => setShowSortModal(false)}
                            className="flex-1 px-3 py-2 border border-[#3a3a3a] text-gray-400 rounded-lg hover:bg-[#3a3a3a] transition-colors text-sm cursor-pointer"
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
          </div>
          
          {/* Search Bar */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showSearchBar ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#3a3a3a] transition-colors"
                />
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <path 
                    fill="currentColor" 
                    d="M10.77 18.3a7.53 7.53 0 1 1 7.53-7.53a7.53 7.53 0 0 1-7.53 7.53Zm0-13.55a6 6 0 1 0 6 6a6 6 0 0 0-6-6Z"
                  />
                  <path 
                    fill="currentColor" 
                    d="M20 20.75a.74.74 0 0 1-.53-.22l-4.13-4.13a.75.75 0 0 1 1.06-1.06l4.13 4.13a.75.75 0 0 1 0 1.06a.74.74 0 0 1-.53.22Z"
                  />
                </svg>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Notes Content */}
        <div className="flex-1 bg-[#191919] p-8">
          {viewMode === 'gallery' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* New Note Card */}
              <div className="bg-[#252525] border-2 border-dashed border-[#3a3a3a] rounded-lg p-6 hover:border-orange-500/50 transition-colors cursor-pointer flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">New Note</h3>
                  <p className="text-gray-400 text-sm">Create a new note</p>
                </div>
              </div>

              {/* User Generated Note Card */}
              <div className="bg-[#252525] border border-[#3a3a3a] rounded-lg p-6 hover:border-orange-500/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white font-medium text-sm">User</span>
                  </div>
                  <span className="text-gray-400 text-xs">2 hours ago</span>
                </div>
                
                <h3 className="text-white font-semibold text-lg mb-2">Meeting Notes</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  Discussed project timeline and deliverables. Need to finalize the design mockups by next week. Team agreed on using React for the frontend development.
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">work</span>
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">meeting</span>
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">project</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <button className="text-gray-400 hover:text-white transition-colors text-xs">
                    Edit
                  </button>
                  <button className="text-gray-400 hover:text-red-400 transition-colors text-xs">
                    Delete
                  </button>
                </div>
              </div>

              {/* Lumi Generated Note Card */}
              <div className="bg-[#252525] border border-[#3a3a3a] rounded-lg p-6 hover:border-orange-500/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="text-white font-medium text-sm">Lumi AI</span>
                  </div>
                  <span className="text-gray-400 text-xs">1 hour ago</span>
                </div>
                
                <h3 className="text-white font-semibold text-lg mb-2">Code Review Summary</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  Analyzed the pull request for the authentication module. Found 3 minor issues with error handling. Suggested improvements for better user experience and security.
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs">code</span>
                  <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs">review</span>
                  <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs">ai-generated</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <button className="text-gray-400 hover:text-white transition-colors text-xs">
                    View
                  </button>
                  <button className="text-gray-400 hover:text-orange-400 transition-colors text-xs">
                    Regenerate
                  </button>
                </div>
              </div>

              {/* Conversation Summary Card */}
              <div className="bg-[#252525] border border-[#3a3a3a] rounded-lg p-6 hover:border-orange-500/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white font-medium text-sm">Conversation</span>
                  </div>
                  <span className="text-gray-400 text-xs">30 min ago</span>
                </div>
                
                <h3 className="text-white font-semibold text-lg mb-2">Chat Summary</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  Discussed React best practices, component architecture, and state management. User asked about performance optimization techniques and got detailed explanations.
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">react</span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">summary</span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">chat</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <button className="text-gray-400 hover:text-white transition-colors text-xs">
                    View Chat
                  </button>
                  <button className="text-gray-400 hover:text-purple-400 transition-colors text-xs">
                    Export
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#252525] border border-[#3a3a3a] rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-[#191919] px-6 py-4 border-b border-[#3a3a3a]">
                <div className="grid grid-cols-12 gap-4 text-gray-400 text-sm font-medium">
                  <div className="col-span-1">Type</div>
                  <div className="col-span-4">Title</div>
                  <div className="col-span-3">Content</div>
                  <div className="col-span-2">Tags</div>
                  <div className="col-span-1">Date</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-[#3a3a3a]">
                {/* New Note Row */}
                <div className="px-6 py-4 hover:bg-[#191919] transition-colors cursor-pointer">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <h3 className="text-white font-semibold text-sm">New Note</h3>
                      <p className="text-gray-400 text-xs">Create a new note</p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-gray-300 text-sm">Click to create a new note</p>
                    </div>
                    <div className="col-span-2">
                      <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs">new</span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-gray-400 text-xs">Now</span>
                    </div>
                    <div className="col-span-1">
                      <button className="text-gray-400 hover:text-orange-400 transition-colors text-xs">
                        Create
                      </button>
                    </div>
                  </div>
                </div>

                {/* User Generated Note Row */}
                <div className="px-6 py-4 hover:bg-[#191919] transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <h3 className="text-white font-semibold text-sm">Meeting Notes</h3>
                      <p className="text-gray-400 text-xs">User • 2 hours ago</p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-gray-300 text-sm line-clamp-2">
                        Discussed project timeline and deliverables. Need to finalize the design mockups by next week.
                      </p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">work</span>
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">meeting</span>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <span className="text-gray-400 text-xs">2h ago</span>
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-white transition-colors text-xs">
                          Edit
                        </button>
                        <button className="text-gray-400 hover:text-red-400 transition-colors text-xs">
                          Del
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lumi Generated Note Row */}
                <div className="px-6 py-4 hover:bg-[#191919] transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <h3 className="text-white font-semibold text-sm">Code Review Summary</h3>
                      <p className="text-gray-400 text-xs">Lumi AI • 1 hour ago</p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-gray-300 text-sm line-clamp-2">
                        Analyzed the pull request for the authentication module. Found 3 minor issues with error handling.
                      </p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs">code</span>
                        <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs">review</span>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <span className="text-gray-400 text-xs">1h ago</span>
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-white transition-colors text-xs">
                          View
                        </button>
                        <button className="text-gray-400 hover:text-orange-400 transition-colors text-xs">
                          Reg
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversation Summary Row */}
                <div className="px-6 py-4 hover:bg-[#191919] transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <h3 className="text-white font-semibold text-sm">Chat Summary</h3>
                      <p className="text-gray-400 text-xs">Conversation • 30 min ago</p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-gray-300 text-sm line-clamp-2">
                        Discussed React best practices, component architecture, and state management.
                      </p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">react</span>
                        <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">summary</span>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <span className="text-gray-400 text-xs">30m ago</span>
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-white transition-colors text-xs">
                          View
                        </button>
                        <button className="text-gray-400 hover:text-purple-400 transition-colors text-xs">
                          Exp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Notes() {
  const isMobile = useIsMobile();
  
  if (typeof window === 'undefined') {
    return null;
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#191919] text-white p-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Notes</h1>
          <p className="text-gray-400 mb-8">Notes page is currently blank.</p>
        </div>
      </div>
    );
  }

  return <NotesPage />;
}
