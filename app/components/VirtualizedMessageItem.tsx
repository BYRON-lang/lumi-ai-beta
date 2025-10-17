import React from 'react';
import { MessageBubble } from './MessageBubble';

interface MessageData {
  text: string;
  isUser: boolean;
  type?: "text" | "code";
  timestamp?: string;
  agentName?: string;
  agent?: string;
}

interface VirtualizedMessageItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    messages: MessageData[];
    isStreaming: boolean;
    isWebSearching: boolean;
    isExtendedThinking: boolean;
    searchQuery: string;
    onRetry: (messageIndex: number) => void;
    onCopy: (text: string) => void;
    onLike: (messageIndex: number) => void;
    onDislike: (messageIndex: number) => void;
    user: any;
  };
}

export const VirtualizedMessageItem: React.FC<VirtualizedMessageItemProps> = ({
  index,
  style,
  data
}) => {
  const {
    messages,
    isStreaming,
    isWebSearching,
    isExtendedThinking,
    searchQuery,
    onRetry,
    onCopy,
    onLike,
    onDislike,
    user
  } = data;

  const message = messages[index];
  
  if (!message) {
    return <div style={style} />;
  }

  return (
    <div style={style} data-message-index={index}>
      <MessageBubble
        text={message.text}
        isUser={message.isUser}
        type={message.type}
        timestamp={message.timestamp}
        agentName={message.agentName}
        agent={message.agent}
        isStreaming={isStreaming && index === messages.length - 1 && !message.isUser}
        isWebSearching={isWebSearching && index === messages.length - 1 && !message.isUser}
        isExtendedThinking={isExtendedThinking && index === messages.length - 1 && !message.isUser}
        searchQuery={searchQuery}
        onRetry={!message.isUser ? () => onRetry(index) : undefined}
        onCopy={!message.isUser ? () => onCopy(message.text) : undefined}
        onLike={!message.isUser ? () => onLike(index) : undefined}
        onDislike={!message.isUser ? () => onDislike(index) : undefined}
        user={user}
      />
    </div>
  );
};
