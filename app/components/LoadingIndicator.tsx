import React from 'react';

interface LoadingIndicatorProps {
  isStreaming: boolean;
  agentName?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isStreaming,
  agentName
}) => {
  return (
    <div className="border-b border-[#2f2f2f]">
      <div className="px-6 py-8 max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Lumi"
              className={`w-4 h-4 brightness-0 invert ${isStreaming ? 'animate-pulse' : 'animate-spin'}`}
            />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
            {isStreaming && agentName && (
              <div className="text-sm text-gray-400 mt-2">
                {agentName} is thinking...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
