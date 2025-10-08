import React from 'react';

interface AgentSwitchNotificationProps {
  fromAgent: string;
  toAgent: string;
  reason?: string;
}

export const AgentSwitchNotification: React.FC<AgentSwitchNotificationProps> = ({
  fromAgent,
  toAgent,
  reason = "for better support"
}) => {
  return (
    <div className="mx-auto max-w-3xl px-6 py-4">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white animate-spin"
          >
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-blue-400 font-medium text-sm">
            Switched from {fromAgent} to {toAgent}
          </div>
          <div className="text-blue-300 text-xs mt-1">
            {reason}
          </div>
        </div>
      </div>
    </div>
  );
};
