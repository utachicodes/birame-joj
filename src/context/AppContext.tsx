import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;       // unique TX identifier, e.g. "TX001"
  type: 'credit' | 'debit';
  label: string;   
  amount: number;  
  date: string;     // pre-formatted display string, e.g. "Aujourd'hui · 12:34"
  icon: string;    
}

export interface AppUser {
  name: string;        
  email: string;       
  role: string;        
  country: string;     
  countryCode: string; 
  accreditation: string; // generated badge number, e.g. "JOJ-2026-VIS-08421"
  phone: string;       
  avatar: string;      
}

interface StoredAccount {
  email: string;       
  password: string;    
  name: string;
  role: string;
  country: string;
  countryCode: string;
  phone: string;
  accreditation: string;
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

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEY_ACCOUNTS = '@joj_accounts';
const KEY_SESSION  = '@joj_session_email';
const KEY_THEME    = '@joj_theme';   
const KEY_LANGUAGE = '@joj_language';
const walletKey    = (email: string) => `@joj_wallet_${email}`;
const txKey        = (email: string) => `@joj_tx_${email}`;    
const pointsKey    = (email: string) => `@joj_points_${email}`;

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
    // fire-and-forget — don't block registration if email fails
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function makeAvatar(name: string) {
  return name
    .split(' ')             
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function generateAccreditation(role: string) {
  const codes: Record<string, string> = {
    Visiteur: 'VIS', Athlète: 'ATH', Journaliste: 'JNL', Staff: 'STF', Volontaire: 'VOL',
  };
  const code = codes[role] ?? 'VIS';
  const num = String(Math.floor(10000 + Math.random() * 90000));
  return `JOJ-2026-${code}-${num}`;
}

async function getAccounts(): Promise<StoredAccount[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_ACCOUNTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveAccounts(accounts: StoredAccount[]) {
  await AsyncStorage.setItem(KEY_ACCOUNTS, JSON.stringify(accounts));
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
  | { type: 'TOP_UP'; payload: { amount: number; method: string } }
  | { type: 'DEBIT_WALLET'; payload: { amount: number; label: string } }
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
  language: 'fr',          // French by default — app's primary market
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
      return {
        ...initialState,       
        theme: state.theme,     // keep user's display preferences though
        language: state.language,
        sessionRestored: true,  // don't re-run the startup check
      };
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
    case 'TOP_UP': {
      const newBalance = state.walletBalance + action.payload.amount;
      const newTx: Transaction = {
        id: `TX${Date.now()}`,
        type: 'credit',
        label: `Rechargement ${action.payload.method}`, // e.g. "Rechargement Orange Money"
        amount: action.payload.amount,
        date: "Maintenant",   
        icon: 'add-circle-outline',
      };
      return {
        ...state,
        walletBalance: newBalance,
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
      const spent = action.payload.amount;
      const pointsEarned = Math.floor(spent / 100);
      return {
        ...state,
        walletBalance: Math.max(0, state.walletBalance - spent),
        jojPoints: state.jojPoints + pointsEarned,
        transactions: [newTx, ...state.transactions],
      };
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

 
  useEffect(() => {
    (async () => {
      try {
        const [theme, language, sessionEmail] = await Promise.all([
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

        if (sessionEmail) {
          const accounts = await getAccounts();
          const account = accounts.find((a) => a.email === sessionEmail);
          if (account) {
            const [balanceRaw, txRaw, pointsRaw] = await Promise.all([
              AsyncStorage.getItem(walletKey(sessionEmail)),
              AsyncStorage.getItem(txKey(sessionEmail)),
              AsyncStorage.getItem(pointsKey(sessionEmail)),
            ]);
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: {
                  name: account.name,
                  email: account.email,
                  role: account.role,
                  country: account.country,
                  countryCode: account.countryCode,
                  accreditation: account.accreditation,
                  phone: account.phone,
                  avatar: makeAvatar(account.name),
                },
                balance: balanceRaw ? parseInt(balanceRaw, 10) : 0,
                points: pointsRaw ? parseInt(pointsRaw, 10) : 0,
                transactions: txRaw ? JSON.parse(txRaw) : [],
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

 
  useEffect(() => {
    AsyncStorage.setItem(KEY_THEME, state.theme).catch(() => {});
  }, [state.theme]);

  useEffect(() => {
    AsyncStorage.setItem(KEY_LANGUAGE, state.language).catch(() => {});
  }, [state.language]);

 
  useEffect(() => {
    if (!state.isLoggedIn || !state.user) return;
    const email = state.user.email;
    AsyncStorage.setItem(walletKey(email), String(state.walletBalance)).catch(() => {});
    AsyncStorage.setItem(pointsKey(email), String(state.jojPoints)).catch(() => {});
    AsyncStorage.setItem(txKey(email), JSON.stringify(state.transactions)).catch(() => {});
  }, [state.walletBalance, state.jojPoints, state.transactions, state.isLoggedIn, state.user]);

 

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_LOADING', payload: true });
    try {
      const normalized = normalizeEmail(email);
      if (!normalized || !password) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Veuillez remplir tous les champs.' });
        return;
      }
      const accounts = await getAccounts();
      const account = accounts.find((a) => a.email === normalized);
      if (!account) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Aucun compte trouvé avec cet email.' });
        return;
      }
      if (account.password !== password) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Mot de passe incorrect.' });
        return;
      }
      const [balanceRaw, txRaw, pointsRaw] = await Promise.all([
        AsyncStorage.getItem(walletKey(normalized)),
        AsyncStorage.getItem(txKey(normalized)),
        AsyncStorage.getItem(pointsKey(normalized)),
      ]);
      await AsyncStorage.setItem(KEY_SESSION, normalized);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: {
            name: account.name,
            email: account.email,
            role: account.role,
            country: account.country,
            countryCode: account.countryCode,
            accreditation: account.accreditation,
            phone: account.phone,
            avatar: makeAvatar(account.name),
          },
          balance: balanceRaw ? parseInt(balanceRaw, 10) : 0,
          points: pointsRaw ? parseInt(pointsRaw, 10) : 0,
          transactions: txRaw ? JSON.parse(txRaw) : [],
        },
      });
    } catch {
      dispatch({ type: 'AUTH_ERROR', payload: 'Une erreur est survenue. Réessayez.' });
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
      const accounts = await getAccounts();
      if (accounts.some((a) => a.email === normalized)) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Un compte existe déjà avec cet email.' });
        return;
      }
      const accreditation = generateAccreditation(params.role);
      const newAccount: StoredAccount = {
        email: normalized,
        password: params.password,
        name: params.name.trim(),
        role: params.role,
        country: params.country,
        countryCode: params.countryCode,
        phone: params.phone ?? '',
        accreditation,
      };
      await saveAccounts([...accounts, newAccount]);
      await AsyncStorage.setItem(KEY_SESSION, normalized);
      await AsyncStorage.setItem(walletKey(normalized), '0');
      await AsyncStorage.setItem(pointsKey(normalized), '0');
      await AsyncStorage.setItem(txKey(normalized), '[]');
      sendWelcomeEmail(newAccount.name, newAccount.email, accreditation);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: {
            name: newAccount.name,
            email: newAccount.email,
            role: newAccount.role,
            country: newAccount.country,
            countryCode: newAccount.countryCode,
            accreditation: newAccount.accreditation,
            phone: newAccount.phone,
            avatar: makeAvatar(newAccount.name),
          },
          balance: 0,
          points: 0,
          transactions: [],
        },
      });
    } catch {
      dispatch({ type: 'AUTH_ERROR', payload: 'Une erreur est survenue. Réessayez.' });
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(KEY_SESSION);
    dispatch({ type: 'LOGOUT' });
  };

  const topUp = async (amount: number, method: string) => {
    dispatch({ type: 'TOP_UP', payload: { amount, method } });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, register, logout, topUp }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
