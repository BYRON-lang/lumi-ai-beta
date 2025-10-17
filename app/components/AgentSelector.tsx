import React from 'react';
import type { AgentInfo } from '../lib/lumiApi';

interface AgentSelectorProps {
  selectedAgent: string;
  availableAgents: AgentInfo[];
  onAgentChange: (agentId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  size?: 'small' | 'large';
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  selectedAgent,
  availableAgents,
  onAgentChange,
  isOpen,
  onToggle,
  size = 'large'
}) => {
  const selectedAgentInfo = availableAgents.find(agent => agent.id === selectedAgent);
  const buttonClasses = size === 'small' 
    ? "h-8 px-2.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-gray-200 text-xs cursor-pointer rounded-lg transition-colors flex items-center justify-center gap-1.5 font-medium"
    : "h-9 px-2.5 bg-[#2f2f2f] hover:bg-[#3a3a3a] text-gray-200 text-xs cursor-pointer rounded-lg transition-colors flex items-center justify-center gap-1.5 font-medium border border-[#3a3a3a]";

  const dropdownClasses = size === 'small'
    ? "absolute right-0 bottom-10 mb-1 w-36 bg-[#1f1f1f] rounded-lg shadow-lg border border-[#3a3a3a] overflow-hidden z-20"
    : "absolute right-0 top-10 mt-1 w-64 bg-[#2a2a2a] rounded-lg shadow-lg border border-[#3a3a3a] overflow-hidden z-20";

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={onToggle}
        className={buttonClasses}
      >
        {selectedAgentInfo?.name || selectedAgent}
        <svg 
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className={dropdownClasses}>
          <div className="p-2">
            {availableAgents.map((agent) => (
              <div 
                key={agent.id}
                onClick={() => {
                  onAgentChange(agent.id);
                  onToggle();
                }}
                className="p-2 rounded cursor-pointer text-gray-200 hover:bg-[#353535]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{agent.name}</span>
                  {selectedAgent === agent.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {size === 'large' && (
                  <div className="text-xs text-gray-300 mt-0.5">{agent.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
