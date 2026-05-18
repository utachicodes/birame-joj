const express = require('express');
const pool = require('../db');
const { walletRules, handleValidation } = require('../middleware/validate');
const { param } = require('express-validator');
const router = express.Router();

const userIdRule = [param('userId').isInt({ min: 1 }).withMessage('userId invalide')];

// GET /wallet/:userId
router.get('/:userId', userIdRule, handleValidation, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT balance, joj_points, card_number FROM wallets WHERE user_id = ?', [req.params.userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Wallet introuvable' });
    const w = rows[0];
    res.json({ balance: parseFloat(w.balance), jojPoints: w.joj_points, cardNumber: w.card_number });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /wallet/:userId/topup
router.post('/:userId/topup', walletRules, handleValidation, async (req, res) => {
  const { amount, method } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('UPDATE wallets SET balance = balance + ? WHERE user_id = ?', [amount, req.params.userId]);
    const txRef = `TX${Date.now()}`;
    await conn.execute(
      'INSERT INTO transactions (user_id,tx_ref,type,label,amount,icon) VALUES (?,?,?,?,?,?)',
      [req.params.userId, txRef, 'credit', `Rechargement ${method || 'Orange Money'}`, amount, 'add-circle-outline']
    );
    const [rows] = await conn.execute('SELECT balance, joj_points FROM wallets WHERE user_id = ?', [req.params.userId]);
    await conn.commit();
    res.json({ balance: parseFloat(rows[0].balance), jojPoints: rows[0].joj_points, txRef });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    conn.release();
  }
});

// POST /wallet/:userId/debit
router.post('/:userId/debit', walletRules, handleValidation, async (req, res) => {
  const { amount, label, icon } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [walletRows] = await conn.execute('SELECT balance FROM wallets WHERE user_id = ?', [req.params.userId]);
    if (walletRows.length === 0 || parseFloat(walletRows[0].balance) < amount) {
      await conn.rollback();
      return res.status(400).json({ error: 'Solde insuffisant' });
    }
    const pointsEarned = Math.floor(amount / 100);
    await conn.execute(
      'UPDATE wallets SET balance = balance - ?, joj_points = joj_points + ? WHERE user_id = ?',
      [amount, pointsEarned, req.params.userId]
    );
    const txRef = `TX${Date.now()}`;
    await conn.execute(
      'INSERT INTO transactions (user_id,tx_ref,type,label,amount,icon) VALUES (?,?,?,?,?,?)',
      [req.params.userId, txRef, 'debit', label || 'Achat', amount, icon || 'cart-outline']
    );
    const [rows] = await conn.execute('SELECT balance, joj_points FROM wallets WHERE user_id = ?', [req.params.userId]);
    await conn.commit();
    res.json({ balance: parseFloat(rows[0].balance), jojPoints: rows[0].joj_points, pointsEarned, txRef });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    conn.release();
  }
});

// GET /wallet/:userId/transactions
router.get('/:userId/transactions', userIdRule, handleValidation, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT tx_ref AS id, type, label, amount, icon, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.params.userId]
    );
    res.json(rows.map(r => ({ ...r, amount: parseFloat(r.amount) })));
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
