import * as React from "react";
import type { Route } from "./+types/chat-history";
import { Sidebar } from "../components/Sidebar";
import { ChatHistoryList } from "../components/ChatHistoryList";
import { useIsMobile } from "../utils/deviceDetect";
import { useAuth } from "../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat History - Lumi AI" },
    { name: "description", content: "View your chat history" },
  ];
}

function ChatHistoryPage() {
  const isMobile = useIsMobile();
  const { user, loading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      console.log('ChatHistoryPage: User not authenticated, redirecting to login');
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

  return (
    <div className="flex h-screen overflow-hidden bg-[#191919]">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat History Heading */}
        <div className="pt-8 px-8">
          <div className="flex items-center justify-start mb-2">
            <svg 
              width="32" 
              height="32" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              className="mr-3"
            >
              <g fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12a8 8 0 1 1 16 0v5.09c0 .848 0 1.27-.126 1.609a2 2 0 0 1-1.175 1.175C18.36 20 17.937 20 17.09 20H12a8 8 0 0 1-8-8z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6m-3 4h3"/>
              </g>
            </svg>
            <h1 className="text-white text-3xl font-bold">Chat History</h1>
          </div>
          <p className="text-gray-400 text-sm">View and manage your chat conversations</p>
        </div>
        
        {/* Chat History Content */}
        <div className="flex-1 bg-[#191919] p-8">
          <div className="py-8">
            <ChatHistoryList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatHistoryPage;
