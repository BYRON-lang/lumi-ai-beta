import * as React from "react";
import type { Route } from "./+types/goals";
import { Sidebar } from "../components/Sidebar";
import { GoalsList } from "../components/GoalsList";
import { useIsMobile } from "../utils/deviceDetect";
import { useAuth } from "../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Goals - Lumi AI" },
    {
      name: "description",
      content: "Track and manage your personal goals with AI assistance",
    },
  ];
}

function GoalsPage() {
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = React.useState<'all' | 'completed' | 'in-progress'>('all');

  const toggleViewMode = (mode: 'all' | 'completed' | 'in-progress') => {
    setViewMode(mode);
  };

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      console.log('GoalsPage: User not authenticated, redirecting to login');
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
        {/* Goals Heading */}
        <div className="pt-8 px-8">
          <div className="flex items-center justify-start mb-2">
            <svg 
              width="32" 
              height="32" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 102 102"
              className="mr-3"
            >
              <defs>
                <path id="flatUiGoal0" fill="#F0C419" fillRule="evenodd" d="M89 74H76l13 13h13L89 74z" clipRule="evenodd"/>
              </defs>
              <circle cx="50" cy="52" r="50" opacity=".15"/>
              <circle cx="52" cy="50" r="50" fill="#3B97D3"/>
              <path fill="#fff" d="M52 10c22.091 0 40 17.909 40 40S74.091 90 52 90S12 72.091 12 50s17.909-40 40-40z"/>
              <path fill="#6BC8F2" fillRule="evenodd" d="M52 20c16.569 0 30 13.431 30 30c0 16.568-13.431 30-30 30c-16.569 0-30-13.432-30-30c0-16.569 13.431-30 30-30z" clipRule="evenodd"/>
              <path fill="#fff" d="M52 30c11.046 0 20 8.955 20 20s-8.954 20-20 20s-20-8.955-20-20s8.954-20 20-20z"/>
              <path fill="#E64C3C" fillRule="evenodd" d="M52 40c5.523 0 10 4.477 10 10c0 5.522-4.477 10-10 10s-10-4.478-10-10c0-5.523 4.477-10 10-10z" clipRule="evenodd"/>
              <use href="#flatUiGoal0" fillRule="evenodd" clipRule="evenodd"/>
              <path fill="#F29C1F" fillRule="evenodd" d="M89 100V87L76 74v13l13 13z" clipRule="evenodd"/>
              <use href="#flatUiGoal0" fillRule="evenodd" clipRule="evenodd"/>
              <path d="M50.439 48.439L15.121 83.757a50.513 50.513 0 0 0 2.097 2.145L52.56 50.56a1.5 1.5 0 1 0-2.121-2.121z" opacity=".15"/>
              <path fill="#E57E25" d="M90.363 89.896c-.384 0-.769-.146-1.062-.439L50.939 51.061a1.501 1.501 0 0 1 2.123-2.121l38.363 38.395a1.501 1.501 0 0 1-1.062 2.561z"/>
            </svg>
            <h1 className="text-white text-3xl font-bold">Goals</h1>
          </div>
          <p className="text-gray-400 text-sm">Set and track your personal goals with AI assistance</p>
        </div>
        
        {/* Goals Content */}
        <div className="flex-1 bg-[#191919] p-8">
          <div className="py-8">
            <GoalsList viewMode={viewMode} onViewModeChange={toggleViewMode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Goals() {
  const isMobile = useIsMobile();
  
  if (typeof window === 'undefined') {
    return null;
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#191919] text-white p-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Goals</h1>
          <p className="text-gray-400 mb-8">Goals page is currently under development.</p>
        </div>
      </div>
    );
  }

  return <GoalsPage />;
}
