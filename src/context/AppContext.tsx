import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSACTIONS } from '../data/mock';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  label: string;
  amount: number;
  date: string;
  icon: string;
}

export interface AppUser {
  name: string;
  email: string;
  role: string;
  country: string;
  countryCode: string;
  accreditation: string;
  phone: string;
  avatar: string;
}

export interface AppState {
  isLoggedIn: boolean;
  user: AppUser | null;
  theme: 'dark' | 'light';
  language: 'fr' | 'en' | 'ar';
  walletBalance: number;
  transactions: Transaction[];
  cart: Record<string, number>;
  notifications: boolean;
  liveAlerts: boolean;
  transportAlerts: boolean;
}

const INITIAL_USER: AppUser = {
  name: 'Mamadou Diallo',
  email: 'mamadou@joj2026.sn',
  role: 'Visiteur',
  country: 'Sénégal',
  countryCode: 'SN',
  accreditation: 'JOJ-2026-VIS-08421',
  phone: '+221 77 123 4567',
  avatar: 'MD',
};

const initialState: AppState = {
  isLoggedIn: false,
  user: null,
  theme: 'dark',
  language: 'fr',
  walletBalance: 47500,
  transactions: TRANSACTIONS as Transaction[],
  cart: {},
  notifications: true,
  liveAlerts: true,
  transportAlerts: false,
};

type Action =
  | { type: 'LOGIN'; payload?: { name?: string; email?: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_THEME'; payload: 'dark' | 'light' }
  | { type: 'SET_LANGUAGE'; payload: 'fr' | 'en' | 'ar' }
  | { type: 'TOP_UP'; payload: number }
  | { type: 'DEBIT_WALLET'; payload: { amount: number; label: string } }
  | { type: 'ADD_TO_CART'; payload: { itemId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_NOTIFICATIONS'; payload: boolean }
  | { type: 'SET_LIVE_ALERTS'; payload: boolean }
  | { type: 'SET_TRANSPORT_ALERTS'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<AppUser> }
  | { type: 'RESTORE_PREFS'; payload: { theme?: 'dark' | 'light'; language?: 'fr' | 'en' | 'ar' } };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN': {
      const user = { ...INITIAL_USER };
      if (action.payload?.name) user.name = action.payload.name;
      if (action.payload?.email) user.email = action.payload.email;
      const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      user.avatar = initials;
      return { ...state, isLoggedIn: true, user };
    }
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, user: null, cart: {} };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'TOP_UP': {
      const newTx: Transaction = {
        id: `TX${Date.now()}`,
        type: 'credit',
        label: 'Rechargement',
        amount: action.payload,
        date: "Maintenant",
        icon: 'add-circle-outline',
      };
      return {
        ...state,
        walletBalance: state.walletBalance + action.payload,
        transactions: [newTx, ...state.transactions],
      };
    }
    case 'DEBIT_WALLET': {
      const newTx: Transaction = {
        id: `TX${Date.now()}`,
        type: 'debit',
        label: action.payload.label,
        amount: action.payload.amount,
        date: "Maintenant",
        icon: 'remove-circle-outline',
      };
      return {
        ...state,
        walletBalance: Math.max(0, state.walletBalance - action.payload.amount),
        transactions: [newTx, ...state.transactions],
      };
    }
    case 'ADD_TO_CART': {
      const current = state.cart[action.payload.itemId] || 0;
      return {
        ...state,
        cart: { ...state.cart, [action.payload.itemId]: current + action.payload.quantity },
      };
    }
    case 'REMOVE_FROM_CART': {
      const newCart = { ...state.cart };
      const qty = newCart[action.payload] || 0;
      if (qty <= 1) {
        delete newCart[action.payload];
      } else {
        newCart[action.payload] = qty - 1;
      }
      return { ...state, cart: newCart };
    }
    case 'CLEAR_CART':
      return { ...state, cart: {} };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_LIVE_ALERTS':
      return { ...state, liveAlerts: action.payload };
    case 'SET_TRANSPORT_ALERTS':
      return { ...state, transportAlerts: action.payload };
    case 'UPDATE_USER':
      if (!state.user) return state;
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'RESTORE_PREFS':
      return {
        ...state,
        theme: action.payload.theme ?? state.theme,
        language: action.payload.language ?? state.language,
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const theme = await AsyncStorage.getItem('@joj_theme');
        const language = await AsyncStorage.getItem('@joj_language');
        dispatch({
          type: 'RESTORE_PREFS',
          payload: {
            theme: (theme as 'dark' | 'light') || undefined,
            language: (language as 'fr' | 'en' | 'ar') || undefined,
          },
        });
      } catch (_) {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@joj_theme', state.theme).catch(() => {});
  }, [state.theme]);

  useEffect(() => {
    AsyncStorage.setItem('@joj_language', state.language).catch(() => {});
  }, [state.language]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
