import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { USE_LOCAL_DB } from '../services/config';
import {
  initDb, localLogin, localRegister, localGetWallet,
  localTopup, localDebit, localGetTransactions,
} from '../services/localDb';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  label: string;
  amount: number;
  date: string;
  icon: string;
}

export interface AppUser {
  id: number;
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
  jojPoints: number;
  transactions: Transaction[];
  cart: Record<string, number>;
  notifications: boolean;
  liveAlerts: boolean;
  transportAlerts: boolean;
  authError: string | null;
  authLoading: boolean;
  sessionRestored: boolean;
}

// ─── Storage Keys (only for prefs + session pointer) ─────────────────────────

const KEY_SESSION  = '@joj_session_user_id';
const KEY_THEME    = '@joj_theme';
const KEY_LANGUAGE = '@joj_language';

// ─── Resend ───────────────────────────────────────────────────────────────────

const RESEND_API_KEY = process.env.EXPO_PUBLIC_RESEND_API_KEY ?? '';

async function sendWelcomeEmail(name: string, email: string, accreditation: string) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Birame JOJ <onboarding@resend.dev>',
        to: [email],
        subject: 'Bienvenue aux Jeux de la Francophonie 2026 !',
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#070A14;color:#fff;border-radius:16px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#FF8450,#E6461C);padding:32px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">Birame</h1>
              <p style="margin:6px 0 0;font-size:13px;opacity:0.85;letter-spacing:1px;">JOJ DAKAR 2026</p>
            </div>
            <div style="padding:32px;">
              <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;">Bienvenue, ${name} !</h2>
              <p style="color:rgba(255,255,255,0.65);line-height:1.6;margin:0 0 24px;">
                Votre compte Birame a bien été créé. Vous faites maintenant partie de la communauté des Jeux de la Francophonie Dakar 2026.
              </p>
              <div style="background:rgba(255,107,53,0.12);border:1px solid rgba(255,107,53,0.3);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.45);letter-spacing:1px;text-transform:uppercase;">Numéro d'accréditation</p>
                <p style="margin:0;font-size:18px;font-weight:700;color:#FF8450;letter-spacing:1px;">${accreditation}</p>
              </div>
              <p style="color:rgba(255,255,255,0.45);font-size:13px;line-height:1.6;margin:0;">
                Utilisez l'application Birame pour accéder aux événements, gérer vos tickets, votre portefeuille JOJ et bien plus encore.
              </p>
            </div>
            <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.07);text-align:center;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);">© 2026 Jeux de la Francophonie · Dakar, Sénégal</p>
            </div>
          </div>
        `,
      }),
    });
  } catch {
    // fire-and-forget
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function formatTxDate(isoString: string): string {
  const d = new Date(isoString);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return isToday ? `Aujourd'hui · ${time}` : `${d.toLocaleDateString('fr-FR')} · ${time}`;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'LOGIN_SUCCESS'; payload: { user: AppUser; balance: number; points: number; transactions: Transaction[] } }
  | { type: 'LOGOUT' }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOADING'; payload: boolean }
  | { type: 'CLEAR_AUTH_ERROR' }
  | { type: 'SESSION_RESTORED' }
  | { type: 'SET_THEME'; payload: 'dark' | 'light' }
  | { type: 'SET_LANGUAGE'; payload: 'fr' | 'en' | 'ar' }
  | { type: 'WALLET_UPDATED'; payload: { balance: number; jojPoints: number; tx?: Transaction } }
  | { type: 'ADD_TO_CART'; payload: { itemId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_NOTIFICATIONS'; payload: boolean }
  | { type: 'SET_LIVE_ALERTS'; payload: boolean }
  | { type: 'SET_TRANSPORT_ALERTS'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<AppUser> }
  | { type: 'SPEND_POINTS'; payload: number }
  | { type: 'RESTORE_PREFS'; payload: { theme?: 'dark' | 'light'; language?: 'fr' | 'en' | 'ar' } };

const initialState: AppState = {
  isLoggedIn: false,
  user: null,
  theme: 'dark',
  language: 'fr',
  walletBalance: 0,
  jojPoints: 0,
  transactions: [],
  cart: {},
  notifications: true,
  liveAlerts: true,
  transportAlerts: false,
  authError: null,
  authLoading: false,
  sessionRestored: false,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        walletBalance: action.payload.balance,
        jojPoints: action.payload.points,
        transactions: action.payload.transactions,
        authError: null,
        authLoading: false,
        sessionRestored: true,
      };
    case 'LOGOUT':
      return { ...initialState, theme: state.theme, language: state.language, sessionRestored: true };
    case 'AUTH_ERROR':
      return { ...state, authError: action.payload, authLoading: false };
    case 'AUTH_LOADING':
      return { ...state, authLoading: action.payload, authError: null };
    case 'CLEAR_AUTH_ERROR':
      return { ...state, authError: null };
    case 'SESSION_RESTORED':
      return { ...state, sessionRestored: true };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'WALLET_UPDATED': {
      const txs = action.payload.tx
        ? [action.payload.tx, ...state.transactions]
        : state.transactions;
      return { ...state, walletBalance: action.payload.balance, jojPoints: action.payload.jojPoints, transactions: txs };
    }
    case 'ADD_TO_CART': {
      const current = state.cart[action.payload.itemId] || 0;
      return { ...state, cart: { ...state.cart, [action.payload.itemId]: current + action.payload.quantity } };
    }
    case 'REMOVE_FROM_CART': {
      const newCart = { ...state.cart };
      const qty = newCart[action.payload] || 0;
      if (qty <= 1) delete newCart[action.payload];
      else newCart[action.payload] = qty - 1;
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
    case 'SPEND_POINTS':
      return { ...state, jojPoints: Math.max(0, state.jojPoints - action.payload) };
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

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  login: (email: string, password: string) => Promise<void>;
  register: (params: { name: string; email: string; password: string; country: string; countryCode: string; role: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  topUp: (amount: number, method: string) => Promise<void>;
  debit: (amount: number, label: string, icon?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Restore prefs + session on startup
  useEffect(() => {
    (async () => {
      try {
        if (USE_LOCAL_DB) await initDb();

        const [theme, language, sessionUserId] = await Promise.all([
          AsyncStorage.getItem(KEY_THEME),
          AsyncStorage.getItem(KEY_LANGUAGE),
          AsyncStorage.getItem(KEY_SESSION),
        ]);

        if (theme || language) {
          dispatch({
            type: 'RESTORE_PREFS',
            payload: {
              theme: (theme as 'dark' | 'light') || undefined,
              language: (language as 'fr' | 'en' | 'ar') || undefined,
            },
          });
        }

        if (sessionUserId) {
          const userId = parseInt(sessionUserId, 10);
          const userSnapshot = await AsyncStorage.getItem(`@joj_user_${sessionUserId}`);
          if (userSnapshot) {
            const user: AppUser = JSON.parse(userSnapshot);
            const [walletData, txData] = await Promise.all([
              USE_LOCAL_DB ? localGetWallet(userId) : api.wallet.get(userId),
              USE_LOCAL_DB ? localGetTransactions(userId) : api.wallet.transactions(userId),
            ]);
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user,
                balance: walletData.balance,
                points: walletData.jojPoints,
                transactions: txData.map(t => ({
                  id: t.id,
                  type: t.type,
                  label: t.label,
                  amount: t.amount,
                  date: formatTxDate(t.created_at),
                  icon: t.icon,
                })),
              },
            });
            return;
          }
        }
        dispatch({ type: 'SESSION_RESTORED' });
      } catch {
        dispatch({ type: 'SESSION_RESTORED' });
      }
    })();
  }, []);

  // Persist theme and language to AsyncStorage (prefs only)
  useEffect(() => { AsyncStorage.setItem(KEY_THEME, state.theme).catch(() => {}); }, [state.theme]);
  useEffect(() => { AsyncStorage.setItem(KEY_LANGUAGE, state.language).catch(() => {}); }, [state.language]);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_LOADING', payload: true });
    try {
      const normalized = normalizeEmail(email);
      if (!normalized || !password) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Veuillez remplir tous les champs.' });
        return;
      }
      const { user: apiUser, wallet } = USE_LOCAL_DB
        ? await localLogin(normalized, password)
        : await api.auth.login(normalized, password);

      const txData = USE_LOCAL_DB
        ? await localGetTransactions(apiUser.id)
        : await api.wallet.transactions(apiUser.id);

      const user: AppUser = { ...apiUser };
      await AsyncStorage.setItem(KEY_SESSION, String(apiUser.id));
      await AsyncStorage.setItem(`@joj_user_${apiUser.id}`, JSON.stringify(user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          balance: wallet.balance,
          points: wallet.jojPoints,
          transactions: txData.map(t => ({
            id: t.id, type: t.type, label: t.label,
            amount: t.amount, date: formatTxDate(t.created_at), icon: t.icon,
          })),
        },
      });
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message || 'Une erreur est survenue. Réessayez.' });
    }
  };

  const register = async (params: {
    name: string; email: string; password: string;
    country: string; countryCode: string; role: string; phone?: string;
  }) => {
    dispatch({ type: 'AUTH_LOADING', payload: true });
    try {
      const normalized = normalizeEmail(params.email);
      if (!params.name.trim() || !normalized || !params.password) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Veuillez remplir tous les champs obligatoires.' });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Adresse email invalide.' });
        return;
      }
      if (params.password.length < 8) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Le mot de passe doit contenir au moins 8 caractères.' });
        return;
      }
      const { user: apiUser, wallet } = USE_LOCAL_DB
        ? await localRegister({ ...params, email: normalized })
        : await api.auth.register({ ...params, email: normalized });

      const user: AppUser = { ...apiUser };
      await AsyncStorage.setItem(KEY_SESSION, String(apiUser.id));
      await AsyncStorage.setItem(`@joj_user_${apiUser.id}`, JSON.stringify(user));

      sendWelcomeEmail(user.name, user.email, user.accreditation);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, balance: wallet.balance, points: wallet.jojPoints, transactions: [] },
      });
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message || 'Une erreur est survenue. Réessayez.' });
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(KEY_SESSION);
    dispatch({ type: 'LOGOUT' });
  };

  const topUp = async (amount: number, method: string) => {
    if (!state.user) return;
    try {
      const result = USE_LOCAL_DB
        ? await localTopup(state.user.id, amount, method)
        : await api.wallet.topup(state.user.id, amount, method);
      const tx: Transaction = { id: result.txRef, type: 'credit', label: `Rechargement ${method}`, amount, date: 'Maintenant', icon: 'add-circle-outline' };
      dispatch({ type: 'WALLET_UPDATED', payload: { balance: result.balance, jojPoints: result.jojPoints, tx } });
    } catch (err: any) {
      console.warn('topUp failed:', err.message);
    }
  };

  const debit = async (amount: number, label: string, icon?: string) => {
    if (!state.user) return;
    try {
      const result = USE_LOCAL_DB
        ? await localDebit(state.user.id, amount, label, icon)
        : await api.wallet.debit(state.user.id, amount, label, icon);
      const tx: Transaction = { id: result.txRef, type: 'debit', label, amount, date: 'Maintenant', icon: icon || 'remove-circle-outline' };
      dispatch({ type: 'WALLET_UPDATED', payload: { balance: result.balance, jojPoints: result.jojPoints, tx } });
    } catch (err: any) {
      console.warn('debit failed:', err.message);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, register, logout, topUp, debit }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
