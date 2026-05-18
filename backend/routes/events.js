const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /events?date=28+Jul&sport=Basketball
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT event_ref AS id, sport, match_name AS `match`, home_code AS homeCode, away_code AS awayCode, venue, event_time AS time, event_date AS date, status, category FROM events';
    const params = [];
    const filters = [];
    if (req.query.date) { filters.push('event_date = ?'); params.push(req.query.date); }
    if (req.query.sport) { filters.push('sport = ?'); params.push(req.query.sport); }
    if (filters.length) query += ' WHERE ' + filters.join(' AND ');
    query += ' ORDER BY event_time ASC';
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /events/live
router.get('/live', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT score_ref AS id, sport, home_team AS homeTeam, away_team AS awayTeam, home_code AS homeCode, away_code AS awayCode, home_score AS homeScore, away_score AS awayScore, period FROM live_scores ORDER BY id',
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /events/medals
router.get('/medals', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT ROW_NUMBER() OVER (ORDER BY gold DESC, silver DESC, bronze DESC) AS `rank`, country, country_code AS code, gold, silver, bronze FROM medals ORDER BY gold DESC, silver DESC, bronze DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
