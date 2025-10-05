import * as React from "react";
import type { Route } from "./+types/home";
import { Sidebar } from "../components/Sidebar";
import { CodeEditor } from "../components/CodeEditor";
import { useState, useEffect, useRef, Suspense } from "react";
import { askLumi } from "../lib/lumiApi";
import { checkRateLimit, incrementMessageCount, getRemainingTime } from "../utils/rateLimit";
import { useIsMobile } from "../utils/deviceDetect";

// Lazy load the mobile component
const MobileHome = React.lazy(() => import("./home.mobile"));

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lumi.Ai - Intelligent Document Processing" },
    {
      name: "description",
      content:
        "Transform your documents with AI-powered processing, extraction, and analysis. Lumi.Ai makes document workflows intelligent and efficient.",
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
            <p className="text-gray-400 text-sm mb-4">
              {timeLeft
                ? `You can send more messages in ${timeLeft}`
                : "You can now send more messages"}
            </p>
            <p className="text-gray-300 mb-6">
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

  return (
    <div className="flex h-screen overflow-hidden bg-[#212121] relative">
      {showThankYou && <ThankYouModal />}
      
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <Sidebar onNewSession={startNewSession} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#3a3a3a] bg-[#212121]">
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
          <div className="flex flex-col items-center justify-center p-6 flex-1 bg-[#212121]">
            <div className="mb-8 flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <img
                    src="/logo.png"
                    alt="Lumi Logo"
                    className="w-12 h-12 brightness-0 invert"
                  />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-white text-4xl md:text-5xl font-bold mb-2">
                  Lumi<span className="text-orange-400">.Ai</span>
                </h1>
                <p className="text-gray-400 text-base">
                  Your intelligent AI assistant
                </p>
              </div>
            </div>

            <div className="bg-[#2f2f2f] border border-[#3a3a3a] rounded-xl w-full max-w-2xl relative shadow-sm">
              <form onSubmit={handleSubmit}>
                <input
                  ref={inputRef as any}
                  type="text"
                  placeholder="Ask me anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-transparent border-none rounded-xl px-5 py-4 pr-14 text-white placeholder-gray-500 focus:outline-none disabled:opacity-50 text-[15px]"
                />
                <div className="absolute bottom-2.5 right-2.5">
                  <button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
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
              </form>
            </div>
            <p className="text-gray-500 text-xs mt-4 text-center max-w-md">
              Lumi can make mistakes. Please verify important information.
            </p>
          </div>
        )}

        {/* Chat Interface */}
        {inputSent && (
          <div className="flex flex-col h-full bg-[#212121]">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                {messages.map((msg, index) => (
                  <div key={index}>
                    {!msg.isUser && (
                      <div className="border-b border-[#2f2f2f]">
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
            <div className="bg-[#212121] pb-6">
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

  if (isMobile) {
    return (
      <Suspense fallback={<div>Loading mobile version...</div>}>
        <MobileHome />
      </Suspense>
    );
  }

  return <DesktopHome />;
}