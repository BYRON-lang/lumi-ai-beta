/**
 * Centralized detection utilities used by both frontend and backend
 * This ensures consistent detection logic across the entire application
 */

export interface DetectionResult {
  isCodingRequest: boolean;
  isWebSearchRequest: boolean;
  priority: 'coding' | 'general';
}

// Image detection removed - will be handled by sidebar image generator
// Keep the service infrastructure in imageGenerationService.ts for future use

/**
 * Detect if a message is requesting coding assistance
 */
export function detectCodingRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  const codingKeywords = [
    // Direct coding requests
    'write code', 'create code', 'generate code', 'code for',
    'write a function', 'create a function', 'build an app', 'develop an app',
    'debug', 'fix code', 'optimize code', 'refactor', 'code review',
    'show me code', 'give me code', 'help me code', 'coding help',
    'write a program', 'create a program',
    
    // Language-specific
    'python code', 'javascript code', 'typescript code', 'java code',
    'react component', 'vue component', 'angular component',
    
    // Specific programming terms
    'function', 'class', 'method', 'algorithm', 'data structure',
    'api endpoint', 'database query', 'sql query'
  ];
  
  const programmingLanguages = [
    'python', 'javascript', 'typescript', 'java', 'c++', 'c#',
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'
  ];
  
  // Check for coding keywords
  const hasCodingKeyword = codingKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Check for programming language mentions with code-related context
  const hasLanguageWithContext = programmingLanguages.some(lang => {
    if (!lowerMessage.includes(lang)) return false;
    // Must have code-related words nearby
    return /code|program|function|script|develop|build/i.test(message);
  });
  
  return hasCodingKeyword || hasLanguageWithContext;
}

// Educational detection removed - Lumi 1.0 handles all educational content now

/**
 * Detect if a message needs web search
 */
export function detectWebSearchRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  const webSearchKeywords = [
    // Current information
    'latest', 'recent', 'current', 'today', 'news', 'price',
    
    // Technology products
    'iphone', 'android', 'macbook', 'ipad', 'nvidia', 'amd',
    
    // Financial
    'stock', 'crypto', 'bitcoin', 'ethereum', 'market',
    
    // Time-sensitive
    '2024', '2025', 'this week', 'this month', 'this year'
  ];
  
  const hasWebSearchKeyword = webSearchKeywords.some(keyword => lowerMessage.includes(keyword));
  
  const webSearchPatterns = [
    /what.*price/i,
    /how much.*cost/i,
    /latest.*news/i,
    /current.*status/i
  ];
  
  const hasPattern = webSearchPatterns.some(pattern => pattern.test(message));
  
  return hasWebSearchKeyword || hasPattern;
}

/**
 * Comprehensive detection - returns all detection results with priority
 */
export function detectRequestType(message: string): DetectionResult {
  const isCodingRequest = detectCodingRequest(message);
  const isWebSearchRequest = detectWebSearchRequest(message);
  
  // Determine priority (highest to lowest)
  let priority: 'coding' | 'general' = 'general';
  
  if (isCodingRequest) {
    priority = 'coding';
  }
  
  return {
    isCodingRequest,
    isWebSearchRequest,
    priority
  };
}

