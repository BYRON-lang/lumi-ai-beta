import config from '../config';

// Global abort controller for stopping streaming
let globalAbortController: AbortController | null = null;

// Types for the new AI worker API
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  agent: 'lumi-1.0' | 'lumi-coder';
  stream?: boolean;
  chatId?: string;
  extendedThinking?: boolean;
}

export interface ChatResponse {
  message: string;
  agent: string;
  timestamp: string;
  chatId?: string;
}

export interface StreamChunk {
  type: 'chunk' | 'done' | 'error' | 'web_search' | 'extended_thinking' | 'image_generation';
  content?: string;
  agent?: string;
  chatId?: string;
  timestamp?: string;
  error?: string;
  searchQuery?: string;
  prompt?: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  model: string;
  capabilities?: string[];
}

// Chat and Message storage interfaces
export interface StoredChat {
  id: string;
  user_id: string;
  title: string;
  model: string;
  created_at: number;
  updated_at: number;
  starred?: boolean;
}

export interface StoredMessage {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens: number;
  created_at: number;
}

export interface ChatWithMessages extends StoredChat {
  messages: StoredMessage[];
}

export interface UsageLimits {
  messages_limit: number;
  messages_used: number;
  tokens_used: number;
  can_send_message: boolean;
  reset_at: number;
}

// Legacy interface for backward compatibility
export interface LumiResponse {
  assistant: string;
  userMessage: string;
  reply: string;
  type?: "text" | "code";
  timestamp: string;
  meta?: {
    model: string;
    tokens?: number | null;
    latencyMs?: number | null;
  };
  suggestedActions?: string[];
  conversation?: { user: string; ai: string }[];
  error?: boolean;
  message?: string;
}

const AI_WORKER_URL = "https://api-lumi.gridrr.com";

/**
 * Get authentication headers for API requests
 */
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Token found, length:', token.length);
    
    // Decode token to check expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      const exp = payload.exp;
      console.log('🔑 Token expires at:', new Date(exp * 1000).toISOString());
      console.log('🔑 Current time:', new Date().toISOString());
      console.log('🔑 Token expired?', now > exp);
    } catch (e) {
      console.log('🔑 Could not decode token:', e);
    }
  } else {
    console.warn('❌ No token found in localStorage');
  }

  return headers;
}

/**
 * Ask Lumi - Non-streaming request (legacy compatibility)
 */
export async function askLumi(
  message: string,
  history: { user: string; ai: string }[] = [],
  agent: 'lumi-1.0' = 'lumi-1.0'
): Promise<LumiResponse> {
  try {
    // Convert history to the new message format
    const messages: ChatMessage[] = [];
    
    // Add conversation history
    history.forEach(({ user, ai }) => {
      messages.push({ role: 'user', content: user });
      messages.push({ role: 'assistant', content: ai });
    });
    
    // Add current message
    messages.push({ role: 'user', content: message });

    const request: ChatRequest = {
      messages,
      agent,
      stream: false
    };

    const response = await fetch(`${AI_WORKER_URL}/chat`, {
    method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lumi API error: ${response.status} - ${errorText}`);
  }

    const data: ChatResponse = await response.json();

    // Convert to legacy format
    const legacyResponse: LumiResponse = {
      assistant: data.agent,
      userMessage: message,
      reply: data.message,
      type: "text",
      timestamp: data.timestamp,
      meta: {
        model: data.agent,
        tokens: null,
        latencyMs: null,
      }
    };

    return legacyResponse;
  } catch (error) {
    console.error('Error in askLumi:', error);
    throw error;
  }
}

/**
 * Stop the current streaming generation
 */
export function stopGeneration(): void {
  if (globalAbortController) {
    globalAbortController.abort();
    globalAbortController = null;
  }
}

/**
 * Ask Lumi with streaming - New streaming API
 */
export async function askLumiStream(
  message: string,
  history: { user: string; ai: string }[] = [],
  agent: 'lumi-1.0' | 'lumi-coder' = 'lumi-1.0',
  onChunk?: (chunk: StreamChunk) => void,
  onComplete?: (fullResponse: string, chatId?: string) => void,
  onError?: (error: string) => void,
  chatId?: string,
  extendedThinking?: boolean
): Promise<string> {
  // Dynamic timeout based on message length and complexity
  const baseTimeout = 90000; // 1.5 minute base timeout
  const messageLength = message.length;
  
  // Check if this is an image generation request (needs more time)
  const isImageRequest = /generate.*image|create.*image|draw|paint|picture|visualize|make.*image|illustrate/i.test(message);
  const imageGenerationMultiplier = isImageRequest ? 3 : 1; // 3x timeout for image generation
  
  const extendedThinkingMultiplier = extendedThinking ? 2 : 1;
  const lengthMultiplier = Math.max(1, Math.ceil(messageLength / 1000)); // Add 1 minute per 1000 characters
  const calculatedTimeout = baseTimeout * extendedThinkingMultiplier * lengthMultiplier * imageGenerationMultiplier;
  const TIMEOUT_DURATION = Math.min(calculatedTimeout, 600000); // Cap at 10 minutes maximum
  const HEARTBEAT_INTERVAL = isImageRequest ? 45000 : 20000; // Shorter heartbeat for better responsiveness
  
  console.log('Timeout calculation:', {
    messageLength,
    isImageRequest,
    extendedThinking,
    baseTimeout,
    imageGenerationMultiplier,
    extendedThinkingMultiplier,
    lengthMultiplier,
    calculatedTimeout,
    finalTimeout: TIMEOUT_DURATION,
    timeoutMinutes: TIMEOUT_DURATION / 60000,
    heartbeatInterval: HEARTBEAT_INTERVAL / 1000 + 's',
    isCapped: calculatedTimeout > 600000
  });
  
  // Create new abort controller for this request
  globalAbortController = new AbortController();
  const abortController = globalAbortController;
  
  // Declare fullResponse outside try block so it's accessible in catch
  let fullResponse = '';
  
  try {
    // Convert history to the new message format
    const messages: ChatMessage[] = [];
    
    // Add conversation history
    history.forEach(({ user, ai }) => {
      messages.push({ role: 'user', content: user });
      messages.push({ role: 'assistant', content: ai });
    });
    
    // Add current message
    messages.push({ role: 'user', content: message });

    const request: ChatRequest = {
      messages,
      agent,
      stream: true,
      chatId: chatId,
      extendedThinking: extendedThinking || false
    };

    console.log('Making streaming request to:', `${AI_WORKER_URL}/chat/stream`);
    console.log('Request payload:', request);
    
    const response = await fetch(`${AI_WORKER_URL}/chat/stream`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
      signal: abortController.signal,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`Lumi API error: ${response.status} - ${errorText}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let lastActivity = Date.now();
    let startTime = Date.now();
    let timeoutId: NodeJS.Timeout | undefined;
    let heartbeatId: NodeJS.Timeout | undefined;

    // Set up heartbeat monitoring
    const heartbeatPromise = new Promise<never>((_, reject) => {
      heartbeatId = setInterval(() => {
        if (Date.now() - lastActivity > HEARTBEAT_INTERVAL) {
          reject(new Error('Streaming heartbeat timeout - connection may be stuck'));
        }
      }, HEARTBEAT_INTERVAL);
    });

    try {
      while (true) {
        const readPromise = reader.read();
        
        // Create a timeout promise that only triggers if no data is received
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            const timeoutMinutes = Math.round(TIMEOUT_DURATION / 60000);
            console.error(`Streaming timeout after ${timeoutMinutes} minutes - last activity was ${Date.now() - lastActivity}ms ago`);
            reject(new Error(`Streaming timeout after ${timeoutMinutes} minutes - the message may be too long or complex. Try breaking it into smaller parts.`));
          }, TIMEOUT_DURATION);
        });

        const { done, value } = await Promise.race([
          readPromise,
          timeoutPromise,
          heartbeatPromise
        ]);
        
        if (done) {
          console.log('Stream completed normally');
          break;
        }

        // Clear the timeout since we received data
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = undefined;
        }

        lastActivity = Date.now(); // Update activity timestamp
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonData = line.slice(6);
            console.log('Parsing SSE data:', jsonData);
            
            let data: StreamChunk;
            try {
              data = JSON.parse(jsonData) as StreamChunk;
            } catch (parseError) {
              console.warn('Failed to parse JSON:', jsonData, parseError);
              continue;
            }
            
            console.log('Parsed chunk:', data);
              
            if (data.type === 'chunk' && data.content) {
              fullResponse += data.content;
              onChunk?.(data);
              
              // Send progress update for long messages
              if (messageLength > 2000 && fullResponse.length > 0) {
                const elapsedMinutes = Math.round((Date.now() - startTime) / 60000);
                if (elapsedMinutes > 0 && fullResponse.length % 2000 === 0) { // Every 2000 characters
                  const progressMessage = `⏳ Processing long message... (${elapsedMinutes} minutes elapsed)`;
                  onChunk?.({
                    type: 'chunk',
                    content: progressMessage,
                    agent: 'lumi-1.0',
                    timestamp: new Date().toISOString()
                  });
                }
              }
            } else if (data.type === 'done') {
              console.log('Received completion chunk, calling onComplete...');
              onComplete?.(fullResponse, data.chatId);
              console.log('Stream completed successfully');
              return fullResponse;
            } else if (data.type === 'error') {
              const error = data.error || 'Unknown error occurred';
              console.error('Received error chunk:', error);
              console.error('Error data:', data);
              
              // If we've already received content, treat this as a non-fatal error
              if (fullResponse.length > 0) {
                console.warn('Error received after content was generated, ignoring:', error);
                // Don't throw, just log - continue processing stream
                continue;
              }
              
              onError?.(error);
              throw new Error(error);
            }
          } else if (line.trim()) {
            console.log('Non-data SSE line:', line);
          }
        }
      }
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      if (heartbeatId) clearInterval(heartbeatId);
      reader.releaseLock();
    }

    return fullResponse;
  } catch (error) {
    // Check if the error is due to user stopping generation
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('✋ Generation paused by user - showing already generated content');
      // Don't call onError - just return the content generated so far
      // The fullResponse is already set in the messages via onChunk callbacks
      return fullResponse;
    }
    
    console.error('Error in askLumiStream:', error);
    console.error('Error occurred after completion?', fullResponse.length > 0);
    console.error('Full response length:', fullResponse.length);
    
    // If we have a response, don't show error to user
    if (fullResponse.length > 0) {
      console.log('Response was generated successfully, ignoring post-completion error');
      onComplete?.(fullResponse, undefined);
      return fullResponse;
    }
    
    onError?.(error instanceof Error ? error.message : 'Unknown error');
    throw error;
  } finally {
    // Clean up the global abort controller
    globalAbortController = null;
  }
}

/**
 * Get list of available agents
 */
export async function getAgents(): Promise<AgentInfo[]> {
  try {
    const response = await fetch(`${AI_WORKER_URL}/agents`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get agents: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.agents || [];
  } catch (error) {
    console.error('Error getting agents:', error);
    throw error;
  }
}

/**
 * Get information about a specific agent
 */
export async function getAgentInfo(agentId: string): Promise<AgentInfo | null> {
  try {
    const response = await fetch(`${AI_WORKER_URL}/agents/${agentId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorText = await response.text();
      throw new Error(`Failed to get agent info: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting agent info:', error);
    throw error;
  }
}

/**
 * Get user's chat list
 */
export async function getUserChats(limit: number = 50, offset: number = 0): Promise<StoredChat[]> {
  try {
    const response = await fetch(`${AI_WORKER_URL}/chats?limit=${limit}&offset=${offset}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chats API error:', response.status, errorText);
      // Return empty array instead of throwing to prevent UI errors
      return [];
    }

    const data = await response.json();
    return data.chats || [];
  } catch (error) {
    console.error('Error getting user chats:', error);
    // Return empty array instead of throwing to prevent UI errors
    return [];
  }
}

/**
 * Get messages for a specific chat
 */
export async function getChatMessages(chatId: string): Promise<StoredMessage[]> {
  try {
    const response = await fetch(`${AI_WORKER_URL}/chats/${chatId}/messages`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get chat messages: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error('Error getting chat messages:', error);
    throw error;
  }
}

/**
 * Get user usage limits
 */
export async function getUserUsageLimits(): Promise<UsageLimits> {
  try {
    const response = await fetch(`${AI_WORKER_URL}/usage`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get usage limits: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
  return data;
  } catch (error) {
    console.error('Error getting usage limits:', error);
    throw error;
  }
}

/**
 * Delete a chat
 */
export async function deleteChat(chatId: string): Promise<boolean> {
  try {
    const response = await fetch(`${AI_WORKER_URL}/chats/${chatId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Delete chat API error:', response.status, errorText);
      return false;
    }

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    return false;
  }
}
