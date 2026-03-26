export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface SignupCredentials {
  fullName: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type Sentiment = 'happy' | 'sad' | 'stress' | 'anxiety' | 'neutral';

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant';
  sentiment?: Sentiment;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: 1 | 2 | 3 | 4 | 5; // 1: very low, 5: very high
  label: string;
  note?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalChats: number;
  moodAverage: number;
  streakDays: number;
  sentimentDistribution: Record<Sentiment, number>;
}
