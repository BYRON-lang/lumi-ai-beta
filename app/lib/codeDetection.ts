// Utility functions for detecting and processing code blocks in messages

export interface CodeBlock {
  code: string;
  language: string;
  startIndex: number;
  endIndex: number;
}

export interface ProcessedMessage {
  text: string;
  type: 'text' | 'code';
  codeBlocks?: CodeBlock[];
}

/**
 * Detects code blocks in a message using markdown syntax
 * Supports both ```language and ``` formats
 */
export function detectCodeBlocks(text: string): CodeBlock[] {
  const codeBlocks: CodeBlock[] = [];
  
  // Regex to match code blocks with optional language
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const language = match[1] || 'text';
    const code = match[2].trim();
    const startIndex = match.index;
    const endIndex = match.index + match[0].length;
    
    // Debug logging
    console.log('Code block detection:', {
      fullMatch: match[0],
      language,
      code: code.substring(0, 50) + (code.length > 50 ? '...' : ''),
      endsWithBackticks: match[0].endsWith('```'),
      codeLength: code.length
    });
    
    // Only add if there's actual code content and it's a complete block
    // Check that the match ends with closing backticks
    if (code.length > 0 && match[0].endsWith('```')) {
      codeBlocks.push({
        code,
        language,
        startIndex,
        endIndex
      });
    }
  }
  
  return codeBlocks;
}

/**
 * Processes a message to determine if it contains code blocks
 * and extracts the code content
 */
export function processMessage(text: string): ProcessedMessage {
  const codeBlocks = detectCodeBlocks(text);
  
  console.log('Processing message:', {
    textLength: text.length,
    codeBlocksFound: codeBlocks.length,
    textPreview: text.substring(0, 100) + (text.length > 100 ? '...' : '')
  });
  
  if (codeBlocks.length === 0) {
    return {
      text,
      type: 'text'
    };
  }
  
  // If the entire message is a single code block, treat it as code
  if (codeBlocks.length === 1) {
    const block = codeBlocks[0];
    const beforeCode = text.substring(0, block.startIndex).trim();
    const afterCode = text.substring(block.endIndex).trim();
    
    console.log('Single code block analysis:', {
      beforeCode,
      afterCode,
      isPureCode: !beforeCode && !afterCode
    });
    
    // If there's no text before or after the code block, treat as pure code
    if (!beforeCode && !afterCode) {
      return {
        text: block.code,
        type: 'code',
        codeBlocks: [block]
      };
    }
  }
  
  // If there are code blocks but also other content, keep as text
  // The MarkdownRenderer will handle displaying the code blocks inline
  return {
    text,
    type: 'text',
    codeBlocks
  };
}

/**
 * Extracts the first code block from a message for display in CodeBlock component
 */
export function getFirstCodeBlock(text: string): CodeBlock | null {
  const codeBlocks = detectCodeBlocks(text);
  return codeBlocks.length > 0 ? codeBlocks[0] : null;
}

/**
 * Removes code blocks from text for display in message bubble
 * This is used when we want to show only the text content without code
 */
export function removeCodeBlocks(text: string): string {
  return text.replace(/```(\w+)?\n([\s\S]*?)```/g, '');
}
