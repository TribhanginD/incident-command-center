import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: { username: string; role: string } | null;
  setAuth: (token: string, user: { username: string; role: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));

interface MetricsState {
  metrics: Record<string, number[]>;
  addMetric: (name: string, value: number) => void;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  metrics: {},
  addMetric: (name, value) => set((state) => {
    const current = state.metrics[name] || [];
    const next = [...current, value].slice(-20); // Keep last 20 points
    return {
      metrics: {
        ...state.metrics,
        [name]: next
      }
    };
  }),
}));
