export interface User {
  id: string;
  name: string;
  email: string;
  collegeName?: string;
  branch?: string;
  plan: 'free' | 'pro' | 'unlimited';
  wordCredits: number;
  token?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
