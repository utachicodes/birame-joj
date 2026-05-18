import * as SQLite from 'expo-sqlite';
import { ApiUser, ApiWallet, ApiTransaction } from './api';

const db = SQLite.openDatabaseSync('joj_local.db');

// ─── Schema ───────────────────────────────────────────────────────────────────

export async function initDb() {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Visiteur',
      country TEXT NOT NULL DEFAULT 'Sénégal',
      country_code TEXT NOT NULL DEFAULT 'SN',
      phone TEXT DEFAULT '',
      accreditation TEXT NOT NULL UNIQUE,
      avatar TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      balance REAL NOT NULL DEFAULT 0,
      joj_points INTEGER NOT NULL DEFAULT 0,
      card_number TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tx_ref TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      amount REAL NOT NULL,
      icon TEXT NOT NULL DEFAULT 'card-outline',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      ticket_ref TEXT NOT NULL,
      event_name TEXT NOT NULL,
      venue TEXT NOT NULL,
      event_date TEXT NOT NULL,
      event_time TEXT NOT NULL,
      seat TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'General',
      status TEXT NOT NULL DEFAULT 'upcoming',
      icon TEXT NOT NULL DEFAULT 'ticket-outline',
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_ref TEXT NOT NULL UNIQUE,
      sport TEXT NOT NULL,
      match_name TEXT NOT NULL,
      home_code TEXT NOT NULL DEFAULT '',
      away_code TEXT NOT NULL DEFAULT '',
      venue TEXT NOT NULL,
      event_time TEXT NOT NULL,
      event_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'upcoming',
      category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS live_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      score_ref TEXT NOT NULL UNIQUE,
      sport TEXT NOT NULL,
      home_team TEXT NOT NULL,
      away_team TEXT NOT NULL,
      home_code TEXT NOT NULL,
      away_code TEXT NOT NULL,
      home_score INTEGER NOT NULL DEFAULT 0,
      away_score INTEGER NOT NULL DEFAULT 0,
      period TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS medals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country TEXT NOT NULL,
      country_code TEXT NOT NULL UNIQUE,
      gold INTEGER NOT NULL DEFAULT 0,
      silver INTEGER NOT NULL DEFAULT 0,
      bronze INTEGER NOT NULL DEFAULT 0
    );
  `);

  await seedStaticData();
}

async function seedStaticData() {
  const [{ count }] = await db.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM events');
  if (count > 0) return;

  await db.execAsync(`
    INSERT OR IGNORE INTO events (event_ref,sport,match_name,home_code,away_code,venue,event_time,event_date,status,category) VALUES
      ('E001','Basketball','Sénégal vs Côte d''Ivoire','SN','CI','Dakar Arena','14:00','28 Jul','upcoming','Phase de groupes'),
      ('E002','Football','Mali vs Cameroun','ML','CM','Stade LSS','16:30','28 Jul','upcoming','Quart de finale'),
      ('E003','Natation','Finale 100m libre','','','Piscine Olympique','11:00','28 Jul','live','Finale'),
      ('E004','Athlétisme','100m hommes','','','Stade Iba Mar Diop','20:30','30 Jul','upcoming','Demi-finale'),
      ('E005','Judo','Finale 66kg','','','Palais des Sports','15:00','28 Jul','finished','Finale'),
      ('E006','Football','Sénégal vs Ghana','SN','GH','Stade LSS','19:00','30 Jul','upcoming','Demi-finale'),
      ('E007','Basketball','Maroc vs Nigeria','MA','NG','Dakar Arena','18:00','31 Jul','upcoming','Quart de finale'),
      ('E008','Handball','Sénégal vs Tunisie','SN','TN','Palais des Sports','16:00','01 Aug','upcoming','Phase de groupes');

    INSERT OR IGNORE INTO live_scores (score_ref,sport,home_team,away_team,home_code,away_code,home_score,away_score,period) VALUES
      ('L001','Basketball','Sénégal','Nigéria','SN','NG',67,54,'Q3 · 5:23'),
      ('L002','Football','Guinée','Bénin','GN','BJ',1,1,'72'''),
      ('L003','Handball','Maroc','Tunisie','MA','TN',24,19,'Mi-temps 2');

    INSERT OR IGNORE INTO medals (country,country_code,gold,silver,bronze) VALUES
      ('Sénégal','SN',3,2,1),('Maroc','MA',2,3,2),('Côte d''Ivoire','CI',2,1,4),
      ('Nigeria','NG',1,2,2),('Cameroun','CM',1,1,3),('Tunisie','TN',1,0,2),
      ('Mali','ML',0,2,1),('Ghana','GH',0,1,2);
  `);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateAccreditation(role: string) {
  const codes: Record<string, string> = { Visiteur:'VIS', Athlète:'ATH', Journaliste:'JNL', Staff:'STF', Volontaire:'VOL' };
  return `JOJ-2026-${codes[role] ?? 'VIS'}-${Math.floor(10000 + Math.random() * 90000)}`;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function localRegister(params: {
  email: string; password: string; name: string;
  role?: string; country?: string; countryCode?: string; phone?: string;
}): Promise<{ user: ApiUser; wallet: ApiWallet }> {
  const email = params.email.trim().toLowerCase();
  const existing = await db.getFirstAsync<{ id: number }>('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) throw new Error('Email déjà enregistré');

  const accreditation = generateAccreditation(params.role || 'Visiteur');
  const avatar = params.name.slice(0, 2).toUpperCase();
  const cardNumber = String(Math.floor(1000 + Math.random() * 9000));

  const result = await db.runAsync(
    `INSERT INTO users (email,password,name,role,country,country_code,phone,accreditation,avatar)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [email, params.password, params.name, params.role || 'Visiteur', params.country || 'Sénégal',
     params.countryCode || 'SN', params.phone || '', accreditation, avatar]
  );
  const userId = result.lastInsertRowId;

  await db.runAsync('INSERT INTO wallets (user_id,balance,joj_points,card_number) VALUES (?,0,0,?)', [userId, cardNumber]);

  const defaultTickets = [
    [userId,'T001','Cérémonie d\'ouverture','Stade Léopold Sédar Senghor','27 Jul 2026','19:00','Section A · Rangée 12 · Siège 34','VIP','active','star'],
    [userId,'T002','Basketball - Phase de groupes','Dakar Arena','28 Jul 2026','14:00','Tribune Nord · Siège 88','General','active','basketball-outline'],
    [userId,'T003','Athlétisme - 100m Final','Stade Iba Mar Diop','30 Jul 2026','20:30','Pelouse · Zone B','General','upcoming','walk-outline'],
    [userId,'TP001','Pass Transport JOJ','Navettes officielles','Validité: 27 Jul - 06 Août','Toute la journée','Trajets illimités','Transport','active','bus-outline'],
  ];
  for (const t of defaultTickets) {
    await db.runAsync(
      `INSERT INTO tickets (user_id,ticket_ref,event_name,venue,event_date,event_time,seat,category,status,icon) VALUES (?,?,?,?,?,?,?,?,?,?)`, t
    );
  }

  const user: ApiUser = { id: userId, email, name: params.name, role: params.role || 'Visiteur',
    country: params.country || 'Sénégal', countryCode: params.countryCode || 'SN',
    phone: params.phone || '', accreditation, avatar };
  return { user, wallet: { balance: 0, jojPoints: 0, cardNumber } };
}

export async function localLogin(email: string, password: string): Promise<{ user: ApiUser; wallet: ApiWallet }> {
  const normalized = email.trim().toLowerCase();
  const row = await db.getFirstAsync<any>(
    'SELECT u.*, w.balance, w.joj_points, w.card_number FROM users u LEFT JOIN wallets w ON w.user_id = u.id WHERE u.email = ?',
    [normalized]
  );
  if (!row) throw new Error('Compte introuvable');
  if (row.password !== password) throw new Error('Mot de passe incorrect');

  const user: ApiUser = { id: row.id, email: row.email, name: row.name, role: row.role,
    country: row.country, countryCode: row.country_code, phone: row.phone,
    accreditation: row.accreditation, avatar: row.avatar };
  return { user, wallet: { balance: row.balance, jojPoints: row.joj_points, cardNumber: row.card_number } };
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export async function localGetWallet(userId: number): Promise<ApiWallet> {
  const row = await db.getFirstAsync<any>('SELECT balance, joj_points, card_number FROM wallets WHERE user_id = ?', [userId]);
  if (!row) throw new Error('Wallet introuvable');
  return { balance: row.balance, jojPoints: row.joj_points, cardNumber: row.card_number };
}

export async function localTopup(userId: number, amount: number, method: string) {
  await db.runAsync('UPDATE wallets SET balance = balance + ? WHERE user_id = ?', [amount, userId]);
  const txRef = `TX${Date.now()}`;
  await db.runAsync(
    'INSERT INTO transactions (user_id,tx_ref,type,label,amount,icon) VALUES (?,?,?,?,?,?)',
    [userId, txRef, 'credit', `Rechargement ${method}`, amount, 'add-circle-outline']
  );
  const row = await db.getFirstAsync<any>('SELECT balance, joj_points FROM wallets WHERE user_id = ?', [userId]);
  return { balance: row.balance, jojPoints: row.joj_points, txRef };
}

export async function localDebit(userId: number, amount: number, label: string, icon?: string) {
  const wallet = await db.getFirstAsync<any>('SELECT balance FROM wallets WHERE user_id = ?', [userId]);
  if (!wallet || wallet.balance < amount) throw new Error('Solde insuffisant');
  const pointsEarned = Math.floor(amount / 100);
  await db.runAsync(
    'UPDATE wallets SET balance = balance - ?, joj_points = joj_points + ? WHERE user_id = ?',
    [amount, pointsEarned, userId]
  );
  const txRef = `TX${Date.now()}`;
  await db.runAsync(
    'INSERT INTO transactions (user_id,tx_ref,type,label,amount,icon) VALUES (?,?,?,?,?,?)',
    [userId, txRef, 'debit', label, amount, icon || 'cart-outline']
  );
  const row = await db.getFirstAsync<any>('SELECT balance, joj_points FROM wallets WHERE user_id = ?', [userId]);
  return { balance: row.balance, jojPoints: row.joj_points, pointsEarned, txRef };
}

export async function localGetTransactions(userId: number): Promise<ApiTransaction[]> {
  const rows = await db.getAllAsync<any>(
    'SELECT tx_ref AS id, type, label, amount, icon, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [userId]
  );
  return rows;
}

// ─── Tickets ──────────────────────────────────────────────────────────────────

export async function localGetTickets(userId: number) {
  return db.getAllAsync<any>(
    'SELECT ticket_ref AS id, event_name AS event, venue, event_date AS date, event_time AS time, seat, category AS type, status, icon FROM tickets WHERE user_id = ?',
    [userId]
  );
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function localGetEvents(params?: { date?: string; sport?: string }) {
  let query = 'SELECT event_ref AS id, sport, match_name AS match_name, home_code AS homeCode, away_code AS awayCode, venue, event_time AS time, event_date AS date, status, category FROM events';
  const args: string[] = [];
  const filters: string[] = [];
  if (params?.date) { filters.push('event_date = ?'); args.push(params.date); }
  if (params?.sport) { filters.push('sport = ?'); args.push(params.sport); }
  if (filters.length) query += ' WHERE ' + filters.join(' AND ');
  query += ' ORDER BY event_time ASC';
  return db.getAllAsync<any>(query, args);
}

export async function localGetLiveScores() {
  return db.getAllAsync<any>(
    'SELECT score_ref AS id, sport, home_team AS homeTeam, away_team AS awayTeam, home_code AS homeCode, away_code AS awayCode, home_score AS homeScore, away_score AS awayScore, period FROM live_scores'
  );
}

export async function localGetMedals() {
  return db.getAllAsync<any>(
    'SELECT ROW_NUMBER() OVER (ORDER BY gold DESC, silver DESC, bronze DESC) AS rank, country, country_code AS code, gold, silver, bronze FROM medals ORDER BY gold DESC, silver DESC, bronze DESC'
  );
}
