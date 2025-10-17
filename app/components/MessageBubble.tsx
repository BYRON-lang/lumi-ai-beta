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
  onEdit?: (newText: string) => void;
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
  onEdit,
  user
}) => {
  const [streamingText, setStreamingText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const previousTextRef = useRef('');
  
  // Use streaming code detection for real-time code parsing
  const { codeState, processChunk, reset, getCodeBlock } = useStreamingCodeDetection();

  // Update editText when text prop changes
  useEffect(() => {
    setEditText(text);
  }, [text]);

  // Edit handlers
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onEdit && editText.trim() !== text) {
      onEdit(editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

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
      <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        {!isUser && (
          // No avatar for agent messages - just show the agent name
          <div className="flex-shrink-0 w-7 h-7"></div>
        )}
        
        {/* Message content */}
        <div className={`${isUser ? 'w-auto' : 'flex-1'} min-w-0 pt-1`}>
          {!isUser && agentName && (
            <div className="text-sm text-gray-400 mb-0 font-medium">
              {agentName}
            </div>
          )}
          
          {isUser ? (
            <div className="flex items-center gap-2">
              {/* Edit and Copy buttons for user messages */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleEdit}
                  className="p-1.5 rounded-md text-gray-400"
                  title="Edit message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                  </svg>
                </button>
                <button
                  onClick={onCopy}
                  className="p-1.5 rounded-md text-gray-400"
                  title="Copy message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </button>
              </div>
              <div className="bg-[#141414] rounded-2xl p-2 w-auto">
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="bg-transparent text-[#e8e8e8] leading-relaxed text-lg break-words resize-none outline-none min-h-[40px] max-h-[200px]"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
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
            </>
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
