import * as React from "react";

interface Reminder {
  id: number;
  title: string;
  time: string;
  date: string;
  notificationType: 'notified' | 'silent';
}

interface CalendarViewProps {
  viewMode: 'all' | 'calendar';
  onViewModeChange: (mode: 'all' | 'calendar') => void;
}

export function CalendarView({ viewMode, onViewModeChange }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [showSearchBar, setShowSearchBar] = React.useState(false);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [showSortModal, setShowSortModal] = React.useState(false);
  const [reminders] = React.useState<Reminder[]>([
    {
      id: 1,
      title: "Start Programming",
      time: "@ 2:30 PM",
      date: "Monday 16 April 2025",
      notificationType: 'notified'
    },
    {
      id: 2,
      title: "Team Meeting",
      time: "@ 10:00 AM",
      date: "Tuesday 17 April 2025",
      notificationType: 'notified'
    },
    {
      id: 3,
      title: "Gym Session",
      time: "@ 6:00 PM",
      date: "Wednesday 18 April 2025",
      notificationType: 'notified'
    },
    {
      id: 4,
      title: "Doctor Appointment",
      time: "@ 3:15 PM",
      date: "Thursday 19 April 2025",
      notificationType: 'silent'
    }
  ]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getRemindersForDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    return reminders.filter(reminder => {
      // Parse the reminder date string to extract day, month, year
      const reminderDate = new Date(reminder.date);
      return reminderDate.getDate() === day && 
             reminderDate.getMonth() === month && 
             reminderDate.getFullYear() === year;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="w-full relative">
      {/* View Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onViewModeChange('all')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
              viewMode === 'all' 
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
            <span className="text-xs">All Reminders</span>
          </button>
          
          <button 
            onClick={() => onViewModeChange('calendar')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
              viewMode === 'calendar' 
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
                fill="currentColor" 
                d="M8.5 6.5A.5.5 0 0 1 9 6h6a.5.5 0 0 1 0 1H9a.5.5 0 0 1-.5-.5M8 12a1 1 0 1 0 0 2a1 1 0 0 0 0-2m8 0a1 1 0 1 0 0 2a1 1 0 0 0 0-2m-5 1a1 1 0 1 1 2 0a1 1 0 0 1-2 0m-3 3a1 1 0 1 0 0 2a1 1 0 0 0 0-2m3 1a1 1 0 1 1 2 0a1 1 0 0 1-2 0"
              />
              <path 
                fill="currentColor" 
                d="M13.623 3h-3.246c-1.1 0-1.958 0-2.645.056c-.698.057-1.265.175-1.775.434A4.5 4.5 0 0 0 3.99 5.457c-.26.51-.377 1.077-.434 1.775C3.5 7.92 3.5 8.776 3.5 9.877v4.246c0 1.1 0 1.958.056 2.645c.057.698.175 1.265.434 1.775a4.5 4.5 0 0 0 1.967 1.967c.51.26 1.077.377 1.775.434C8.42 21 9.276 21 10.377 21h3.246c1.1 0 1.958 0 2.645-.056c.698-.057 1.265-.175 1.775-.434a4.5 4.5 0 0 0 1.967-1.967c.26-.51.377-1.077.434-1.775c.056-.687.056-1.544.056-2.645V9.877c0-1.1 0-1.958-.056-2.645c-.057-.698-.175-1.265-.434-1.775a4.5 4.5 0 0 0-1.967-1.967c-.51-.26-1.077-.377-1.775-.434C15.58 3 14.724 3 13.623 3M6.41 4.381c.346-.176.766-.276 1.403-.328C8.455 4 9.272 4 10.4 4h3.2c1.128 0 1.945 0 2.586.053c.637.052 1.057.152 1.403.328a3.5 3.5 0 0 1 1.53 1.53c.176.346.276.766.328 1.403c.038.457.049 1.002.052 1.686H4.5c.004-.684.014-1.23.052-1.686c.052-.637.152-1.057.328-1.403a3.5 3.5 0 0 1 1.53-1.53M4.5 10h15v4.1c0 1.128 0 1.945-.053 2.586c-.052.637-.152 1.057-.328 1.403a3.5 3.5 0 0 1-1.53 1.53c-.346.176-.766.276-1.402.328C15.545 20 14.728 20 13.6 20h-3.2c-1.128 0-1.945 0-2.586-.053c-.637-.052-1.057-.152-1.403-.328a3.5 3.5 0 0 1-1.53-1.53c-.176-.346-.276-.766-.328-1.402C4.5 16.045 4.5 15.228 4.5 14.1z"
              />
              <path 
                fill="currentColor" 
                fillRule="evenodd" 
                d="M8.25 6.5A.75.75 0 0 1 9 5.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75M6.75 13a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m8 0a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m-4 0a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m-4 4a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m4 0a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m2.884-14.25c1.091 0 1.957 0 2.654.057c.714.058 1.317.18 1.869.46a4.75 4.75 0 0 1 2.075 2.077c.281.55.403 1.154.461 1.868c.057.697.057 1.563.057 2.654v4.268c0 1.091 0 1.957-.057 2.654c-.058.714-.18 1.317-.46 1.869a4.75 4.75 0 0 1-2.076 2.075c-.552.281-1.155.403-1.869.461c-.697.057-1.563.057-2.654.057h-3.268c-1.091 0-1.957 0-2.654-.057c-.714-.058-1.317-.18-1.868-.46a4.75 4.75 0 0 1-2.076-2.076c-.281-.552-.403-1.155-.461-1.869c-.057-.697-.057-1.563-.057-2.654V9.866c0-1.091 0-1.957.057-2.654c.058-.714.18-1.317.46-1.868a4.75 4.75 0 0 1 2.077-2.076c.55-.281 1.154-.403 1.868-.461c.697-.057 1.563-.057 2.655-.057zm-5.8 1.552c-.62.05-1.005.147-1.31.302a3.25 3.25 0 0 0-1.42 1.42c-.155.305-.251.69-.302 1.31c-.032.39-.044.85-.05 1.416h14.495a20 20 0 0 0-.049-1.416c-.05-.62-.147-1.005-.302-1.31a3.25 3.25 0 0 0-1.42-1.42c-.305-.155-.69-.251-1.31-.302c-.63-.051-1.434-.052-2.566-.052h-3.2c-1.133 0-1.937 0-2.566.052M19.497 8.75a20 20 0 0 0-.05-1.436c-.052-.637-.152-1.057-.328-1.403a3.5 3.5 0 0 0-1.53-1.53c-.346-.176-.766-.276-1.402-.328C15.545 4 14.728 4 13.6 4h-3.2c-1.128 0-1.945 0-2.586.053c-.637-.052-1.057-.152-1.403.328a3.5 3.5 0 0 0-1.53 1.53c-.176.346-.276.766-.328 1.403c-.033.4-.045.867-.05 1.436L4.5 9h15zm-.247 1.5H4.75v3.85c0 1.133 0 1.937.052 2.566c.05.62.147 1.005.302 1.31a3.25 3.25 0 0 0 1.42 1.42c.305.155.69.251 1.31.302c.63.051 1.433.052 2.566.052h3.2c1.133 0 1.937 0 2.566-.052c.62-.05 1.005-.147 1.31-.302a3.25 3.25 0 0 0 1.42-1.42c.155-.305.251-.69.302-1.31c.051-.63.052-1.434.052-2.566zM10.377 3h3.246c1.1 0 1.958 0 2.645.056c.698.057 1.265.175 1.775.434a4.5 4.5 0 0 1 1.967 1.967c.26.51.377 1.077.434 1.775c.056.687.056 1.544.056 2.645v4.246c0 1.1 0 1.958-.056 2.645c-.057.698-.175 1.265-.434 1.775a4.5 4.5 0 0 1-1.967 1.967c-.51.26-1.077.377-1.775.434c-.687.056-1.544.056-2.645.056h-3.246c-1.1 0-1.958 0-2.645-.056c-.698-.057-1.265-.175-1.775-.434a4.5 4.5 0 0 1-1.967-1.967c-.26-.51-.377-1.077-.434-1.775c-.056-.687-.056-1.544-.056-2.645V9.877c0-1.1 0-1.958.056-2.645c-.057-.698-.175-1.265-.434-1.775A4.5 4.5 0 0 1 5.957 3.49c.51-.26 1.077-.377 1.775-.434C8.42 3 9.276 3 10.377 3M4.5 10v4.1c0 1.128 0 1.945.053 2.586c.052.637.152 1.057.328 1.403a3.5 3.5 0 0 0 1.53 1.53c.346.176.766.276 1.403.328C8.455 20 9.272 20 10.4 20h3.2c1.128 0 1.945 0 2.586-.053c.637-.052 1.057-.152 1.403-.328a3.5 3.5 0 0 0 1.53-1.53c.176-.346.276-.766.328-1.402c.053-.642.053-1.459.053-2.587V10zm4-3.5A.5.5 0 0 1 9 6h6a.5.5 0 0 1 0 1H9a.5.5 0 0 1-.5-.5M8 12a1 1 0 1 0 0 2a1 1 0 0 0 0-2m7 1a1 1 0 1 1 2 0a1 1 0 0 1-2 0m-4 0a1 1 0 1 1 2 0a1 1 0 0 1-2 0m-4 4a1 1 0 1 1 2 0a1 1 0 0 1-2 0m4 0a1 1 0 1 1 2 0a1 1 0 0 1-2 0" 
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs">Calendar View</span>
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
                    <label className="text-gray-400 text-xs font-medium mb-2 block">Notification Type</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Notified</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Silent</span>
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
                        <span className="text-white text-sm">Show Time</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Show Date</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Show Icons</span>
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
                        <span className="text-white text-sm">Date</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sortBy" className="border-[#3a3a3a] bg-[#252525] text-white" />
                        <span className="text-white text-sm">Time</span>
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
              placeholder="Search reminders..."
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
          <button
            onClick={() => setShowSearchBar(false)}
            className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="text-white text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-4 py-2 bg-[#252525] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors text-sm"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#252525] border border-[#3a3a3a] rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-gray-400 text-sm font-medium border-b border-[#3a3a3a]">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-24 border-r border-b border-[#3a3a3a] last:border-r-0"></div>;
            }

            const dayReminders = getRemindersForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();

            return (
              <div
                key={day.getTime()}
                className={`h-24 border-r border-b border-[#3a3a3a] last:border-r-0 p-2 cursor-pointer hover:bg-[#3a3a3a] transition-colors ${
                  !isCurrentMonth ? 'opacity-30' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-orange-500' : 'text-white'
                }`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayReminders.slice(0, 2).map(reminder => (
                    <div
                      key={reminder.id}
                      className={`text-xs px-2 py-1 rounded truncate ${
                        reminder.notificationType === 'notified' 
                          ? 'bg-orange-500/20 text-orange-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}
                      title={`${reminder.title} ${reminder.time}`}
                    >
                      {reminder.title}
                    </div>
                  ))}
                  {dayReminders.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{dayReminders.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
