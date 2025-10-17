import * as React from "react";
import type { Route } from "./+types/reminders";
import { Sidebar } from "../components/Sidebar";
import { ReminderList } from "../components/ReminderList";
import { CalendarView } from "../components/CalendarView";
import { useIsMobile } from "../utils/deviceDetect";
import { useAuth } from "../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reminders - Lumi.Ai" },
    {
      name: "description",
      content: "Reminders page for Lumi.Ai",
    },
  ];
}

function RemindersPage() {
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = React.useState<'all' | 'calendar'>('all');

  const toggleViewMode = (mode: 'all' | 'calendar') => {
    setViewMode(mode);
  };

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      console.log('RemindersPage: User not authenticated, redirecting to login');
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
        {/* Reminders Heading */}
        <div className="pt-8 px-8">
          <div className="flex items-center justify-start mb-2">
            <svg 
              width="32" 
              height="32" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 32 32"
              className="mr-3"
            >
              <path 
                fill="currentColor" 
                d="m30 23.382l-2-1V20a6.005 6.005 0 0 0-5-5.91V12h-2v2.09A6.005 6.005 0 0 0 16 20v2.382l-2 1V28h6v2h4v-2h6ZM28 26H16v-1.382l2-1V20a4 4 0 0 1 8 0v3.618l2 1Z"
              />
              <path 
                fill="currentColor" 
                d="M28 6a2 2 0 0 0-2-2h-4V2h-2v2h-8V2h-2v2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h4v-2H6V6h4v2h2V6h8v2h2V6h4v6h2Z"
              />
            </svg>
            <h1 className="text-white text-3xl font-bold">Reminders</h1>
          </div>
          <p className="text-gray-400 text-sm">Manage your reminders and notifications</p>
        </div>
        
        {/* Reminders Content */}
        <div className="flex-1 bg-[#191919] p-8">
          {viewMode === 'all' ? (
            <div className="py-8">
              <ReminderList viewMode={viewMode} onViewModeChange={toggleViewMode} />
            </div>
          ) : (
            <div className="py-8">
              <CalendarView viewMode={viewMode} onViewModeChange={toggleViewMode} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Reminders() {
  const isMobile = useIsMobile();
  
  if (typeof window === 'undefined') {
    return null;
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#191919] text-white p-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Reminders</h1>
          <p className="text-gray-400 mb-8">Reminders page is currently blank.</p>
        </div>
      </div>
    );
  }

  return <RemindersPage />;
}
