import React, { useState } from 'react';

interface MessageActionsProps {
  onRetry?: () => void;
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  isUser?: boolean;
  isStreaming?: boolean;
  showRetry?: boolean;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  onRetry,
  onCopy,
  onLike,
  onDislike,
  isUser = false,
  isStreaming = false,
  showRetry = true
}) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleCopy = async () => {
    if (onCopy) {
      await onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike();
      setLiked(!liked);
      if (disliked) setDisliked(false);
    }
  };

  const handleDislike = () => {
    if (onDislike) {
      onDislike();
      setDisliked(!disliked);
      if (liked) setLiked(false);
    }
  };

  return (
    <div className="flex items-center gap-1 mt-3">
      {/* Retry Button */}
      {onRetry && showRetry && (
        <button
          onClick={onRetry}
          className="p-1.5 rounded-md"
          title="Retry this response"
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
            className="text-gray-400"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>
      )}

      {/* Copy Button */}
      {onCopy && (
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md"
          title={copied ? "Copied!" : "Copy response"}
        >
          {copied ? (
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
              className="text-green-400"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
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
            className="text-gray-400"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          )}
        </button>
      )}

      {/* Like Button */}
      {onLike && (
        <button
          onClick={handleLike}
          className={`p-1.5 rounded-md ${
            liked 
              ? 'bg-green-500/20 text-green-400' 
              : 'text-gray-400'
          }`}
          title={liked ? "Liked" : "Like this response"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
        </button>
      )}

      {/* Dislike Button */}
      {onDislike && (
        <button
          onClick={handleDislike}
          className={`p-1.5 rounded-md ${
            disliked 
              ? 'bg-red-500/20 text-red-400' 
              : 'text-gray-400'
          }`}
          title={disliked ? "Disliked" : "Dislike this response"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={disliked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 14V2" />
            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
          </svg>
        </button>
      )}
    </div>
  );
};
