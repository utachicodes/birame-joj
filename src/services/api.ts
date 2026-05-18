const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

export interface ApiUser {
  id: number;
  email: string;
  name: string;
  role: string;
  country: string;
  countryCode: string;
  phone: string;
  accreditation: string;
  avatar: string;
}

export interface ApiWallet {
  balance: number;
  jojPoints: number;
  cardNumber: string;
}

export interface ApiTransaction {
  id: string;
  type: 'credit' | 'debit';
  label: string;
  amount: number;
  icon: string;
  created_at: string;
}

export const api = {
  auth: {
    register: (body: {
      email: string; password: string; name: string;
      role?: string; country?: string; countryCode?: string; phone?: string;
    }) => request<{ user: ApiUser; wallet: ApiWallet }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

    login: (email: string, password: string) =>
      request<{ user: ApiUser; wallet: ApiWallet }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  },

  wallet: {
    get: (userId: number) => request<ApiWallet>(`/wallet/${userId}`),

    topup: (userId: number, amount: number, method: string) =>
      request<{ balance: number; jojPoints: number; txRef: string }>(`/wallet/${userId}/topup`, {
        method: 'POST', body: JSON.stringify({ amount, method }),
      }),

    debit: (userId: number, amount: number, label: string, icon?: string) =>
      request<{ balance: number; jojPoints: number; pointsEarned: number; txRef: string }>(`/wallet/${userId}/debit`, {
        method: 'POST', body: JSON.stringify({ amount, label, icon }),
      }),

    transactions: (userId: number) => request<ApiTransaction[]>(`/wallet/${userId}/transactions`),
  },

  tickets: {
    get: (userId: number) => request<any[]>(`/tickets/${userId}`),
  },

  events: {
    list: (params?: { date?: string; sport?: string }) => {
      const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
      return request<any[]>(`/events${qs}`);
    },
    live: () => request<any[]>('/events/live'),
    medals: () => request<any[]>('/events/medals'),
  },
};
