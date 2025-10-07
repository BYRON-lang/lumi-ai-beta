import * as React from "react";
import type { Route } from "./+types/home";
import { Sidebar } from "../components/Sidebar";
import { CodeEditor } from "../components/CodeEditor";
import { useState, useEffect, useRef, Suspense } from "react";
import { Link } from "react-router-dom";
import { askLumi } from "../lib/lumiApi";
import { checkRateLimit, incrementMessageCount, getRemainingTime } from "../utils/rateLimit";
import { useIsMobile } from "../utils/deviceDetect";
import { useAuth } from "../contexts/AuthContext";

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
  const [inputSent, setInputSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean; type?: "text" | "code" }>
  >([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const [rateLimit, setRateLimit] = useState<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }>({
    allowed: true,
    remaining: 10,
    resetTime: 0,
  });

  const startNewSession = (showWelcome: boolean | React.MouseEvent = true) => {
    const shouldShowWelcome = typeof showWelcome === 'boolean' ? showWelcome : true;
    setMessages([]);
    setInputSent(!shouldShowWelcome);
    setMessage("");
    setRateLimit(checkRateLimit());
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  useEffect(() => {
    setRateLimit(checkRateLimit());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage || isLoading) return;

    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      setShowThankYou(true);
      setRateLimit(rateLimitCheck);
      return;
    }

    const userMessage = { text: currentMessage, isUser: true, type: "text" as const };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setInputSent(prev => prev ? prev : true);

    try {
      const conversationHistory = messages
        .filter(msg => msg.text.trim())
        .reduce<Array<{ user: string; ai: string }>>((acc, msg, idx, arr) => {
          if (msg.isUser && idx + 1 < arr.length && !arr[idx + 1].isUser) {
            acc.push({ user: msg.text, ai: arr[idx + 1].text });
          }
          return acc;
        }, []);

      const newLimit = incrementMessageCount();
      setRateLimit({
        allowed: newLimit.allowed,
        remaining: newLimit.remaining,
        resetTime: newLimit.resetTime
      });

      const response = await askLumi(currentMessage, conversationHistory);
      
      if (!response || typeof response.reply !== 'string') {
        throw new Error('Invalid response from server');
      }

      setMessages(prev => [
        ...prev,
        { 
          text: response.reply, 
          isUser: false, 
          type: response.type || "text" 
        }
      ]);
    } catch (error) {
      console.error("Error getting response from Lumi:", error);
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.isUser) {
          return [
            ...prev,
            {
              text: "Sorry, I'm having trouble connecting. Please try again.",
              isUser: false,
              type: "text" as const,
            },
          ];
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ThankYouModal = () => {
    const [timeLeft, setTimeLeft] = useState(getRemainingTime());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(getRemainingTime());
      }, 60000);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#2f2f2f] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[#404040]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
            <p className="text-gray-300 mb-2">
              You've reached the message limit for today.
            </p>
            <p className="text-white text-sm mb-4">
              {timeLeft
                ? `You can send more messages in ${timeLeft}`
                : "You can now send more messages"}
            </p>
            <p className="text-white mb-6">
              Thank you for testing Lumi.Ai! This is a beta version. We'll
              notify you when the full version is available.
            </p>
            <button
              onClick={() => setShowThankYou(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [selectedModel, setSelectedModel] = useState('Lumi 1.0');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-[#262624] relative">
      {showThankYou && <ThankYouModal />}
      
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <Sidebar onNewSession={startNewSession} />
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

        {/* Welcome Screen with Input Only */}
        {!inputSent && (
          <div className="flex flex-col items-center justify-center p-6 flex-1 bg-[#262624]">
            <div className="w-full max-w-2xl mb-6 text-center">
              <h2 className="text-2xl font-medium text-white flex items-center justify-center gap-2">
                <span>Hello, I'm</span>
                <span className="flex items-center">
                  Lumi
                  <div className="h-6 w-6 ml-1 flex items-center justify-center">
                    <img 
                      src="/logo.png" 
                      alt="Lumi Logo" 
                      className="h-5 w-5 object-contain filter-orange"
                      style={{ filter: 'invert(55%) sepia(95%) saturate(1000%) hue-rotate(350deg) brightness(100%) contrast(100%)' }}
                    />
                  </div>
                </span>
                <span className="text-gray-300 font-normal">How can I help you today?</span>
              </h2>
            </div>
            <div className="w-full max-w-2xl">
              <div className="bg-[#353535] border border-[#3a3a3a] rounded-xl w-full relative shadow-sm">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="relative z-0 pb-12">
                    <textarea
                      ref={inputRef as any}
                      placeholder="Ask me anything..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isLoading}
                      rows={1}
                      className="w-full bg-transparent mt-2 border-none rounded-xl pl-3 pr-14 py-3 pb-5 text-white placeholder-white/50 focus:outline-none disabled:opacity-50 text-[15px] resize-none min-h-[60px] max-h-[50vh] overflow-y-auto relative z-0"
                      style={{
                        lineHeight: '1.5',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#4b5563 transparent',
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${Math.min(target.scrollHeight, window.innerHeight * 0.5)}px`;
                      }}
                    />
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
                        className="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-600 hover:border-gray-500 hover:bg-[#3f3f3f] transition duration-200"
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
                        className="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-600 hover:border-gray-500 hover:bg-[#3f3f3f] transition duration-200"
                        aria-label="Extended thinking"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" className="text-gray-400">
                          <path fill="currentColor" d="M248 124a56.11 56.11 0 0 0-32-50.61V72a48 48 0 0 0-88-26.49A48 48 0 0 0 40 72v1.39a56 56 0 0 0 0 101.2V176a48 48 0 0 0 88 26.49A48 48 0 0 0 216 176v-1.41A56.09 56.09 0 0 0 248 124ZM88 208a32 32 0 0 1-31.81-28.56A55.87 55.87 0 0 0 64 180h8a8 8 0 0 0 0-16h-8a40 40 0 0 1-13.33-77.73A8 8 0 0 0 56 78.73V72a32 32 0 0 1 64 0v68.26A47.8 47.8 0 0 0 88 128a8 8 0 0 0 0 16a32 32 0 0 1 0 64Zm104-44h-8a8 8 0 0 0 0 16h8a55.87 55.87 0 0 0 7.81-.56A32 32 0 1 1 168 144a8 8 0 0 0 0-16a47.8 47.8 0 0 0-32 12.26V72a32 32 0 0 1 64 0v6.73a8 8 0 0 0 5.33 7.54A40 40 0 0 1 192 164Zm16-52a8 8 0 0 1-8 8h-4a36 36 0 0 1-36-36v-4a8 8 0 0 1 16 0v4a20 20 0 0 0 20 20h4a8 8 0 0 1 8 8Zm-148 8h-4a8 8 0 0 1 0-16h4a20 20 0 0 0 20-20v-4a8 8 0 0 1 16 0v4a36 36 0 0 1-36 36Z"/>
                        </svg>
                      </button>
                      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Extended thinking
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-2">
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setShowModelDropdown(!showModelDropdown)}
                        className="h-9 px-2.5 bg-[#2f2f2f] hover:bg-[#3a3a3a] text-gray-200 text-xs cursor-pointer rounded-lg transition-colors flex items-center justify-center gap-1.5 font-medium border border-[#3a3a3a]"
                      >
                        {selectedModel}
                        <svg 
                          className={`w-3.5 h-3.5 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showModelDropdown && (
                        <div className="absolute right-0 top-10 mt-1 w-64 bg-[#353535] rounded-lg shadow-lg border border-[#3a3a3a] overflow-hidden z-20">
                          <div className="p-2">
                            <div 
                              onClick={() => {
                                setSelectedModel('Lumi 1.0');
                                setShowModelDropdown(false);
                              }}
                              className="p-2 rounded cursor-pointer text-gray-200 hover:bg-[#3f3f3f]"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Lumi 1.0</span>
                                {selectedModel === 'Lumi 1.0' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div className="text-xs text-gray-300 mt-0.5">Standard model optimized for quick responses to general questions, document analysis, and code assistance. Best for everyday tasks and straightforward queries.</div>
                            </div>
                            <div 
                              onClick={() => {
                                setSelectedModel('Lumi Agent');
                                setShowModelDropdown(false);
                              }}
                              className="p-2 rounded cursor-pointer mt-1 text-gray-200 hover:bg-[#3f3f3f]"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Lumi Agent</span>
                                {selectedModel === 'Lumi Agent' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div className="text-xs text-gray-300 mt-0.5">Advanced agent with reasoning capabilities, ideal for complex problem-solving, multi-step tasks, and in-depth analysis. Can break down complex problems and provide detailed, step-by-step solutions.</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading || !message.trim()}
                      className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center hover:bg-orange-600 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        className="text-white"
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
                  </div>
                  </div>
                </form>
              </div>
              <p className="text-gray-500 text-xs mt-4 text-center max-w-md">
                Lumi can make mistakes. Please verify important information.
              </p>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        {inputSent && (
          <div className="flex flex-col h-full bg-[#262624]">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                {messages.map((msg, index) => (
                  <div key={index}>
                    {!msg.isUser && (
                      <div className="border-b border-[#262624]">
                        <div className="px-6 py-8 max-w-3xl mx-auto">
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                              <img
                                src="/logo.png"
                                alt="Lumi"
                                className="w-4 h-4 brightness-0 invert"
                              />
                            </div>
                            
                            {/* Message content */}
                            <div className="flex-1 min-w-0 pt-0.5">
                              {msg.type === "code" ? (
                                <CodeEditor code={msg.text} />
                              ) : (
                                <div className="text-[#e8e8e8] leading-relaxed text-[15px] whitespace-pre-wrap break-words">
                                  {msg.text}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {msg.isUser && (
                      <div className="px-6 py-8 max-w-3xl mx-auto">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="flex-shrink-0 w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
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
                          </div>
                          
                          {/* Message content */}
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="text-[#e8e8e8] leading-relaxed text-[15px] whitespace-pre-wrap break-words">
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="border-b border-[#2f2f2f]">
                    <div className="px-6 py-8 max-w-3xl mx-auto">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                          <img
                            src="/logo.png"
                            alt="Lumi"
                            className="w-4 h-4 brightness-0 invert animate-spin"
                          />
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-[#262624] pb-6">
              <div className="max-w-4xl mx-auto px-6">
                <div className="max-w-3xl mx-auto">
                  <form onSubmit={handleSubmit} className="relative">
                    <textarea
                      ref={inputRef}
                      placeholder="Reply to Lumi..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      disabled={isLoading}
                      rows={1}
                      className="w-full bg-[#2f2f2f] border border-[#3a3a3a] rounded-2xl px-5 py-4 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-[#4a4a4a] disabled:opacity-50 resize-none text-[15px] leading-6 min-h-[56px] max-h-[200px]"
                      style={{ 
                        height: 'auto',
                        overflowY: message.split('\n').length > 3 ? 'auto' : 'hidden'
                      }}
                    />
                    <div className="absolute left-3 bottom-3 flex items-center gap-2">
                      <div className="relative">
                        <button 
                          type="button"
                          onClick={() => setShowModelDropdown(!showModelDropdown)}
                          className="h-8 px-2.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-gray-200 text-xs cursor-pointer rounded-lg transition-colors flex items-center justify-center gap-1.5 font-medium"
                        >
                          {selectedModel}
                          <svg 
                            className={`w-3.5 h-3.5 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {showModelDropdown && (
                          <div className="absolute left-0 bottom-10 mb-1 w-36 bg-[#1f1f1f] rounded-lg shadow-lg border border-[#3a3a3a] overflow-hidden z-20">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedModel('Lumi 1.0');
                                setShowModelDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left text-xs flex items-center justify-between text-gray-200 hover:bg-[#2a2a2a]"
                            >
                              <span>Lumi 1.0</span>
                              {selectedModel === 'Lumi 1.0' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedModel('Lumi Agent');
                                setShowModelDropdown(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between text-gray-200 hover:bg-[#2a2a2a]`}
                            >
                              <span>Lumi Agent</span>
                              {selectedModel === 'Lumi Agent' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute right-3 bottom-3">
                      <button
                        type="submit"
                        disabled={isLoading || !message.trim()}
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
                    </div>
                  </form>
                  <div className="flex items-center justify-center mt-3 text-xs text-gray-500 gap-2">
                    <span>Messages: {rateLimit.remaining} remaining</span>
                    <span className="text-gray-600">•</span>
                    <span>Lumi can make mistakes. Please double-check responses.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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