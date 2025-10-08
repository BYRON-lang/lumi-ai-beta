import * as React from "react";
import type { Route } from "./+types/home";
import { Sidebar } from "../components/Sidebar";
import { MessageBubble } from "../components/MessageBubble";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ChatInput } from "../components/ChatInput";
import { WelcomeScreen } from "../components/WelcomeScreen";
import { AgentSwitchNotification } from "../components/AgentSwitchNotification";
import { AuthModal } from "../components/AuthModal";
import { CookieConsent } from "../components/CookieConsent";
import { useState, useEffect, useRef, Suspense } from "react";
import { Link } from "react-router-dom";
import { askLumi, askLumiStream, getAgents, stopGeneration, type AgentInfo } from "../lib/lumiApi";
import { useIsMobile } from "../utils/deviceDetect";
import { useAuth } from "../contexts/AuthContext";
import { chatStorage, type ChatSession } from "../services/chatStorage";
import { detectRequestType } from "../lib/detectionUtils";
import { useAuthModal } from "../hooks/useAuthModal";
import { useCookieConsent } from "../hooks/useCookieConsent";

// Lazy load the mobile component
const MobileHome = React.lazy(() => import("./home.mobile"));

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lumi.Ai - AI Chat Assistant" },
    {
      name: "description",
      content:
        "Lumi is an advanced AI chat assistant that helps you with answers, creative writing, coding, and more. Experience the power of conversational AI.",
    },
    {
      name: "keywords",
      content: "AI, chatbot, conversational AI, chat assistant, Lumi, Lumi.Ai",
    },
  ];
}

// Main desktop component
function DesktopHome() {
  // Chat state
  const [inputSent, setInputSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean; type?: "text" | "code"; timestamp?: string; agentName?: string; agent?: string }>
  >([]);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Chat storage state
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  
  // Streaming state
  const streamingMessageRef = useRef<string>('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Extended thinking state
  const [isExtendedThinking, setIsExtendedThinking] = useState(false);
  
  // Web search state
  const [isWebSearching, setIsWebSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Image generation states removed - will be handled by sidebar image generator
  
  // Extended thinking state for UI
  const [isExtendedThinkingUI, setIsExtendedThinkingUI] = useState(false);
  
  // Error notification state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Agent state
  const [selectedAgent, setSelectedAgent] = useState('lumi-1.0');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [availableAgents, setAvailableAgents] = useState<AgentInfo[]>([]);
  
  
  // Agent switching
  const [showAgentSwitch, setShowAgentSwitch] = useState(false);
  const [agentSwitchInfo, setAgentSwitchInfo] = useState<{from: string, to: string} | null>(null);

  // Auth modal
  const { modalState, showAuthModal, hideAuthModal, handleLogin, handleSignup } = useAuthModal();

  // Cookie consent
  const { 
    hasConsented, 
    acceptAll, 
    declineNonEssential, 
    saveCustomPreferences 
  } = useCookieConsent();

  // Message actions
  const handleRetryMessage = (messageIndex: number) => {
    // Find the user message that corresponds to this AI response
    const userMessageIndex = messageIndex - 1;
    if (userMessageIndex >= 0 && messages[userMessageIndex]?.isUser) {
      const userMessage = messages[userMessageIndex].text;
      
      // Remove the AI response and retry
      setMessages(prev => prev.slice(0, messageIndex));
      setMessage(userMessage);
      
      // Trigger a new submission after state updates
      setTimeout(() => {
        const syntheticEvent = {
          preventDefault: () => {},
          currentTarget: { value: userMessage }
        } as unknown as React.FormEvent;
        handleSubmit(syntheticEvent);
      }, 100);
    }
  };

  const handleCopyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleLikeMessage = (messageIndex: number) => {
    console.log('Liked message:', messageIndex);
    // TODO: Implement like functionality (save to backend)
  };

  const handleDislikeMessage = (messageIndex: number) => {
    console.log('Disliked message:', messageIndex);
    // TODO: Implement dislike functionality (save to backend)
  };

  const handleStopGeneration = () => {
    console.log('Stopping generation...');
    stopGeneration();
    setIsStreaming(false);
    setIsLoading(false);
  };

  const handleExtendedThinking = () => {
    console.log('Extended thinking button clicked, message:', message);
    console.log('Extended thinking triggered');
    setIsExtendedThinking(true);
    // Trigger the same submit logic but with extended thinking mode
    const syntheticEvent = new Event('submit') as any;
    syntheticEvent.preventDefault = () => {};
    handleSubmit(syntheticEvent);
  };

  const handleWebSearch = () => {
    console.log('Web search button clicked, message:', message);
    if (!message.trim()) return;
    
    // Add search prefix to the message
    const searchMessage = `search for ${message.trim()}`;
    console.log('Setting search message:', searchMessage);
    setMessage(searchMessage);
    
    // Trigger the search by submitting
    setTimeout(() => {
      console.log('Triggering web search submit');
      const syntheticEvent = new Event('submit') as any;
      syntheticEvent.preventDefault = () => {};
      handleSubmit(syntheticEvent);
    }, 100);
  };

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const startNewSession = (showWelcome: boolean | React.MouseEvent = true) => {
    const shouldShowWelcome = typeof showWelcome === 'boolean' ? showWelcome : true;
    setMessages([]);
    setInputSent(!shouldShowWelcome);
    setMessage("");
    setShowAgentSwitch(false);
    setAgentSwitchInfo(null);
    setCurrentChatId(null);
  };

  const loadChat = async (chatId: string) => {
    if (isLoadingChat) return;
    
    setIsLoadingChat(true);
    try {
      const chat = await chatStorage.getChat(chatId);
      if (chat) {
        setMessages(chat.messages);
        setCurrentChatId(chatId);
        setInputSent(true);
        setSelectedAgent(chat.model);
        setShowAgentSwitch(false);
        setAgentSwitchInfo(null);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const saveCurrentChat = async () => {
    if (!currentChatId || messages.length === 0) return;
    
    try {
      // Update the chat in storage
      chatStorage.updateChat(currentChatId, {
        messages,
        model: selectedAgent,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  useEffect(() => {
    // Scroll to end when generation is complete or when not streaming
    if (!isStreaming) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isStreaming]);

  // Auto-scroll during streaming to keep generation visible
  useEffect(() => {
    if (isStreaming && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isUser) {
        // Find the current AI message being generated
        const currentAIMessageIndex = messages.length - 1;
        const currentAIMessageElement = document.querySelector(`[data-message-index="${currentAIMessageIndex}"]`);
        
        if (currentAIMessageElement) {
          // Scroll to show the AI response being generated
          currentAIMessageElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end' // Show the end of the message where new content appears
          });
        }
      }
    }
  }, [isStreaming, messages]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  // Save chat when messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      const timeoutId = setTimeout(() => {
        saveCurrentChat();
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [messages, currentChatId, selectedAgent]);


  // Load available agents
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const agents = await getAgents();
        setAvailableAgents(agents);
      } catch (error) {
        console.error('Failed to load agents:', error);
      }
    };
    loadAgents();
  }, []);

  const handleSubmit = async (e: React.FormEvent, isRetry = false) => {
    e.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage || isLoading || isStreaming) return;

    // Reset retry count if not retrying
    if (!isRetry) {
      setRetryCount(0);
    }

    const userMessage = { 
      text: currentMessage, 
      isUser: true, 
      type: "text" as const,
      timestamp: new Date().toISOString()
    };
    // IMMEDIATELY detect request type BEFORE streaming starts
    const detection = detectRequestType(currentMessage);
    console.log('Frontend detection:', detection);
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setIsStreaming(true);
    
    // Set states based on IMMEDIATE detection (image generation removed)
    if (detection.isWebSearchRequest) {
      setIsWebSearching(true);
      setSearchQuery(currentMessage);
      setIsExtendedThinkingUI(false);
    } else {
      setIsWebSearching(false);
      setSearchQuery('');
      setIsExtendedThinkingUI(false);
    }
    
    setInputSent(prev => prev ? prev : true);

    // Scroll to show the new question in the center of the viewport
    setTimeout(() => {
      if (messagesContainerRef.current) {
        const lastMessageIndex = messages.length; // The new message we just added
        const lastMessageElement = document.querySelector(`[data-message-index="${lastMessageIndex - 1}"]`);
        if (lastMessageElement) {
          // Scroll to the new question, positioning it in the center of the viewport
          lastMessageElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
    }, 100);

    // Create new chat if none exists
    if (!currentChatId) {
      const newChat = chatStorage.createNewChat();
      setCurrentChatId(newChat.id);
      chatStorage.updateChat(newChat.id, {
        ...newChat,
        model: selectedAgent
      });
    }

    try {
      const conversationHistory = messages
        .filter(msg => msg.text.trim())
        .reduce<Array<{ user: string; ai: string }>>((acc, msg, idx, arr) => {
          if (msg.isUser && idx + 1 < arr.length && !arr[idx + 1].isUser) {
            acc.push({ user: msg.text, ai: arr[idx + 1].text });
          }
          return acc;
        }, []);


              // Add initial AI message for streaming
              const aiMessage = {
                text: '',
                isUser: false,
                type: "text" as const,
                timestamp: new Date().toISOString(),
                agentName: availableAgents.find(agent => agent.id === selectedAgent)?.name,
                agent: selectedAgent
              };
              setMessages(prev => [...prev, aiMessage]);
              
              // Reset streaming ref
              streamingMessageRef.current = '';
              
              // Add messages to storage
              if (currentChatId) {
                chatStorage.addMessage(currentChatId, userMessage);
                chatStorage.addMessage(currentChatId, aiMessage);
              }

      // Use streaming API
      console.log('Starting streaming request:', {
        message: currentMessage,
        agent: selectedAgent,
        historyLength: conversationHistory.length
      });
      
      const fullResponse = await askLumiStream(
        currentMessage,
        conversationHistory,
        selectedAgent as 'lumi-1.0' | 'lumi-coder',
                (chunk) => {
                  console.log('Received chunk:', chunk);
                  
                  // Handle web search indicator
                  if (chunk.type === 'web_search') {
                    console.log('Received web search chunk:', chunk);
                    console.log('Setting isWebSearching to true');
                    setIsWebSearching(true);
                    setSearchQuery(chunk.searchQuery || '');
                    console.log('Web search state set - should show indicator now');
                    return;
                  }
                  
                  // Handle extended thinking indicator
                  if (chunk.type === 'extended_thinking') {
                    console.log('Received extended thinking chunk:', chunk);
                    console.log('Setting isExtendedThinkingUI to true');
                    setIsExtendedThinkingUI(true);
                    return;
                  }
                  
                  // Image generation chunk handler removed - will be handled by sidebar
                  
                  // Update streaming message in real-time using ref to prevent duplicates
                  if (chunk.content) {
                    streamingMessageRef.current += chunk.content;
                    setMessages(prev => {
                      const newMessages = [...prev];
                      const lastMessage = newMessages[newMessages.length - 1];
                      if (!lastMessage.isUser) {
                        lastMessage.text = streamingMessageRef.current;
                      }
                      return newMessages;
                    });
                    
                    // Auto-scroll to keep the generation visible
                    setTimeout(() => {
                      if (messagesContainerRef.current) {
                        // Find the current AI message being generated (last message)
                        const currentAIMessageIndex = messages.length - 1;
                        const currentAIMessageElement = document.querySelector(`[data-message-index="${currentAIMessageIndex}"]`);
                        
                        if (currentAIMessageElement) {
                          // Scroll to show the AI response being generated
                          currentAIMessageElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'end' // Show the end of the message where new content appears
                          });
                        } else {
                          // Fallback: scroll to the end of the messages container
                          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }, 10); // Faster response for better visibility
                  }
                },
                (fullResponse, responseChatId) => {
                  console.log('Streaming completed:', fullResponse);
                  console.log('Response chatId:', responseChatId);
                  
                  // Reset streaming states when actually done
                  console.log('Streaming completed, resetting states');
                  
                  // Final scroll to show the complete response
                  setTimeout(() => {
                    if (messagesContainerRef.current) {
                      // Find the completed AI message (last message)
                      const completedAIMessageIndex = messages.length - 1;
                      const completedAIMessageElement = document.querySelector(`[data-message-index="${completedAIMessageIndex}"]`);
                      
                      if (completedAIMessageElement) {
                        // Scroll to show the complete AI response
                        completedAIMessageElement.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'end' // Show the complete response
                        });
                      }
                    }
                  }, 100);
                  
                  // Update currentChatId with the real chat ID from the server
                  if (responseChatId && responseChatId !== currentChatId) {
                    setCurrentChatId(responseChatId);
                    console.log('Updated currentChatId to:', responseChatId);
                  }
                  
                  // Update storage with final response
                  const finalChatId = responseChatId || currentChatId;
                  if (finalChatId) {
                    chatStorage.updateLastMessage(finalChatId, fullResponse);
                  }
                },
        (error) => {
          // Handle streaming error
          console.error('Streaming error:', error);
          
          // Check if it's a rate limit error
          if (error.includes('Rate limit exceeded') || error.includes('Please sign up or log in')) {
            // Extract remaining messages and reset time from error message
            const remainingMatch = error.match(/You've used all (\d+) guest messages/);
            const resetTimeMatch = error.match(/Reset at (.+)/);
            
            const remainingMessages = remainingMatch ? parseInt(remainingMatch[1]) : 0;
            const resetTime = resetTimeMatch ? resetTimeMatch[1] : undefined;
            
            // Show auth modal
            showAuthModal(remainingMessages, resetTime);
            
            // Don't show error message, modal handles it
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (!lastMessage.isUser) {
                lastMessage.text = "Rate limit reached. Please sign up or log in to continue.";
              }
              return newMessages;
            });
          } else {
            // Regular error handling
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (!lastMessage.isUser) {
                lastMessage.text = "Sorry, I'm having trouble connecting. Please try again.";
              }
              return newMessages;
            });
            setErrorMessage(error);
          }
        },
        currentChatId || undefined,
        isExtendedThinking
      );
      
      console.log('Full response received:', fullResponse);

    } catch (error) {
      console.error("Error getting response from Lumi:", error);
      
      // Check if it's a rate limit error
      const errorMessage = error instanceof Error ? error.message : String(error);
      let userMessage = "Connection error. Please try again.";
      let notificationMessage = "Connection error. Please try again.";
      
      if (errorMessage.includes("Daily message limit exceeded")) {
        // Extract the remaining seconds from the error message
        const match = errorMessage.match(/Try again in (\d+) seconds/);
        const remainingSeconds = match ? parseInt(match[1]) : 0;
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        
        userMessage = `You've reached your daily message limit. Please try again in ${hours}h ${minutes}m.`;
        notificationMessage = `Daily limit reached. Try again in ${hours}h ${minutes}m.`;
      }
      
      // Show error notification
      setErrorMessage(notificationMessage);
      
      // Clear error after 8 seconds for rate limit errors
      setTimeout(() => {
        setErrorMessage(null);
      }, 8000);
      
      // Update the AI message with error
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (!lastMessage.isUser) {
          lastMessage.text = userMessage;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setIsRetrying(false);
      setIsExtendedThinking(false);
      // Don't reset web search and extended thinking states here - they'll be reset when streaming actually ends
    }
  };


  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-[#262624] relative">
      {/* Error Notification */}
      {errorMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          errorMessage.includes("Daily limit") 
            ? "bg-orange-500 text-white" 
            : "bg-red-500 text-white"
        }`}>
          {errorMessage.includes("Daily limit") ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <span className="font-medium">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-2 text-white hover:text-gray-200 transition-colors"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
                <Sidebar 
                  onNewSession={startNewSession} 
                  onLoadChat={loadChat}
                  currentChatId={currentChatId}
                />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Try Lumi button in top right corner - only show when user is not logged in */}
        {!user && (
          <div className="absolute top-4 right-6 z-10">
            <Link 
              to="/signup" 
              className="px-5 h-10 bg-white hover:bg-gray-100 text-black font-medium rounded-3xl transition-colors flex items-center justify-center shadow-md hover:shadow-lg border border-gray-200"
            >
              <span className="text-sm font-medium">Try Lumi</span>
            </Link>
          </div>
        )}
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#3a3a3a] bg-[#262624]">
          <button
            onClick={startNewSession}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#2f2f2f] transition"
          >
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
              className="text-blue-400"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <div className="flex space-x-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#2f2f2f] transition">
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
                className="text-gray-400"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#2f2f2f] transition">
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
                className="text-gray-400"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a7 7 0 0 0 0-6" />
                <path d="M4.6 9a7 7 0 0 0 0 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Welcome Screen */}
        {!inputSent && (
          <WelcomeScreen
            message={message}
            setMessage={setMessage}
            onSubmit={handleSubmit}
            onExtendedThinking={handleExtendedThinking}
            onWebSearch={handleWebSearch}
            isLoading={isLoading}
            isStreaming={isStreaming}
            isExtendedThinking={isExtendedThinking}
            selectedAgent={selectedAgent}
            availableAgents={availableAgents}
            onAgentChange={setSelectedAgent}
            showModelDropdown={showModelDropdown}
            setShowModelDropdown={setShowModelDropdown}
          />
        )}

        {/* Chat Interface */}
        {inputSent && (
          <div className="flex flex-col h-full bg-[#262624]">
            {/* Messages Container */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                {/* Agent Switch Notification */}
                {showAgentSwitch && agentSwitchInfo && (
                  <AgentSwitchNotification
                    fromAgent={agentSwitchInfo.from}
                    toAgent={agentSwitchInfo.to}
                    reason="for better educational support"
                  />
                )}
                
                {/* Messages */}
                {messages.map((msg, index) => (
                  <div key={index} data-message-index={index}>
                  <MessageBubble
                    text={msg.text}
                    isUser={msg.isUser}
                    type={msg.type}
                    timestamp={msg.timestamp}
                    agentName={msg.agentName}
                      agent={msg.agent}
                    isStreaming={isStreaming && index === messages.length - 1 && !msg.isUser}
                      isWebSearching={isWebSearching && index === messages.length - 1 && !msg.isUser}
                      isExtendedThinking={isExtendedThinkingUI && index === messages.length - 1 && !msg.isUser}
                      searchQuery={searchQuery}
                    onRetry={!msg.isUser ? () => handleRetryMessage(index) : undefined}
                    onCopy={!msg.isUser ? () => handleCopyMessage(msg.text) : undefined}
                    onLike={!msg.isUser ? () => handleLikeMessage(index) : undefined}
                    onDislike={!msg.isUser ? () => handleDislikeMessage(index) : undefined}
                    user={user}
                  />
                  </div>
                ))}
                
                {/* Loading Indicator - only show when loading but not streaming */}
                {isLoading && !isStreaming && (
                  <LoadingIndicator
                    isStreaming={false}
                    agentName={isRetrying 
                      ? `Retrying... (${retryCount}/2)` 
                      : availableAgents.find(agent => agent.id === selectedAgent)?.name
                    }
                  />
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <ChatInput
              message={message}
              setMessage={setMessage}
              onSubmit={handleSubmit}
              onStop={handleStopGeneration}
              onExtendedThinking={handleExtendedThinking}
              onWebSearch={handleWebSearch}
              isLoading={isLoading}
              isStreaming={isStreaming}
              isExtendedThinking={isExtendedThinking}
              selectedAgent={selectedAgent}
              availableAgents={availableAgents}
              onAgentChange={setSelectedAgent}
              showModelDropdown={showModelDropdown}
              setShowModelDropdown={setShowModelDropdown}
                          placeholder="Reply to lumi..."
            />
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={modalState.isOpen}
        onClose={hideAuthModal}
        onLogin={handleLogin}
        onSignup={handleSignup}
        remainingMessages={modalState.remainingMessages}
        resetTime={modalState.resetTime || undefined}
      />

      {/* Cookie Consent */}
      {!hasConsented && (
        <CookieConsent
          onAccept={acceptAll}
          onDecline={declineNonEssential}
          onCustomize={saveCustomPreferences}
        />
      )}
    </div>
  );
}

export default function Home() {
  const isMobile = useIsMobile();
  
  // Show loading while checking device type
  if (typeof window === 'undefined') {
    return null; // or a loading spinner
  }

  // Check for OAuth callback parameters and redirect to callback route
  React.useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    const authSuccess = url.searchParams.get('auth');
    
    if (token || authSuccess) {
      console.log('Home: OAuth parameters detected, redirecting to callback route');
      // Redirect to the callback route with the same parameters
      const callbackUrl = new URL('/auth/callback', window.location.origin);
      if (token) callbackUrl.searchParams.set('token', token);
      if (authSuccess) callbackUrl.searchParams.set('auth', authSuccess);
      
      window.location.replace(callbackUrl.toString());
    }
  }, []);

  if (isMobile) {
    return (
      <Suspense fallback={<div>Loading mobile version...</div>}>
        <MobileHome />
      </Suspense>
    );
  }

  return <DesktopHome />;
}