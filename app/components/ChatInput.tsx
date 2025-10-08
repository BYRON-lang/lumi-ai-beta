import React, { useRef, useEffect } from 'react';
import { AgentSelector } from './AgentSelector';
import type { AgentInfo } from '../lib/lumiApi';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStop?: () => void;
  onExtendedThinking?: () => void;
  onWebSearch?: () => void;
  isLoading: boolean;
  isStreaming: boolean;
  isExtendedThinking?: boolean;
  selectedAgent: string;
  availableAgents: AgentInfo[];
  onAgentChange: (agentId: string) => void;
  showModelDropdown: boolean;
  setShowModelDropdown: (show: boolean) => void;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  onSubmit,
  onStop,
  onExtendedThinking,
  onWebSearch,
  isLoading,
  isStreaming,
  isExtendedThinking = false,
  selectedAgent,
  availableAgents,
  onAgentChange,
  showModelDropdown,
  setShowModelDropdown,
  placeholder = "Reply to lumi..."
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, window.innerHeight * 0.5)}px`;
  };

  // Reset textarea height when message is cleared
  useEffect(() => {
    if (inputRef.current && message === '') {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = '60px'; // Reset to minimum height
    }
  }, [message]);

  return (
    <div className="bg-[#262624] pb-6">
      <div className="max-w-4xl mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#353535] border border-[#3a3a3a] rounded-xl w-full relative shadow-sm">
            <form onSubmit={onSubmit} className="relative">
              <div className="relative z-0 pb-12">
                <textarea
                  ref={inputRef}
                  placeholder={placeholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  disabled={isLoading || isStreaming}
                  rows={1}
                  className="w-full bg-transparent mt-2 border-none rounded-xl pl-3 pr-14 py-3 pb-5 text-white placeholder-white/50 focus:outline-none disabled:opacity-50 text-lg resize-none min-h-[60px] max-h-[50vh] overflow-y-auto relative z-0"
                  style={{ 
                    lineHeight: '1.5',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4b5563 transparent',
                  }}
                />
                
                {/* Action buttons */}
                <div className="absolute bottom-3 left-2 flex items-start space-x-2 z-70">
                  <div className="relative group">
                    <button 
                      type="button" 
                      className="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-600 hover:border-gray-500 hover:bg-[#3f3f3f] transition duration-200"
                      aria-label="Add files"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21" className="text-gray-400">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.5 10.5h10m-5-5v10"/>
                      </svg>
                    </button>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Add files
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <button 
                      type="button" 
                      className="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-600 hover:border-gray-500 hover:bg-[#3f3f3f] transition duration-200"
                      aria-label="Private chat"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="text-gray-400">
                        <path fill="currentColor" fillRule="evenodd" d="m4.736 1.968l-.892 3.269l-.014.058C2.113 5.568 1 6.006 1 6.5C1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205a1.032 1.032 0 0 0-.014-.058l-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5c-.62 0-1.411-.136-2.025-.267c-.541-.115-1.093.2-1.239.735Zm.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a29.58 29.58 0 0 0 2.975-.143a.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274ZM3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5Zm-1.5.5c0-.175.03-.344.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312a3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085c.055.156.085.325.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0v-1Zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5Z"/>
                      </svg>
                    </button>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Private chat
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <button 
                      type="button" 
                    onClick={onWebSearch}
                    disabled={isLoading || isStreaming || !message.trim()}
                    className="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-600 hover:border-gray-500 hover:bg-[#3f3f3f] transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Search the web"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14" className="text-gray-400">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13M.5 7h13"/>
                          <path d="M9.5 7A11.22 11.22 0 0 1 7 13.5A11.22 11.22 0 0 1 4.5 7A11.22 11.22 0 0 1 7 .5A11.22 11.22 0 0 1 9.5 7"/>
                        </g>
                      </svg>
                    </button>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Search the web
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <button 
                      type="button" 
                      onClick={onExtendedThinking}
                      disabled={isLoading || isStreaming || !message.trim()}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                        isExtendedThinking 
                          ? 'border-orange-500 bg-orange-500/20 text-orange-400 shadow-lg shadow-orange-500/20 animate-pulse' 
                          : 'border-gray-600 hover:border-gray-500 hover:bg-[#3f3f3f] text-gray-400'
                      }`}
                      aria-label="Extended thinking"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" className="w-4 h-4">
                        <path fill="currentColor" d="M248 124a56.11 56.11 0 0 0-32-50.61V72a48 48 0 0 0-88-26.49A48 48 0 0 0 40 72v1.39a56 56 0 0 0 0 101.2V176a48 48 0 0 0 88 26.49A48 48 0 0 0 216 176v-1.41A56.09 56.09 0 0 0 248 124ZM88 208a32 32 0 0 1-31.81-28.56A55.87 55.87 0 0 0 64 180h8a8 8 0 0 0 0-16h-8a40 40 0 0 1-13.33-77.73A8 8 0 0 0 56 78.73V72a32 32 0 0 1 64 0v68.26A47.8 47.8 0 0 0 88 128a8 8 0 0 0 0 16a32 32 0 0 1 0 64Zm104-44h-8a8 8 0 0 0 0 16h8a55.87 55.87 0 0 0 7.81-.56A32 32 0 1 1 168 144a8 8 0 0 0 0-16a47.8 47.8 0 0 0-32 12.26V72a32 32 0 0 1 64 0v6.73a8 8 0 0 0 5.33 7.54A40 40 0 0 1 192 164Zm16-52a8 8 0 0 1-8 8h-4a36 36 0 0 1-36-36v-4a8 8 0 0 1 16 0v4a20 20 0 0 0 20 20h4a8 8 0 0 1 8 8Zm-148 8h-4a8 8 0 0 1 0-16h4a20 20 0 0 0 20-20v-4a8 8 0 0 1 16 0v4a36 36 0 0 1-36 36Z"/>
                      </svg>
                    </button>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {isExtendedThinking ? 'Extended thinking active' : 'Extended thinking'}
                    </span>
                  </div>
                </div>
                
                {/* Submit area */}
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <AgentSelector
                    selectedAgent={selectedAgent}
                    availableAgents={availableAgents}
                    onAgentChange={onAgentChange}
                    isOpen={showModelDropdown}
                    onToggle={() => setShowModelDropdown(!showModelDropdown)}
                    size="small"
                  />
                  
                  {/* Stop button - only show when streaming */}
                  {isStreaming && onStop ? (
                    <button
                      type="button"
                      onClick={onStop}
                      className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center transition duration-200"
                      title="Stop generation"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        className="text-white"
                      >
                        <path
                          fill="currentColor"
                          d="M6 6h12v12H6z"
                        />
                      </svg>
                    </button>
                  ) : (
                  <button
                    type="submit"
                    disabled={isLoading || isStreaming || !message.trim()}
                    className="w-8 h-8 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-lg flex items-center justify-center transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      className="text-gray-400"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 20V4m-7 7l7-7l7 7"
                      />
                    </svg>
                  </button>
                  )}
                </div>
              </div>
            </form>
            
        <div className="flex items-center justify-center mt-4 text-sm text-gray-500 gap-2">
          <span>Lumi can make mistakes. Please double-check responses.</span>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};
