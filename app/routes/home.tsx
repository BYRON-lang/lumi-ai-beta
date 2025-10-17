import * as React from "react";
import type { Route } from "./+types/home";
import { Sidebar } from "../components/Sidebar";
import { MessageBubble } from "../components/MessageBubble";
import { VirtualizedMessageItem } from "../components/VirtualizedMessageItem";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ChatInput } from "../components/ChatInput";
import { WelcomeScreen } from "../components/WelcomeScreen";
import { AgentSwitchNotification } from "../components/AgentSwitchNotification";
import { AuthModal } from "../components/AuthModal";
import { CookieConsent } from "../components/CookieConsent";
import { List } from 'react-window';
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
  // Auth state
  const { user, loading: authLoading } = useAuth();
  
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
  
  // Auto-scroll control
  const shouldAutoScrollRef = useRef(true);
  
  // Extended thinking state
  const [isExtendedThinking, setIsExtendedThinking] = useState(false);
  
  // Web search state
  const [isWebSearching, setIsWebSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  
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

  // Additional refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<any>(null);
  
  // Virtualization state
  const [containerHeight, setContainerHeight] = useState(600);
  const [messageHeight, setMessageHeight] = useState(120); // Estimated height per message

  // All useEffect hooks must be declared before any conditional returns
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('DesktopHome: User not authenticated, redirecting to login');
      window.location.href = '/';
    }
  }, [user, authLoading]);

  // Simplified scroll event handling for regular div
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // If user scrolls up by more than 50px from the bottom, disable auto-scroll
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 50; 
      shouldAutoScrollRef.current = isAtBottom;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []); // Dependency array is empty, runs once on mount

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

  // Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setIsLoadingChat(true);
        const chats = await chatStorage.getChats();
        if (chats.length > 0) {
          const latestChat = chats[0];
          const chatSession = await chatStorage.getChat(latestChat.id);
          if (chatSession) {
            setCurrentChatId(chatSession.id);
            setMessages(chatSession.messages);
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setIsLoadingChat(false);
      }
    };
    loadChatHistory();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScrollRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle streaming message updates
  useEffect(() => {
    if (isStreaming && streamingMessageRef.current) {
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages.length > 0 && !newMessages[newMessages.length - 1].isUser) {
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            text: streamingMessageRef.current
          };
        }
        return newMessages;
      });
    }
  }, [isStreaming, streamingMessageRef.current]);

  // Handle agent switching
  useEffect(() => {
    if (agentSwitchInfo) {
      setShowAgentSwitch(true);
      const timer = setTimeout(() => {
        setShowAgentSwitch(false);
        setAgentSwitchInfo(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [agentSwitchInfo]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#171717',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #333',
            borderTop: '2px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }


  // Simplified scroll function for regular div
  const scrollToBottom = (behavior: "smooth" | "instant" = "instant") => {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
        behavior: behavior
      });
    }
  };

  // Message actions
  const handleRetryMessage = (messageIndex: number) => {
    const userMessageIndex = messageIndex - 1;
    if (userMessageIndex >= 0 && messages[userMessageIndex]?.isUser) {
      const userMessage = messages[userMessageIndex].text;
      setMessages(prev => prev.slice(0, messageIndex));
      setMessage(userMessage);
      
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
  };

  const handleDislikeMessage = (messageIndex: number) => {
    console.log('Disliked message:', messageIndex);
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
    const syntheticEvent = new Event('submit') as any;
    syntheticEvent.preventDefault = () => {};
    handleSubmit(syntheticEvent);
  };

  const handleWebSearch = () => {
    console.log('Web search button clicked, message:', message);
    if (!message.trim()) return;
    
    const searchMessage = `search for ${message.trim()}`;
    console.log('Setting search message:', searchMessage);
    setMessage(searchMessage);
    
    setTimeout(() => {
      console.log('Triggering web search submit');
      const syntheticEvent = new Event('submit') as any;
      syntheticEvent.preventDefault = () => {};
      handleSubmit(syntheticEvent);
    }, 100);
  };

  const startNewSession = (showWelcome: boolean | React.MouseEvent = true) => {
    const shouldShowWelcome = typeof showWelcome === 'boolean' ? showWelcome : true;
    setMessages([]);
    setInputSent(!shouldShowWelcome);
    setMessage("");
    setShowAgentSwitch(false);
    setAgentSwitchInfo(null);
    setCurrentChatId(null);
    shouldAutoScrollRef.current = true;
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
        shouldAutoScrollRef.current = true;
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
      chatStorage.updateChat(currentChatId, {
        messages,
        model: selectedAgent,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };


  const handleSubmit = async (e: React.FormEvent, isRetry = false) => {
    e.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage || isLoading || isStreaming) return;

    if (!isRetry) {
      setRetryCount(0);
    }

    // Define the new user message
    const userMessage = { 
      text: currentMessage, 
      isUser: true, 
      type: "text" as const,
      timestamp: new Date().toISOString()
    };
    
    // Define the new AI message placeholder
    const aiMessage = {
      text: '',
      isUser: false,
      type: "text" as const,
      timestamp: new Date().toISOString(),
      agentName: availableAgents.find(agent => agent.id === selectedAgent)?.name,
      agent: selectedAgent
    };

    // **CRITICAL UPDATE**: Use functional state update to add BOTH messages *atomically*
    setMessages(prev => [...prev, userMessage, aiMessage]);
    setMessage("");
    setIsLoading(true);
    setIsStreaming(true);
    
    // Immediately set the auto-scroll flag on submission
    shouldAutoScrollRef.current = true;
    
    const detection = detectRequestType(currentMessage);
    console.log('Frontend detection:', detection);
    
    setIsWebSearching(detection.isWebSearchRequest);
    setIsExtendedThinking(false); // Reset extended thinking before a new submission
    
    setInputSent(prev => prev ? prev : true);

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
          // Note: messages state here still holds the previous state before the setMessages call above
          if (msg.isUser && idx + 1 < arr.length && !arr[idx + 1].isUser) {
            acc.push({ user: msg.text, ai: arr[idx + 1].text });
          }
          return acc;
        }, []);

      // **Local storage update should happen AFTER the full messages array is updated (in the useEffect), 
      // but we need to add the user/AI messages to local storage *before* they are updated by streaming
              if (currentChatId) {
                chatStorage.addMessage(currentChatId, userMessage);
                chatStorage.addMessage(currentChatId, aiMessage);
              }

      console.log('Starting streaming request:', {
        message: currentMessage,
        agent: selectedAgent,
        // conversationHistory will now be correct for the API call
        historyLength: conversationHistory.length
      });
      streamingMessageRef.current = '';
      
      const fullResponse = await askLumiStream(
        currentMessage,
        conversationHistory,
        selectedAgent as 'lumi-personal',
                (chunk) => {
                  console.log('Received chunk:', chunk);
                  
                  if (chunk.type === 'web_search') {
                    console.log('Received web search chunk:', chunk);
                    setIsWebSearching(true);
                    setSearchQuery(chunk.searchQuery || '');
                    return;
                  }
                  
                  if (chunk.type === 'extended_thinking') {
                    console.log('Received extended thinking chunk:', chunk);
                    setIsExtendedThinking(true);
                    return;
                  }
                  
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
                    // The useEffect handles the scroll now!
                  }
                },
                (fullResponse, responseChatId) => {
                  console.log('Streaming completed:', fullResponse);
                  console.log('Response chatId:', responseChatId);
                  
          // Final scroll after completion - instant
          scrollToBottom("instant");
          shouldAutoScrollRef.current = true;
          
                  // Only update chat ID if we don't have one yet (first message)
                  if (responseChatId && !currentChatId) {
                    setCurrentChatId(responseChatId);
                    console.log('Set initial currentChatId to:', responseChatId);
                  } else if (responseChatId && responseChatId !== currentChatId) {
                    console.log('Server returned different chat ID, but keeping current one for continuity');
                  }
                  
                  // Always use currentChatId for continuity, fallback to responseChatId only if no currentChatId
                  const finalChatId = currentChatId || responseChatId;
                  if (finalChatId) {
                    chatStorage.updateLastMessage(finalChatId, fullResponse);
                  }
                },
        (error) => {
          console.error('Streaming error:', error);
          
          if (error.includes('Rate limit exceeded') || error.includes('Please sign up or log in')) {
            const remainingMatch = error.match(/You've used all (\d+) guest messages/);
            const resetTimeMatch = error.match(/Reset at (.+)/);
            
            const remainingMessages = remainingMatch ? parseInt(remainingMatch[1]) : 0;
            const resetTime = resetTimeMatch ? resetTimeMatch[1] : undefined;
            
            showAuthModal(remainingMessages, resetTime);
            
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (!lastMessage.isUser) {
                lastMessage.text = "Rate limit reached. Please sign up or log in to continue.";
              }
              return newMessages;
            });
          } else {
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
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      let userMessage = "Connection error. Please try again.";
      let notificationMessage = "Connection error. Please try again.";
      
      if (errorMessage.includes("Daily message limit exceeded")) {
        const match = errorMessage.match(/Try again in (\d+) seconds/);
        const remainingSeconds = match ? parseInt(match[1]) : 0;
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        
        userMessage = `You've reached your daily message limit. Please try again in ${hours}h ${minutes}m.`;
        notificationMessage = `Daily limit reached. Try again in ${hours}h ${minutes}m.`;
      }
      
      setErrorMessage(notificationMessage);
      
      setTimeout(() => {
        setErrorMessage(null);
      }, 8000);
      
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
      setIsExtendedThinking(false); // Unified state reset
      setIsWebSearching(false); // Also ensure web search UI is reset
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#191919] relative">
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
      
      <div className="hidden md:flex">
                <Sidebar 
                  onNewSession={startNewSession}
                />
      </div>

      <div className="flex-1 flex flex-col h-full relative">
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

        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#3a3a3a] bg-[#191919]">
          <button
            onClick={startNewSession}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#353535] transition"
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
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#353535] transition">
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
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#353535] transition">
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

        {inputSent && (
          <div className="flex flex-col h-full bg-[#191919]">
            <div 
              ref={messagesContainerRef} 
              className="flex-1 overflow-y-auto"
              style={{ height: containerHeight }}
            >
              <div className="max-w-4xl mx-auto h-full">
                {showAgentSwitch && agentSwitchInfo && (
                  <AgentSwitchNotification
                    fromAgent={agentSwitchInfo.from}
                    toAgent={agentSwitchInfo.to}
                    reason="for better educational support"
                  />
                )}
                
                {messages.length > 0 ? (
                  <div>
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
                          isExtendedThinking={isExtendedThinking && index === messages.length - 1 && !msg.isUser}
                          searchQuery={searchQuery}
                          onRetry={!msg.isUser ? () => handleRetryMessage(index) : undefined}
                          onCopy={!msg.isUser ? () => handleCopyMessage(msg.text) : undefined}
                          onLike={!msg.isUser ? () => handleLikeMessage(index) : undefined}
                          onDislike={!msg.isUser ? () => handleDislikeMessage(index) : undefined}
                          user={user}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400 text-center">
                      <p className="text-lg mb-2">Welcome to Lumi!</p>
                      <p className="text-sm">Start a conversation to see messages here.</p>
                    </div>
                  </div>
                )}
                
                {isLoading && !isStreaming && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <LoadingIndicator
                    isStreaming={false}
                    agentName={isRetrying 
                      ? `Retrying... (${retryCount}/2)` 
                      : availableAgents.find(agent => agent.id === selectedAgent)?.name
                    }
                  />
                  </div>
                )}
              </div>
            </div>

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

      <AuthModal
        isOpen={modalState.isOpen}
        onClose={hideAuthModal}
        onLogin={handleLogin}
        onSignup={handleSignup}
        remainingMessages={modalState.remainingMessages}
        resetTime={modalState.resetTime || undefined}
      />

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
  
  if (typeof window === 'undefined') {
    return null;
  }

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    const authSuccess = url.searchParams.get('auth');
    
    if (token || authSuccess) {
      console.log('Home: OAuth parameters detected, redirecting to callback route');
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