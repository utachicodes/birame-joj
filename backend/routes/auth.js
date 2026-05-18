const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerRules, loginRules, handleValidation } = require('../middleware/validate');
const router = express.Router();

function generateAccreditation(role) {
  const codes = { Visiteur:'VIS', Athlète:'ATH', Journaliste:'JNL', Staff:'STF', Volontaire:'VOL' };
  const code = codes[role] || 'VIS';
  const num = String(Math.floor(Math.random() * 90000) + 10000);
  return `JOJ-2026-${code}-${num}`;
}

function generateCardNumber() {
  return String(Math.floor(Math.random() * 9000) + 1000);
}

// POST /auth/register  (stricter limit: 10 attempts / 15 min)
router.post('/register', authLimiter, registerRules, handleValidation, async (req, res) => {
  const { email, password, name, role, country, countryCode, phone } = req.body;

  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ error: 'Email déjà enregistré' });

    const hash = await bcrypt.hash(password, 10);
    const accreditation = generateAccreditation(role || 'Visiteur');
    const avatar = name.slice(0, 2).toUpperCase();

    await conn.beginTransaction();
    const [result] = await conn.execute(
      `INSERT INTO users (email,password_hash,name,role,country,country_code,phone,accreditation,avatar)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [email, hash, name, role || 'Visiteur', country || 'Sénégal', countryCode || 'SN', phone || '', accreditation, avatar]
    );
    const userId = result.insertId;
    await conn.execute(
      'INSERT INTO wallets (user_id,balance,joj_points,card_number) VALUES (?,0,0,?)',
      [userId, generateCardNumber()]
    );

    const defaultTickets = [
      [userId,'T001','Cérémonie d\'ouverture','Stade Léopold Sédar Senghor','27 Jul 2026','19:00','Section A · Rangée 12 · Siège 34','VIP','active','star'],
      [userId,'T002','Basketball - Phase de groupes','Dakar Arena','28 Jul 2026','14:00','Tribune Nord · Siège 88','General','active','basketball-outline'],
      [userId,'T003','Athlétisme - 100m Final','Stade Iba Mar Diop','30 Jul 2026','20:30','Pelouse · Zone B','General','upcoming','walk-outline'],
      [userId,'TP001','Pass Transport JOJ','Navettes officielles','Validité: 27 Jul - 06 Août','Toute la journée','Trajets illimités','Transport','active','bus-outline'],
    ];
    for (const t of defaultTickets) {
      await conn.execute(
        `INSERT INTO tickets (user_id,ticket_ref,event_name,venue,event_date,event_time,seat,category,status,icon) VALUES (?,?,?,?,?,?,?,?,?,?)`, t
      );
    }

    await conn.commit();
    const user = { id: userId, email, name, role: role || 'Visiteur', country: country || 'Sénégal', countryCode: countryCode || 'SN', phone: phone || '', accreditation, avatar };
    res.status(201).json({ user, wallet: { balance: 0, jojPoints: 0, cardNumber: generateCardNumber() } });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    conn.release();
  }
});

// POST /auth/login
router.post('/login', authLimiter, loginRules, handleValidation, async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute(
      'SELECT u.*, w.balance, w.joj_points, w.card_number FROM users u LEFT JOIN wallets w ON w.user_id = u.id WHERE u.email = ?',
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Compte introuvable' });

    const row = rows[0];
    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

    const user = { id: row.id, email: row.email, name: row.name, role: row.role, country: row.country, countryCode: row.country_code, phone: row.phone, accreditation: row.accreditation, avatar: row.avatar };
    res.json({ user, wallet: { balance: parseFloat(row.balance), jojPoints: row.joj_points, cardNumber: row.card_number } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
