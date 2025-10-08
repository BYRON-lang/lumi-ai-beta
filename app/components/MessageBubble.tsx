import React, { useState, useEffect, useRef } from 'react';
import { MessageActions } from './MessageActions';
import { MarkdownRenderer } from './MarkdownRenderer';
import { CodeBlock } from './CodeBlock';
import { processMessage, getFirstCodeBlock } from '../lib/codeDetection';
import { useStreamingCodeDetection } from '../lib/streamingCodeDetection';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  type?: 'text' | 'code';
  timestamp?: string;
  agentName?: string;
  agent?: string; // Add agent prop for enhanced detection
  isStreaming?: boolean;
  isWebSearching?: boolean;
  isExtendedThinking?: boolean;
  searchQuery?: string;
  // Image generation props removed - will be handled by sidebar
  onRetry?: () => void;
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  isUser,
  type = 'text',
  timestamp,
  agentName,
  agent = 'lumi-1.0',
  isStreaming = false,
  isWebSearching = false,
  isExtendedThinking = false,
  searchQuery = '',
  onRetry,
  onCopy,
  onLike,
  onDislike,
  user
}) => {
  const [streamingText, setStreamingText] = useState('');
  const previousTextRef = useRef('');
  
  // Use streaming code detection for real-time code parsing
  const { codeState, processChunk, reset, getCodeBlock } = useStreamingCodeDetection();

  // Debug logging
  useEffect(() => {
    console.log('MessageBubble state update:', { 
      isStreaming, 
      isWebSearching, 
      isExtendedThinking, 
      textLength: text.length,
      textPreview: text.substring(0, 50),
      shouldShowIndicator: isStreaming && (isWebSearching || isExtendedThinking || text === '')
    });
  }, [isStreaming, isWebSearching, isExtendedThinking, text]);
  
  // Process streaming text in real-time
  useEffect(() => {
    if (isStreaming && text !== previousTextRef.current) {
      const newChunk = text.slice(previousTextRef.current.length);
      processChunk(newChunk);
      setStreamingText(text);
      previousTextRef.current = text;
    } else if (!isStreaming) {
      reset();
      setStreamingText('');
      previousTextRef.current = '';
    }
  }, [text, isStreaming, processChunk, reset]);
  
  // Process the message to detect code blocks
  const processedMessage = isStreaming 
    ? { text: streamingText, type: codeState.isInCodeBlock ? 'code' as const : 'text' as const }
    : processMessage(text);
  
  const firstCodeBlock = isStreaming 
    ? getCodeBlock()
    : getFirstCodeBlock(text);
  
  return (
    <div className={`px-6 py-4 max-w-[860px] mx-auto group ${isUser ? '' : 'border-b border-[#262624]'}`}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {isUser ? (
          <div className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-blue-600">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-7 h-7 rounded-md object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
        ) : (
          // No avatar for agent messages - just show the agent name
          <div className="flex-shrink-0 w-7 h-7"></div>
        )}
        
        {/* Message content */}
        <div className="flex-1 min-w-0 pt-0.5">
          {!isUser && agentName && (
            <div className="text-sm text-gray-400 mb-1 font-medium">
              {agentName}
            </div>
          )}
          
          {processedMessage.type === "code" ? (
            <div className="relative">
              <CodeBlock
                code={codeState.isInCodeBlock ? codeState.code : processedMessage.text}
                language={firstCodeBlock?.language || codeState.language || "typescript"}
                title="Code"
                showAllLines={isStreaming && codeState.isInCodeBlock}
              />
              {isStreaming && codeState.isInCodeBlock && !codeState.isComplete && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-1.5 h-1.5 bg-orange-500 rounded-full" 
                      style={{ animation: 'codeGeneration 1.4s ease-in-out infinite' }}
                    ></div>
                    <div 
                      className="w-1.5 h-1.5 bg-orange-500 rounded-full" 
                      style={{ animation: 'codeGeneration 1.4s ease-in-out infinite 0.2s' }}
                    ></div>
                    <div 
                      className="w-1.5 h-1.5 bg-orange-500 rounded-full" 
                      style={{ animation: 'codeGeneration 1.4s ease-in-out infinite 0.4s' }}
                    ></div>
                  </div>
                  <span className="font-medium">Code generation in progress...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <MarkdownRenderer 
                content={processedMessage.text} 
                className="text-[#e8e8e8] leading-relaxed text-lg break-words"
              />
              {isStreaming && (
                isWebSearching || 
                isExtendedThinking || 
                text === ''
              ) && (
                <div className="flex items-center gap-3 text-gray-400 text-sm mt-3">
                  {isWebSearching ? (
                    <>
                      <div className="w-6 h-6 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-400"
                          style={{
                            animation: 'webSearch 1.5s ease-in-out infinite'
                          }}
                        >
                          <circle cx="11" cy="11" r="8"/>
                          <path d="m21 21-4.35-4.35"/>
                          <path d="M8 11h6"/>
                          <path d="M11 8v6"/>
                        </svg>
                      </div>
                      <span className="font-medium">
                        🔍 Searching the web for "{searchQuery}"...
                      </span>
                    </>
                  ) : isExtendedThinking ? (
                    <>
                      <div className="w-6 h-6 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-purple-400"
                          style={{
                            animation: 'extendedThinking 2s ease-in-out infinite'
                          }}
                        >
                          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1 .34-4.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0-.34-4.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
                        </svg>
                      </div>
                      <span className="font-medium">
                        🧠 Extended thinking mode - analyzing thoroughly...
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 flex items-center justify-center">
                        <img
                          src="/logo.png"
                          alt="Lumi"
                          className="w-6 h-6"
                          style={{
                            filter: 'invert(50%) sepia(100%) saturate(1000%) hue-rotate(0deg) brightness(100%) contrast(105%)',
                            animation: 'thinking 1.5s ease-in-out infinite'
                          }}
                        />
                  </div>
                  <span className="font-medium">{agentName} is thinking...</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Message Actions */}
          <MessageActions
            onRetry={onRetry}
            onCopy={onCopy}
            onLike={onLike}
            onDislike={onDislike}
            isUser={isUser}
            isStreaming={isStreaming}
          />
        </div>
      </div>

    </div>
  );
};
