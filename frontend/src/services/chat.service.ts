import { ChatMessage } from '../types';
import { api } from '../lib/api';

export const chatService = {
  getMessages: async (userId: string): Promise<ChatMessage[]> => {
    const response = await api.get('/chat');
    return response.data;
  },

  sendMessage: async (userId: string, message: string): Promise<{ response: string; sentiment: string; id: string; createdAt: string }> => {
    const response = await api.post('/chat', { message });
    return response.data;
  },

  clearHistory: async (userId: string): Promise<void> => {
    await api.delete('/chat');
  }
};