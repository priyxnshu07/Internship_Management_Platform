const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, roleGuard } = require('../middleware/auth');

// List standups
router.get('/', authMiddleware, async (req, res) => {
  const { intern_id } = req.query;
  try {
    let query = 'SELECT s.*, u.name as intern_name FROM standups s JOIN users u ON s.intern_id = u.id';
    let params = [];

    if (req.user.role === 'intern') {
      query += ' WHERE s.intern_id = $1';
      params.push(req.user.id);
    } else if (intern_id) {
      query += ' WHERE s.intern_id = $1';
      params.push(intern_id);
    }

    query += ' ORDER BY s.submitted_at DESC';
    const result = await db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Intern only: submit standup
router.post('/', authMiddleware, roleGuard('intern'), async (req, res) => {
  const { yesterday, today, blockers } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO standups (intern_id, yesterday, today, blockers) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, yesterday, today, blockers]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
