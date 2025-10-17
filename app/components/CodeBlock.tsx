import React from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  onOpenEditor?: () => void;
  showAllLines?: boolean; // New prop to control whether to show all lines
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  title = 'Code',
  onOpenEditor,
  showAllLines = false
}) => {
  // Show all lines if showAllLines is true, otherwise show preview
  const displayCode = showAllLines ? code : code.split('\n').slice(0, 3).join('\n');
  const hasMoreLines = !showAllLines && code.split('\n').length > 3;

  return (
    <div
      onClick={onOpenEditor}
      className={`mt-3 p-4 bg-[#1E1E1E] border border-[#3a3a3a] rounded-lg transition-colors group ${onOpenEditor ? 'cursor-pointer hover:bg-[#252525]' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-white font-medium text-sm">{title}</span>
          <span className="text-gray-400 text-xs font-mono bg-[#2a2a2a] px-2 py-1 rounded">
            {language}
          </span>
        </div>
        {onOpenEditor && (
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 group-hover:text-white transition-colors"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
        )}
      </div>

      {/* Code Display */}
      <div className="relative">
        <pre className={`text-gray-300 text-sm font-mono ${showAllLines ? 'overflow-x-auto max-h-80 overflow-y-auto whitespace-pre-wrap' : 'overflow-hidden'}`}>
          <code>{displayCode}</code>
        </pre>
        {hasMoreLines && (
          <div className="absolute bottom-0 right-0 bg-[#1E1E1E] px-2 py-1 text-xs text-gray-500">
            +{code.split('\n').length - 3} more lines
          </div>
        )}
      </div>

      {/* Click hint - only show when onOpenEditor is provided */}
      {onOpenEditor && (
        <div className="mt-2 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
          Click to open in editor
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
