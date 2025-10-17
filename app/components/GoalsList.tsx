import * as React from "react";

interface Goal {
  id: number;
  title: string;
  description: string;
  category: 'personal' | 'professional' | 'health' | 'learning' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'not-started' | 'in-progress' | 'completed';
  createdAt: string;
  dueDate?: string;
  progress: number; // 0-100
  aiCheckIns: AICheckIn[];
}

interface AICheckIn {
  id: number;
  date: string;
  message: string;
  response?: string;
  completed: boolean;
}

interface GoalsListProps {
  viewMode: 'all' | 'completed' | 'in-progress';
  onViewModeChange: (mode: 'all' | 'completed' | 'in-progress') => void;
}

export function GoalsList({ viewMode, onViewModeChange }: GoalsListProps) {
  const [showMenuModal, setShowMenuModal] = React.useState(false);
  const [hoveredGoal, setHoveredGoal] = React.useState<number | null>(null);
  const [menuModalGoalId, setMenuModalGoalId] = React.useState<number | null>(null);
  const [menuModalPosition, setMenuModalPosition] = React.useState({ top: 0, left: 0 });
  const [showSearchBar, setShowSearchBar] = React.useState(false);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [showSortModal, setShowSortModal] = React.useState(false);
  const [showCreateGoalModal, setShowCreateGoalModal] = React.useState(false);
  const [goals, setGoals] = React.useState<Goal[]>([
    {
      id: 1,
      title: "Learn React Advanced Patterns",
      description: "Master advanced React patterns including hooks, context, and performance optimization",
      category: 'learning',
      priority: 'high',
      status: 'in-progress',
      createdAt: "Monday 16 April 2025",
      dueDate: "Friday 30 May 2025",
      progress: 65,
      aiCheckIns: [
        {
          id: 1,
          date: "Monday 16 April 2025",
          message: "How's your React learning going? Any specific patterns you're struggling with?",
          response: "I've been working on custom hooks and context. The patterns are getting clearer!",
          completed: true
        },
        {
          id: 2,
          date: "Wednesday 18 April 2025",
          message: "Ready for a check-in? How's the React advanced patterns study going?",
          completed: false
        }
      ]
    },
    {
      id: 2,
      title: "Complete 30-Day Fitness Challenge",
      description: "Follow a structured workout plan for 30 days to build healthy habits",
      category: 'health',
      priority: 'medium',
      status: 'in-progress',
      createdAt: "Tuesday 17 April 2025",
      dueDate: "Tuesday 20 May 2025",
      progress: 40,
      aiCheckIns: [
        {
          id: 3,
          date: "Tuesday 17 April 2025",
          message: "Starting your fitness challenge today! How are you feeling about it?",
          response: "Excited but nervous. I'll start with light workouts.",
          completed: true
        }
      ]
    },
    {
      id: 3,
      title: "Read 12 Books This Year",
      description: "Read one book per month to expand knowledge and improve reading habits",
      category: 'personal',
      priority: 'medium',
      status: 'in-progress',
      createdAt: "Wednesday 18 April 2025",
      progress: 25,
      aiCheckIns: [
        {
          id: 4,
          date: "Wednesday 18 April 2025",
          message: "What book are you currently reading? How's the reading goal progressing?",
          response: "Reading 'Atomic Habits' - it's really insightful!",
          completed: true
        }
      ]
    },
    {
      id: 4,
      title: "Launch Personal Website",
      description: "Create and deploy a personal portfolio website showcasing my projects",
      category: 'professional',
      priority: 'high',
      status: 'not-started',
      createdAt: "Thursday 19 April 2025",
      dueDate: "Sunday 15 June 2025",
      progress: 0,
      aiCheckIns: []
    }
  ]);

  const handleViewGoal = (goalId: number) => {
    console.log(`Viewing goal ${goalId}`);
  };

  const handleDeleteGoal = (goalId: number) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    setShowMenuModal(false);
    setMenuModalGoalId(null);
  };

  const handleUpdateProgress = (goalId: number, newProgress: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress: newProgress, status: newProgress === 100 ? 'completed' : 'in-progress' }
        : goal
    ));
  };

  const handleAICheckIn = (goalId: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const newCheckIn: AICheckIn = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        message: `How's your progress on "${goal.title}"? Any updates or challenges?`,
        completed: false
      };
      
      setGoals(prev => prev.map(g => 
        g.id === goalId 
          ? { ...g, aiCheckIns: [...g.aiCheckIns, newCheckIn] }
          : g
      ));
    }
    setShowMenuModal(false);
    setMenuModalGoalId(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      case 'not-started': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-blue-400">
          <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      );
      case 'professional': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-purple-400">
          <path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
        </svg>
      );
      case 'health': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-green-400">
          <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      );
      case 'learning': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-orange-400">
          <path fill="currentColor" d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73l-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
      );
      default: return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-gray-400">
          <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22L12 18.77L5.82 22L7 14.14L2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
    }
  };

  const filteredGoals = goals.filter(goal => {
    switch (viewMode) {
      case 'completed': return goal.status === 'completed';
      case 'in-progress': return goal.status === 'in-progress';
      default: return true;
    }
  });

  return (
    <div className="w-full relative">
      {/* Action Icons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* All Goals Button */}
          <button 
            onClick={() => onViewModeChange('all')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
              viewMode === 'all' ? 'bg-[#313131] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22L12 18.77L5.82 22L7 14.14L2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-xs">All Goals</span>
          </button>
          
          {/* In Progress Button */}
          <button 
            onClick={() => onViewModeChange('in-progress')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
              viewMode === 'in-progress' ? 'bg-[#313131] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-xs">In Progress</span>
          </button>
          
          {/* Completed Button */}
          <button 
            onClick={() => onViewModeChange('completed')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
              viewMode === 'completed' ? 'bg-[#313131] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"/>
            </svg>
            <span className="text-xs">Completed</span>
          </button>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 relative">
          <button 
            onClick={() => setShowCreateGoalModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#313131] text-white rounded-lg hover:bg-[#404040] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span className="text-xs">New Goal</span>
          </button>
          
          <button 
            onClick={() => setShowSearchBar(!showSearchBar)}
            className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M10.77 18.3a7.53 7.53 0 1 1 7.53-7.53a7.53 7.53 0 0 1-7.53 7.53Zm0-13.55a6 6 0 1 0 6 6a6 6 0 0 0-6-6Z"/>
              <path fill="currentColor" d="M20 20.75a.74.74 0 0 1-.53-.22l-4.13-4.13a.75.75 0 0 1 1.06-1.06l4.13 4.13a.75.75 0 0 1 0 1.06a.74.74 0 0 1-.53.22Z"/>
            </svg>
          </button>
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
              placeholder="Search goals..."
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

      {/* Goals List */}
      <div className="space-y-3">
        {filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#3a3a3a] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-gray-400">
                <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22L12 18.77L5.82 22L7 14.14L2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-white text-lg font-medium mb-2">
              {viewMode === 'completed' ? 'No Completed Goals' : 
               viewMode === 'in-progress' ? 'No Goals In Progress' : 'No Goals Yet'}
            </h3>
            <p className="text-gray-400 text-sm">
              {viewMode === 'completed' ? 'Complete some goals to see them here' : 
               viewMode === 'in-progress' ? 'Start working on your goals to see them here' : 'Create your first goal to get started'}
            </p>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <div 
              key={goal.id}
              className={`flex items-center justify-between py-3 px-4 rounded-lg cursor-pointer transition-colors ${
                hoveredGoal === goal.id || (showMenuModal && menuModalGoalId === goal.id) ? 'bg-[#252525]' : 'hover:bg-[#252525]'
              }`}
              onMouseEnter={() => setHoveredGoal(goal.id)}
              onMouseLeave={() => setHoveredGoal(null)}
              onClick={() => handleViewGoal(goal.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Menu Icon */}
                {(hoveredGoal === goal.id || (showMenuModal && menuModalGoalId === goal.id)) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMenuModalPosition({
                        top: rect.bottom + 8,
                        left: rect.left
                      });
                      setMenuModalGoalId(goal.id);
                      setShowMenuModal(true);
                    }}
                    className="p-1 rounded hover:bg-[#3a3a3a] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6a4 4 0 1 0-8 0a4 4 0 0 0 8 0m0 12a4 4 0 1 0-8 0a4 4 0 0 0 8 0M22 6a4 4 0 1 0-8 0a4 4 0 0 0 8 0m0 12a4 4 0 1 0-8 0a4 4 0 0 0 8 0"/>
                    </svg>
                  </button>
                )}
                
                {/* Category Icon */}
                <div className="w-6 h-6 rounded-full bg-[#3a3a3a] flex items-center justify-center">
                  {getCategoryIcon(goal.category)}
                </div>
                
                {/* Goal Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white text-sm font-normal truncate">{goal.title}</h3>
                    <div className="flex items-center gap-2 ml-2">
                      <span className={`text-xs ${getPriorityColor(goal.priority)}`}>
                        {goal.priority.toUpperCase()}
                      </span>
                      <span className={`text-xs ${getStatusColor(goal.status)}`}>
                        {goal.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs truncate mb-2">{goal.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#3a3a3a] rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-xs">{goal.progress}%</span>
                  </div>
                  
                  {/* AI Check-ins */}
                  {goal.aiCheckIns.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" className="text-blue-400">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-gray-400 text-xs">
                        {goal.aiCheckIns.filter(checkIn => checkIn.completed).length}/{goal.aiCheckIns.length} check-ins
                      </span>
                    </div>
                  )}
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
          setMenuModalGoalId(null);
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
                  if (menuModalGoalId) handleViewGoal(menuModalGoalId);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-[#3a3a3a] rounded transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z"/>
                </svg>
                View Details
              </button>
              <div className="border-t border-[#3a3a3a] my-1"></div>
              <button 
                onClick={() => {
                  if (menuModalGoalId) handleAICheckIn(menuModalGoalId);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-[#3a3a3a] rounded transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                AI Check-in
              </button>
              <button 
                onClick={() => {
                  if (menuModalGoalId) {
                    const newProgress = prompt('Update progress (0-100):');
                    if (newProgress && !isNaN(Number(newProgress))) {
                      handleUpdateProgress(menuModalGoalId, Math.min(100, Math.max(0, Number(newProgress))));
                    }
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-[#3a3a3a] rounded transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/>
                </svg>
                Update Progress
              </button>
              <div className="border-t border-[#3a3a3a] my-1"></div>
              <button 
                onClick={() => {
                  if (menuModalGoalId) {
                    if (confirm('Are you sure you want to delete this goal?')) {
                      handleDeleteGoal(menuModalGoalId);
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
