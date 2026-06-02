const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, roleGuard } = require('../middleware/auth');

// List tasks
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = 'SELECT t.*, u.name as assigned_to_name FROM tasks t JOIN users u ON t.assigned_to = u.id';
    let params = [];

    if (req.user.role === 'intern') {
      query += ' WHERE t.assigned_to = $1';
      params.push(req.user.id);
    }

    query += ' ORDER BY t.created_at DESC';
    const result = await db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mentor/Admin only: create task
router.post('/', authMiddleware, roleGuard('admin', 'mentor'), async (req, res) => {
  const { title, description, assigned_to, due_date } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO tasks (title, description, assigned_to, assigned_by, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, assigned_to, req.user.id, due_date]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update task status
router.patch('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    // Basic check for intern to only update their own tasks
    if (req.user.role === 'intern') {
      const taskCheck = await db.query('SELECT assigned_to FROM tasks WHERE id = $1', [id]);
      if (taskCheck.rows.length === 0 || taskCheck.rows[0].assigned_to !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Forbidden' });
      }
    }

    const result = await db.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
