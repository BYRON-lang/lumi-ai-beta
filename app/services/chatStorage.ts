import { getUserChats, getChatMessages, getUserUsageLimits, deleteChat, type StoredChat, type StoredMessage, type UsageLimits } from '../lib/lumiApi';

// Re-export types for convenience
export type { StoredChat, StoredMessage, UsageLimits };

export interface ChatSession {
  id: string;
  title: string;
  model: string;
  messages: Array<{
    text: string;
    isUser: boolean;
    type?: "text" | "code";
    timestamp?: string;
    agentName?: string;
    agent?: string;
  }>;
  createdAt: number;
  updatedAt: number;
}

export class ChatStorageService {
  private static instance: ChatStorageService;
  private chatCache: Map<string, ChatSession> = new Map();
  private chatListCache: StoredChat[] = [];
  private usageLimitsCache: UsageLimits | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ChatStorageService {
    if (!ChatStorageService.instance) {
      ChatStorageService.instance = new ChatStorageService();
    }
    return ChatStorageService.instance;
  }

  /**
   * Get all user chats
   */
  async getChats(forceRefresh: boolean = false): Promise<StoredChat[]> {
    const now = Date.now();
    
    if (!forceRefresh && this.chatListCache.length > 0 && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      return this.chatListCache;
    }

    try {
      const chats = await getUserChats();
      this.chatListCache = chats;
      this.lastFetchTime = now;
      return chats;
    } catch (error) {
      console.error('Error fetching chats:', error);
      return this.chatListCache; // Return cached data on error
    }
  }

  /**
   * Get a specific chat with its messages
   */
  async getChat(chatId: string, forceRefresh: boolean = false): Promise<ChatSession | null> {
    const now = Date.now();
    
    if (!forceRefresh && this.chatCache.has(chatId)) {
      return this.chatCache.get(chatId)!;
    }

    try {
      const [storedChat, messages] = await Promise.all([
        this.getChatFromList(chatId),
        getChatMessages(chatId)
      ]);

      if (!storedChat) {
        return null;
      }

      const chatSession: ChatSession = {
        id: storedChat.id,
        title: storedChat.title,
        model: storedChat.model,
        messages: messages.map(msg => ({
          text: msg.content,
          isUser: msg.role === 'user',
          type: 'text' as const,
          timestamp: new Date(msg.created_at).toISOString(),
          agentName: msg.role === 'assistant' ? this.getAgentNameFromModel(storedChat.model) : undefined
        })),
        createdAt: storedChat.created_at,
        updatedAt: storedChat.updated_at
      };

      this.chatCache.set(chatId, chatSession);
      return chatSession;
    } catch (error) {
      console.error('Error fetching chat:', error);
      return this.chatCache.get(chatId) || null;
    }
  }

  /**
   * Create a new chat session
   */
  createNewChat(): ChatSession {
    const chatId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: chatId,
      title: 'New Chat',
      model: 'lumi-1.0',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  /**
   * Update a chat session in cache
   */
  updateChat(chatId: string, updates: Partial<ChatSession>): void {
    const existing = this.chatCache.get(chatId);
    if (existing) {
      const updated = { ...existing, ...updates, updatedAt: Date.now() };
      this.chatCache.set(chatId, updated);
    }
  }

  /**
   * Add a message to a chat session
   */
  addMessage(chatId: string, message: ChatSession['messages'][0]): void {
    const chat = this.chatCache.get(chatId);
    if (chat) {
      chat.messages.push(message);
      chat.updatedAt = Date.now();
      this.chatCache.set(chatId, chat);
    }
  }

  /**
   * Update the last message in a chat (for streaming)
   */
  updateLastMessage(chatId: string, content: string): void {
    const chat = this.chatCache.get(chatId);
    if (chat && chat.messages.length > 0) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      if (!lastMessage.isUser) {
        lastMessage.text = content;
        chat.updatedAt = Date.now();
        this.chatCache.set(chatId, chat);
      }
    }
  }

  /**
   * Get usage limits
   */
  async getUsageLimits(forceRefresh: boolean = false): Promise<UsageLimits | null> {
    const now = Date.now();
    
    if (!forceRefresh && this.usageLimitsCache && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      return this.usageLimitsCache;
    }

    try {
      const limits = await getUserUsageLimits();
      this.usageLimitsCache = limits;
      this.lastFetchTime = now;
      return limits;
    } catch (error) {
      console.error('Error fetching usage limits:', error);
      return this.usageLimitsCache;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.chatCache.clear();
    this.chatListCache = [];
    this.usageLimitsCache = null;
    this.lastFetchTime = 0;
  }

  /**
   * Remove a chat from cache
   */
  removeChat(chatId: string): void {
    this.chatCache.delete(chatId);
    this.chatListCache = this.chatListCache.filter(chat => chat.id !== chatId);
  }

  /**
   * Update chat title
   */
  async updateChatTitle(chatId: string, newTitle: string, starred?: boolean): Promise<void> {
    try {
      // Update in the list cache
      const chatIndex = this.chatListCache.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        this.chatListCache[chatIndex] = {
          ...this.chatListCache[chatIndex],
          title: newTitle,
          starred: starred !== undefined ? starred : this.chatListCache[chatIndex].starred
        };
      }

      // Update in the chat cache
      const chat = this.chatCache.get(chatId);
      if (chat) {
        chat.title = newTitle;
        this.chatCache.set(chatId, chat);
      }

      // TODO: Make API call to update on server
      // For now, we'll just update the local cache
    } catch (error) {
      console.error('Error updating chat title:', error);
      throw error;
    }
  }

  /**
   * Delete a chat
   */
  async deleteChat(chatId: string): Promise<void> {
    try {
      // Call API to delete on server
      const success = await deleteChat(chatId);
      if (!success) {
        throw new Error('Failed to delete chat from server');
      }

      // Remove from caches only after successful API call
      this.removeChat(chatId);
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }

  private async getChatFromList(chatId: string): Promise<StoredChat | null> {
    // First check cache
    const cached = this.chatListCache.find(chat => chat.id === chatId);
    if (cached) {
      return cached;
    }

    // If not in cache, refresh the list
    await this.getChats(true);
    return this.chatListCache.find(chat => chat.id === chatId) || null;
  }

  private getAgentNameFromModel(model: string): string {
    switch (model) {
      case 'lumi-1.0':
        return 'Lumi 1.0';
      case 'lumi-agent':
        return 'Lumi Agent';
      default:
        return 'Lumi';
    }
  }
}

// Export singleton instance
export const chatStorage = ChatStorageService.getInstance();
