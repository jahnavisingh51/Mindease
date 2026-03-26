import { MoodEntry } from '../types';
import { api } from '../lib/api';

export const moodService = {
  getMoods: async (userId: string): Promise<MoodEntry[]> => {
    const response = await api.get('/mood');
    return response.data;
  },

  logMood: async (userId: string, mood: 1 | 2 | 3 | 4 | 5, label: string, note?: string): Promise<MoodEntry> => {
    const response = await api.post('/mood', { mood, label, note });
    return response.data;
  },

  getStats: async (userId: string) => {
    const response = await api.get('/mood/stats');
    return response.data;
  },

  checkSmartAlert: async (userId: string): Promise<boolean> => {
    // This could also be a backend endpoint, or calculated from moods
    const moods = await moodService.getMoods(userId);
    if (moods.length < 3) return false;
    const lastThree = moods.slice(0, 3);
    return lastThree.every(m => m.mood <= 2);
  },

  getDashboardSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  }
};