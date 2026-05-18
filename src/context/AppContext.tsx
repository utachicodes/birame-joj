import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // persistent key-value store on device
import { TRANSACTIONS } from '../data/mock'; // seed data (not used at runtime — kept for reference)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;       // unique TX identifier, e.g. "TX001"
  type: 'credit' | 'debit'; // credit = money in, debit = money out
  label: string;    // human-readable description shown in the list
  amount: number;   // value in CFA francs (smallest unit, no decimals)
  date: string;     // pre-formatted display string, e.g. "Aujourd'hui · 12:34"
  icon: string;     // Ionicon name rendered beside the transaction row
}

export interface AppUser {
  name: string;         // full display name
  email: string;        // login identifier, always lowercased
  role: string;         // accreditation role: Visiteur, Athlète, etc.
  country: string;      // full country name for display
  countryCode: string;  // ISO alpha-2 code used to render the flag
  accreditation: string; // generated badge number, e.g. "JOJ-2026-VIS-08421"
  phone: string;        // optional, empty string if not provided
  avatar: string;       // two-letter initials derived from the name
}

interface StoredAccount {
  email: string;        // lowercased, used as the storage key
  password: string;     // plain text — good enough for a local mock
  name: string;
  role: string;
  country: string;
  countryCode: string;
  phone: string;
  accreditation: string; // generated at registration, stored once
}

export interface AppState {
  isLoggedIn: boolean;       // drives the root navigator (auth vs. main)
  user: AppUser | null;      // null when logged out
  theme: 'dark' | 'light';  // persisted across restarts
  language: 'fr' | 'en' | 'ar'; // persisted across restarts
  walletBalance: number;     // current balance in CFA francs
  jojPoints: number;         // loyalty points earned from spending
  transactions: Transaction[]; // newest first
  cart: Record<string, number>; // itemId → quantity map
  notifications: boolean;    // master push notification toggle
  liveAlerts: boolean;       // live score push toggle
  transportAlerts: boolean;  // shuttle departure push toggle
  authError: string | null;  // shown under the auth form when set
  authLoading: boolean;      // disables the submit button while in-flight
  sessionRestored: boolean;  // true once the startup async check is done
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEY_ACCOUNTS = '@joj_accounts'; // JSON array of all registered accounts
const KEY_SESSION  = '@joj_session_email'; // email of the currently logged-in user
const KEY_THEME    = '@joj_theme';    // last chosen theme
const KEY_LANGUAGE = '@joj_language'; // last chosen language
const walletKey    = (email: string) => `@joj_wallet_${email}`; // balance per user
const txKey        = (email: string) => `@joj_tx_${email}`;     // tx history per user
const pointsKey    = (email: string) => `@joj_points_${email}`; // points per user

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeEmail(email: string) {
  return email.trim().toLowerCase(); // strip spaces and force lowercase before any comparison
}

function makeAvatar(name: string) {
  return name
    .split(' ')              // split on spaces to get word tokens
    .map((n) => n[0] ?? '') // take the first letter of each word
    .join('')
    .toUpperCase()
    .slice(0, 2); // cap at two characters — fits the avatar circle
}

function generateAccreditation(role: string) {
  const codes: Record<string, string> = {
    Visiteur: 'VIS', Athlète: 'ATH', Journaliste: 'JNL', Staff: 'STF', Volontaire: 'VOL',
  }; // map role names to 3-letter badge codes
  const code = codes[role] ?? 'VIS'; // fall back to visitor if role is unknown
  const num = String(Math.floor(10000 + Math.random() * 90000)); // random 5-digit suffix
  return `JOJ-2026-${code}-${num}`;
}

async function getAccounts(): Promise<StoredAccount[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_ACCOUNTS); // read the JSON blob
    return raw ? JSON.parse(raw) : []; // empty array on first launch
  } catch {
    return []; // storage read failed — treat as no accounts
  }
}

async function saveAccounts(accounts: StoredAccount[]) {
  await AsyncStorage.setItem(KEY_ACCOUNTS, JSON.stringify(accounts)); // overwrite the whole list
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
  | { type: 'RESTORE_PREFS'; payload: { theme?: 'dark' | 'light'; language?: 'fr' | 'en' | 'ar' } };

const initialState: AppState = {
  isLoggedIn: false,       // user starts on the auth screen
  user: null,
  theme: 'dark',           // dark by default
  language: 'fr',          // French by default — app's primary market
  walletBalance: 0,
  jojPoints: 0,
  transactions: [],
  cart: {},
  notifications: true,     // opt-in by default
  liveAlerts: true,        // live scores on by default
  transportAlerts: false,  // shuttle alerts off by default
  authError: null,
  authLoading: false,
  sessionRestored: false,  // becomes true once startup check finishes
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
        authError: null,        // clear any previous error on success
        authLoading: false,
        sessionRestored: true,  // startup check is complete
      };
    case 'LOGOUT':
      return {
        ...initialState,        // reset everything back to defaults
        theme: state.theme,     // keep user's display preferences though
        language: state.language,
        sessionRestored: true,  // don't re-run the startup check
      };
    case 'AUTH_ERROR':
      return { ...state, authError: action.payload, authLoading: false }; // show error, stop spinner
    case 'AUTH_LOADING':
      return { ...state, authLoading: action.payload, authError: null }; // clear old error on new attempt
    case 'CLEAR_AUTH_ERROR':
      return { ...state, authError: null }; // user dismissed the error message
    case 'SESSION_RESTORED':
      return { ...state, sessionRestored: true }; // startup check done, no active session found
    case 'SET_THEME':
      return { ...state, theme: action.payload }; // triggers a persist effect below
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }; // triggers a persist effect below
    case 'TOP_UP': {
      const newBalance = state.walletBalance + action.payload.amount; // add deposited amount
      const newTx: Transaction = {
        id: `TX${Date.now()}`, // timestamp-based ID — unique enough for local data
        type: 'credit',
        label: `Rechargement ${action.payload.method}`, // e.g. "Rechargement Orange Money"
        amount: action.payload.amount,
        date: "Maintenant",    // shown immediately at the top of the history
        icon: 'add-circle-outline',
      };
      return {
        ...state,
        walletBalance: newBalance,
        transactions: [newTx, ...state.transactions], // prepend so newest is first
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
      const pointsEarned = Math.floor(spent / 100); // 1 point per 100 CFA spent
      return {
        ...state,
        walletBalance: Math.max(0, state.walletBalance - spent), // never go below zero
        jojPoints: state.jojPoints + pointsEarned,
        transactions: [newTx, ...state.transactions],
      };
    }
    case 'ADD_TO_CART': {
      const current = state.cart[action.payload.itemId] || 0; // default to 0 if not in cart yet
      return { ...state, cart: { ...state.cart, [action.payload.itemId]: current + action.payload.quantity } };
    }
    case 'REMOVE_FROM_CART': {
      const newCart = { ...state.cart };
      const qty = newCart[action.payload] || 0;
      if (qty <= 1) delete newCart[action.payload]; // remove the key entirely at zero
      else newCart[action.payload] = qty - 1;       // just decrement
      return { ...state, cart: newCart };
    }
    case 'CLEAR_CART':
      return { ...state, cart: {} }; // called after checkout
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_LIVE_ALERTS':
      return { ...state, liveAlerts: action.payload };
    case 'SET_TRANSPORT_ALERTS':
      return { ...state, transportAlerts: action.payload };
    case 'UPDATE_USER':
      if (!state.user) return state; // nothing to update if nobody is logged in
      return { ...state, user: { ...state.user, ...action.payload } }; // merge partial fields
    case 'RESTORE_PREFS':
      return {
        ...state,
        theme: action.payload.theme ?? state.theme,       // only overwrite if a stored value exists
        language: action.payload.language ?? state.language,
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;    // raw dispatch for simple flag toggles
  login: (email: string, password: string) => Promise<void>;
  register: (params: { name: string; email: string; password: string; country: string; countryCode: string; role: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  topUp: (amount: number, method: string) => Promise<void>; // wallet top-up convenience wrapper
}

const AppContext = createContext<AppContextType | undefined>(undefined); // undefined forces the guard in useApp

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Restore prefs + session on mount
  useEffect(() => {
    (async () => {
      try {
        const [theme, language, sessionEmail] = await Promise.all([
          AsyncStorage.getItem(KEY_THEME),
          AsyncStorage.getItem(KEY_LANGUAGE),
          AsyncStorage.getItem(KEY_SESSION), // email stored on last login
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
          const account = accounts.find((a) => a.email === sessionEmail); // match stored session
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
                  avatar: makeAvatar(account.name), // regenerate initials from stored name
                },
                balance: balanceRaw ? parseInt(balanceRaw, 10) : 0,
                points: pointsRaw ? parseInt(pointsRaw, 10) : 0,
                transactions: txRaw ? JSON.parse(txRaw) : [],
              },
            });
            return; // session restored — skip SESSION_RESTORED dispatch below
          }
        }
        dispatch({ type: 'SESSION_RESTORED' }); // no active session found
      } catch {
        dispatch({ type: 'SESSION_RESTORED' }); // storage error — show auth screen
      }
    })();
  }, []); // runs once on mount

  // Persist theme + language changes
  useEffect(() => {
    AsyncStorage.setItem(KEY_THEME, state.theme).catch(() => {}); // fire and forget
  }, [state.theme]);

  useEffect(() => {
    AsyncStorage.setItem(KEY_LANGUAGE, state.language).catch(() => {}); // fire and forget
  }, [state.language]);

  // Persist wallet + transactions whenever they change for a logged-in user
  useEffect(() => {
    if (!state.isLoggedIn || !state.user) return; // nothing to save when logged out
    const email = state.user.email;
    AsyncStorage.setItem(walletKey(email), String(state.walletBalance)).catch(() => {});
    AsyncStorage.setItem(pointsKey(email), String(state.jojPoints)).catch(() => {});
    AsyncStorage.setItem(txKey(email), JSON.stringify(state.transactions)).catch(() => {});
  }, [state.walletBalance, state.jojPoints, state.transactions, state.isLoggedIn, state.user]);

  // ─── Auth functions ────────────────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_LOADING', payload: true }); // show spinner
    try {
      const normalized = normalizeEmail(email);
      if (!normalized || !password) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Veuillez remplir tous les champs.' });
        return;
      }
      const accounts = await getAccounts();
      const account = accounts.find((a) => a.email === normalized); // case-insensitive lookup
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
      await AsyncStorage.setItem(KEY_SESSION, normalized); // persist session for next app open
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
      dispatch({ type: 'AUTH_ERROR', payload: 'Une erreur est survenue. Réessayez.' }); // generic fallback
    }
  };

  const register = async (params: {
    name: string; email: string; password: string;
    country: string; countryCode: string; role: string; phone?: string;
  }) => {
    dispatch({ type: 'AUTH_LOADING', payload: true }); // show spinner
    try {
      const normalized = normalizeEmail(params.email);
      if (!params.name.trim() || !normalized || !params.password) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Veuillez remplir tous les champs obligatoires.' });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Adresse email invalide.' }); // basic format check
        return;
      }
      if (params.password.length < 8) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Le mot de passe doit contenir au moins 8 caractères.' });
        return;
      }
      const accounts = await getAccounts();
      if (accounts.some((a) => a.email === normalized)) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Un compte existe déjà avec cet email.' }); // no duplicates
        return;
      }
      const accreditation = generateAccreditation(params.role); // create badge ID upfront
      const newAccount: StoredAccount = {
        email: normalized,
        password: params.password,
        name: params.name.trim(),
        role: params.role,
        country: params.country,
        countryCode: params.countryCode,
        phone: params.phone ?? '', // optional field
        accreditation,
      };
      await saveAccounts([...accounts, newAccount]); // append to the list
      await AsyncStorage.setItem(KEY_SESSION, normalized); // auto-login after register
      await AsyncStorage.setItem(walletKey(normalized), '0'); // start with empty wallet
      await AsyncStorage.setItem(pointsKey(normalized), '0');
      await AsyncStorage.setItem(txKey(normalized), '[]');   // empty tx history
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
      dispatch({ type: 'AUTH_ERROR', payload: 'Une erreur est survenue. Réessayez.' }); // generic fallback
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(KEY_SESSION); // clear saved session so next open shows auth
    dispatch({ type: 'LOGOUT' });
  };

  const topUp = async (amount: number, method: string) => {
    dispatch({ type: 'TOP_UP', payload: { amount, method } }); // reducer handles balance + tx creation
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, register, logout, topUp }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider'); // catch missing provider early
  return ctx;
}
