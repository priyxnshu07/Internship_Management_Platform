const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, roleGuard } = require('../middleware/auth');

// Mentor/Admin only: list evaluations
router.get('/', authMiddleware, roleGuard('admin', 'mentor'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.*, i.name as intern_name, r.name as reviewer_name 
      FROM evaluations e 
      JOIN users i ON e.intern_id = i.id 
      JOIN users r ON e.reviewer_id = r.id 
      ORDER BY e.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mentor/Admin only: create evaluation
router.post('/', authMiddleware, roleGuard('admin', 'mentor'), async (req, res) => {
  const { intern_id, score, feedback } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO evaluations (intern_id, reviewer_id, score, feedback) VALUES ($1, $2, $3, $4) RETURNING *',
      [intern_id, req.user.id, score, feedback]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
