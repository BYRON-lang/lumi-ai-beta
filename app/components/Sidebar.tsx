interface SidebarProps {
  onNewSession?: () => void;
}

export function Sidebar({ onNewSession }: SidebarProps) {
  return (
    <div className="w-16 bg-[#171717] border-r border-[#2f2f2f] min-h-screen flex flex-col items-center py-3">
      {/* Logo */}
      <div className="mb-4 cursor-pointer">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-6 h-6 object-contain brightness-0 invert"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <button 
        className="w-10 h-10 bg-[#2f2f2f] hover:bg-[#3a3a3a] rounded-lg mb-2 cursor-pointer transition-colors flex items-center justify-center"
        onClick={onNewSession}
        title="New chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="text-gray-300"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 5v14m-7-7h14"
          />
        </svg>
      </button>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Profile Icon at bottom */}
      <button className="w-10 h-10 bg-[#2f2f2f] hover:bg-[#3a3a3a] rounded-lg cursor-pointer transition-colors flex items-center justify-center mb-2" title="Profile">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </div>
  );
}