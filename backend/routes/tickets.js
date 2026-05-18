const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /tickets/:userId
router.get('/:userId', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT ticket_ref AS id, event_name AS event, venue, event_date AS date, event_time AS time, seat, category AS type, status, icon FROM tickets WHERE user_id = ?',
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
