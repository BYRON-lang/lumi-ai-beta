import { useState, useRef, useCallback } from 'react';

export interface StreamingCodeState {
  code: string;
  language: string;
  isInCodeBlock: boolean;
  isComplete: boolean;
}

export interface CodeBlock {
  code: string;
  language: string;
  isComplete: boolean;
}

/**
 * Hook for real-time code detection during streaming
 */
export function useStreamingCodeDetection() {
  const [codeState, setCodeState] = useState<StreamingCodeState>({
    code: '',
    language: '',
    isInCodeBlock: false,
    isComplete: false
  });

  const bufferRef = useRef('');
  const inCodeBlockRef = useRef(false);
  const codeBufferRef = useRef('');
  const languageRef = useRef('');

  const processChunk = useCallback((chunk: string) => {
    bufferRef.current += chunk;
    const buffer = bufferRef.current;

    // Find the most recent code block
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)(?:```|$)/g;
    const matches = Array.from(buffer.matchAll(codeBlockRegex));
    const lastMatch = matches[matches.length - 1];
    
    if (lastMatch) {
      const language = lastMatch[1] || 'text';
      const code = lastMatch[2];
      const isComplete = buffer.includes('```', lastMatch.index + lastMatch[0].length);
      
      languageRef.current = language;
      codeBufferRef.current = code;
      inCodeBlockRef.current = true;
      
      setCodeState({
        code: code,
        language: language,
        isInCodeBlock: true,
        isComplete: isComplete
      });
    } else if (inCodeBlockRef.current) {
      // No code block found, reset state
      inCodeBlockRef.current = false;
      setCodeState({
        code: '',
        language: '',
        isInCodeBlock: false,
        isComplete: false
      });
    }

    // Clean up buffer to prevent memory issues
    if (buffer.length > 2000) {
      bufferRef.current = buffer.slice(-1000);
    }
  }, []);

  const reset = useCallback(() => {
    bufferRef.current = '';
    codeBufferRef.current = '';
    languageRef.current = '';
    inCodeBlockRef.current = false;
    setCodeState({
      code: '',
      language: '',
      isInCodeBlock: false,
      isComplete: false
    });
  }, []);

  const getCodeBlock = useCallback((): CodeBlock | null => {
    if (codeState.isInCodeBlock || codeState.isComplete) {
      return {
        code: codeState.code,
        language: codeState.language,
        isComplete: codeState.isComplete
      };
    }
    return null;
  }, [codeState]);

  return {
    codeState,
    processChunk,
    reset,
    getCodeBlock
  };
}

/**
 * Utility function to detect if text contains code patterns
 */
export function hasCodePatterns(text: string): boolean {
  const codePatterns = [
    /```[\s\S]*?```/,  // Code blocks
    /`[^`]+`/,         // Inline code
    /function\s+\w+/,  // Function declarations
    /const\s+\w+\s*=/, // Variable declarations
    /import\s+.*from/, // Import statements
    /class\s+\w+/,     // Class declarations
    /def\s+\w+/,       // Python functions
    /#include\s*</,    // C++ includes
    /<\w+.*>/,         // HTML tags
    /\.\w+\(/,         // Method calls
  ];
  
  return codePatterns.some(pattern => pattern.test(text));
}

/**
 * Utility function to detect code language from text
 */
export function detectLanguage(text: string): string {
  const patterns = {
    javascript: [/function\s+\w+/, /const\s+\w+\s*=/, /import\s+.*from/, /console\.log/],
    python: [/def\s+\w+/, /import\s+\w+/, /print\s*\(/, /if\s+__name__/],
    html: [/<html/, /<div/, /<span/, /<p/, /<h[1-6]/],
    css: [/\.\w+\s*{/, /#\w+\s*{/, /@media/, /@keyframes/],
    java: [/public\s+class/, /import\s+java/, /System\.out\.print/],
    cpp: [/#include\s*</, /using\s+namespace/, /std::/],
    sql: [/SELECT\s+/, /INSERT\s+INTO/, /UPDATE\s+/, /DELETE\s+FROM/],
    json: [/^\s*{/, /^\s*\[/, /"[\w\s]+":/],
    xml: [/<\?xml/, /<[a-zA-Z][^>]*>/, /<\/[a-zA-Z][^>]*>/],
  };

  for (const [lang, langPatterns] of Object.entries(patterns)) {
    if (langPatterns.some(pattern => pattern.test(text))) {
      return lang;
    }
  }

  return 'text';
}
