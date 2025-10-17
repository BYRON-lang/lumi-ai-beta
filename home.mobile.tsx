import * as React from 'react';
import { askLumi } from '../lib/lumiApi';

const MobileHome: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = React.useState(false);
  const [textareaValue, setTextareaValue] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<Array<{type: 'user' | 'ai', content: string, timestamp: string}>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const sendMessage = async () => {
    if (!textareaValue.trim() || isLoading) return;

    const userMessage = textareaValue.trim();
    setTextareaValue('');
    setIsTextareaFocused(false);

    // Add user message to chat
    const newUserMessage = {
      type: 'user' as const,
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Convert chat history to the format expected by the API
      const conversationHistory = chatMessages.map(msg => ({
        user: msg.type === 'user' ? msg.content : '',
        ai: msg.type === 'ai' ? msg.content : ''
      })).filter(msg => msg.user || msg.ai);

      const response = await askLumi(userMessage, conversationHistory);

      // Add AI response to chat
      const newAIMessage = {
        type: 'ai' as const,
        content: response.reply,
        timestamp: new Date().toISOString()
      };

      setChatMessages(prev => [...prev, newAIMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage = {
        type: 'ai' as const,
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setChatMessages([]);
    setTextareaValue('');
    setIsTextareaFocused(false);
    setIsLoading(false);
    setIsDropdownOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasMessages = chatMessages.length > 0;

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes blink {
          0%, 20% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .chat-messages::-webkit-scrollbar {
          width: 4px;
        }
        
        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
      `}</style>

      {/* Header - always visible when chatting */}
      {hasMessages && (
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 15 15"
              style={styles.headerIcon}
              onClick={startNewChat}
              cursor="pointer"
            >
              <path 
                fill="#ffffff" 
                fillRule="evenodd" 
                d="M12.146 1.146a.5.5 0 0 1 .707 0l2 2a.5.5 0 0 1 0 .708l-3.942 3.942a1 1 0 0 1-.26.188L6.724 9.947a.5.5 0 0 1-.671-.67l1.963-3.928a1 1 0 0 1 .188-.26l3.942-3.943Zm.354 1.061l-3.59 3.59l-1.037 2.076l.254.254l2.077-1.038L13.793 3.5L12.5 2.207ZM10 2L9 3H4.9c-.428 0-.72 0-.944.019c-.22.018-.332.05-.41.09a1 1 0 0 0-.437.437c-.04.078-.072.19-.09.41C3 4.18 3 4.472 3 4.9v6.2c0 .428 0 .72.019.944c.018.22.05.332.09.41a1 1 0 0 0 .437.437c.078.04.19.072.41.09c.225.019.516.019.944.019h6.2c.428 0 .72 0 .944-.019c.22-.018.332-.05.41-.09a1 1 0 0 0 .437-.437c.04-.078.072-.19.09-.41c.019-.225.019-.516.019-.944V7l1-1v5.12c0 .403 0 .735-.022 1.006c-.023.281-.072.54-.196.782a2 2 0 0 1-.874.874c-.243.124-.501.173-.782.196c-.27.022-.603.022-1.005.022H4.88c-.403 0-.735 0-1.006-.022c-.281-.023-.54-.072-.782-.196a2 2 0 0 1-.874-.874c-.124-.243-.173-.501-.196-.782C2 11.856 2 11.523 2 11.12V4.88c0-.403 0-.735.022-1.006c.023-.281.072-.54.196-.782a2 2 0 0 1 .874-.874c.243-.124.501-.173.782-.196C4.144 2 4.477 2 4.88 2H10Z" 
                clipRule="evenodd"
              />
            </svg>
            <div style={{ position: 'relative' }}>
              <div 
                style={{ ...styles.headerLogoText, cursor: 'pointer' }} 
                onClick={toggleDropdown}
              >
                Lumi
                <span style={styles.headerArrow}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="#ffffff"
                    style={{
                      transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease-in-out'
                    }}
                  >
                    <path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42z"/>
                  </svg>
                </span>
              </div>
              
              {isDropdownOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownItem}>This is a beta version</div>
                </div>
              )}
            </div>
          </div>
          <div style={styles.headerBetaBadge}>Beta</div>
        </div>
      )}

      {/* Original top section - only visible when not chatting */}
      {!hasMessages && (
        <div style={styles.iconContainer}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 15 15"
            style={styles.icon}
          >
            <path 
              fill="#ffffff" 
              fillRule="evenodd" 
              d="M12.146 1.146a.5.5 0 0 1 .707 0l2 2a.5.5 0 0 1 0 .708l-3.942 3.942a1 1 0 0 1-.26.188L6.724 9.947a.5.5 0 0 1-.671-.67l1.963-3.928a1 1 0 0 1 .188-.26l3.942-3.943Zm.354 1.061l-3.59 3.59l-1.037 2.076l.254.254l2.077-1.038L13.793 3.5L12.5 2.207ZM10 2L9 3H4.9c-.428 0-.72 0-.944.019c-.22.018-.332.05-.41.09a1 1 0 0 0-.437.437c-.04.078-.072.19-.09.41C3 4.18 3 4.472 3 4.9v6.2c0 .428 0 .72.019.944c.018.22.05.332.09.41a1 1 0 0 0 .437.437c.078.04.19.072.41.09c.225.019.516.019.944.019h6.2c.428 0 .72 0 .944-.019c.22-.018.332-.05.41-.09a1 1 0 0 0 .437-.437c.04-.078.072-.19.09-.41c.019-.225.019-.516.019-.944V7l1-1v5.12c0 .403 0 .735-.022 1.006c-.023.281-.072.54-.196.782a2 2 0 0 1-.874.874c-.243.124-.501.173-.782.196c-.27.022-.603.022-1.005.022H4.88c-.403 0-.735 0-1.006-.022c-.281-.023-.54-.072-.782-.196a2 2 0 0 1-.874-.874c-.124-.243-.173-.501-.196-.782C2 11.856 2 11.523 2 11.12V4.88c0-.403 0-.735.022-1.006c.023-.281.072-.54.196-.782a2 2 0 0 1 .874-.874c.243-.124.501-.173.782-.196C4.144 2 4.477 2 4.88 2H10Z" 
              clipRule="evenodd"
            />
          </svg>
          <div style={{ position: 'relative' }}>
            <div 
              style={{ ...styles.logoText, cursor: 'pointer' }} 
              onClick={toggleDropdown}
            >
              Lumi
              <span style={styles.arrow}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="#ffffff"
                  style={{
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                >
                  <path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42z"/>
                </svg>
              </span>
            </div>
            
            {isDropdownOpen && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownItem}>This is a beta version</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Beta Badge - positioned based on chat state */}
      {!hasMessages && <div style={styles.betaBadge}>Beta</div>}

      {/* Only show centered logo and help text when there are no messages */}
      {!hasMessages && (
        <>
          <div style={styles.centeredLogo}>
            <img
              src="/logo.png"
              alt="Lumi Logo"
              style={styles.logoImage}
            />
          </div>
          <div style={styles.helpText}>
            Hey! How can I help you?
          </div>
        </>
      )}

      {/* Chat container - shows when there are messages */}
      {hasMessages && (
        <div style={styles.chatContainer}>
          <div className="chat-messages" style={styles.chatMessages}>
            {chatMessages.map((message, index) => (
              <div key={index} style={styles.messageWrapper}>
                {message.type === 'ai' && (
                  <div style={styles.aiAvatar}>
                    <img
                      src="/logo.png"
                      alt="Lumi"
                      style={styles.avatarLogo}
                    />
                  </div>
                )}
                <div style={{
                  ...styles.message,
                  ...(message.type === 'user' ? styles.userMessage : styles.aiMessage)
                }}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={styles.messageWrapper}>
                <div style={styles.aiAvatar}>
                  <img
                    src="/logo.png"
                    alt="Lumi"
                    style={{
                      ...styles.avatarLogo,
                      animation: 'spin 1s linear infinite'
                    }}
                  />
                </div>
                <div style={{...styles.message, ...styles.aiMessage, ...styles.loadingMessage}}>
                  <span style={styles.dot}>.</span>
                  <span style={{...styles.dot, animationDelay: '0.2s'}}>.</span>
                  <span style={{...styles.dot, animationDelay: '0.4s'}}>.</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      )}

      {/* Input container */}
      <div style={styles.rectangleContainer}>
        <textarea
          placeholder="Type your message here..."
          style={styles.inputField}
          rows={1}
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          onFocus={() => setIsTextareaFocused(true)}
          onBlur={() => setIsTextareaFocused(false)}
          onKeyPress={handleKeyPress}
        />
        <div 
          style={{
            ...styles.squareContainer,
            backgroundColor: (isTextareaFocused || textareaValue.trim()) ? '#ff6b35' : 'rgba(255, 255, 255, 0.2)',
            cursor: (textareaValue.trim() && !isLoading) ? 'pointer' : 'default',
            opacity: isLoading ? 0.5 : 1
          }} 
          onClick={sendMessage}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="200" 
            height="200" 
            viewBox="0 0 32 32"
            style={styles.uploadIcon}
          >
            <path fill="#ffffff" d="m16 4.094l-.72.687l-8.5 8.5l1.44 1.44L15 7.936V28h2V7.937l6.78 6.782l1.44-1.44l-8.5-8.5l-.72-.686z"/>
          </svg>
        </div>
      </div>

    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#2f2f2f',
    minHeight: '100vh',
    width: '100%',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  iconContainer: {
    position: 'absolute' as const,
    top: '16px',
    left: '16px',
    zIndex: 1001,
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoText: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 600,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  arrow: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '4px',
  },
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    backgroundColor: '#3a3a3a',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '8px 0',
    marginTop: '8px',
    minWidth: '200px',
    zIndex: 1100,
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  dropdownItem: {
    padding: '10px 16px',
    color: '#ffffff',
    fontSize: '14px',
  },
  betaBadge: {
    position: 'absolute' as const,
    top: '21px',
    right: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 500,
    zIndex: 1001,
  },
  icon: {
    width: '24px',
    height: '24px',
  },
  header: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2f2f2f',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIcon: {
    width: '20px',
    height: '20px',
  },
  headerLogoText: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: 600,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  headerArrow: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '4px',
    position: 'relative' as const,
    top: '1px',
  },
  headerBetaBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 500,
  },
  logoImage: {
    width: '80px',
    height: 'auto',
    maxWidth: '100%',
    filter: 'invert(50%) sepia(100%) saturate(1000%) hue-rotate(0deg) brightness(100%) contrast(105%)',
  },
  centeredLogo: {
    position: 'absolute' as const,
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
  },
  helpText: {
    position: 'absolute' as const,
    top: 'calc(40% + 60px)',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 500,
    textAlign: 'center' as const,
    zIndex: 1,
    whiteSpace: 'nowrap' as const,
  },
  chatContainer: {
    flex: 1,
    paddingTop: '90px', // Account for fixed header
    paddingBottom: '150px', // Account for fixed input at bottom
    overflowY: 'auto' as const,
  },
  chatMessages: {
    padding: '0 16px',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
  },
  messageWrapper: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    alignItems: 'flex-start',
  },
  aiAvatar: {
    width: '32px',
    height: '32px',
    flexShrink: 0,
    marginTop: '4px',
  },
  avatarLogo: {
    width: '32px',
    height: '32px',
    filter: 'invert(50%) sepia(100%) saturate(1000%) hue-rotate(0deg) brightness(100%) contrast(105%)',
  },
  message: {
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '15px',
    lineHeight: '1.5',
    maxWidth: '85%',
    wordWrap: 'break-word' as const,
    whiteSpace: 'pre-wrap' as const,
  },
  userMessage: {
    backgroundColor: '#ff6b35',
    color: '#ffffff',
    marginLeft: 'auto',
    borderBottomRightRadius: '4px',
  },
  aiMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    borderBottomLeftRadius: '4px',
  },
  loadingMessage: {
    fontSize: '24px',
    padding: '8px 16px',
  },
  dot: {
    animation: 'blink 1.4s infinite',
    opacity: 0.4,
  },
  rectangleContainer: {
    position: 'fixed' as const,
    bottom: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '450px',
    backgroundColor: '#3a3a3a',
    borderRadius: '16px',
    padding: '20px',
    zIndex: 1000,
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  inputField: {
    width: 'calc(100% - 50px)',
    padding: '0',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0px',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    resize: 'none' as const,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  squareContainer: {
    position: 'absolute' as const,
    bottom: '8px',
    right: '8px',
    width: '36px',
    height: '36px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    transition: 'all 0.2s ease',
  },
  uploadIcon: {
    width: '18px',
    height: '18px',
  },
  disclaimer: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center' as const,
    padding: '12px 16px',
    fontSize: '12px',
    fontStyle: 'normal' as const,
    zIndex: 999,
    backgroundColor: '#2f2f2f',
  },
};

export default MobileHome;