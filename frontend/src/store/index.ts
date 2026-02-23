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

interface Incident {
  id: number;
  title: string;
  status: 'active' | 'investigating' | 'mitigated' | 'resolved';
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  created_at: string;
}

interface MetricsState {
  metrics: Record<string, number[]>;
  incidents: Incident[];
  addMetric: (name: string, value: number) => void;
  setIncidents: (incidents: Incident[]) => void;
  addIncident: (incident: Incident) => void;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  metrics: {},
  incidents: [],
  addMetric: (name, value) => set((state) => {
    const current = state.metrics[name] || [];
    const next = [...current, value].slice(-20);
    return {
      metrics: {
        ...state.metrics,
        [name]: next
      }
    };
  }),
  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) => set((state) => ({
    incidents: [incident, ...state.incidents].slice(0, 10)
  })),
}));
