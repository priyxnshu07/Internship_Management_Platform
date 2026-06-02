const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, roleGuard } = require('../middleware/auth');

// Intern Dashboard
router.get('/intern', authMiddleware, roleGuard('intern'), async (req, res) => {
  try {
    const tasks = await db.query('SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC', [req.user.id]);
    const standups = await db.query('SELECT * FROM standups WHERE intern_id = $1 ORDER BY submitted_at DESC', [req.user.id]);
    const evaluation = await db.query('SELECT * FROM evaluations WHERE intern_id = $1 ORDER BY created_at DESC LIMIT 1', [req.user.id]);

    res.json({
      success: true,
      data: {
        tasks: tasks.rows,
        standups: standups.rows,
        latestEvaluation: evaluation.rows[0] || null
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mentor Dashboard
router.get('/mentor', authMiddleware, roleGuard('admin', 'mentor'), async (req, res) => {
  try {
    const cacheKey = 'mentor_dashboard_data';
    const cachedData = await db.redisClient.get(cacheKey);

    if (cachedData) {
      return res.json({ success: true, data: JSON.parse(cachedData), cached: true });
    }

    const interns = await db.query("SELECT id, name, email FROM users WHERE role = 'intern'");
    const dashboardData = await Promise.all(interns.rows.map(async (intern) => {
      const taskStats = await db.query(
        'SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = \'done\') as completed FROM tasks WHERE assigned_to = $1',
        [intern.id]
      );
      const lastStandup = await db.query(
        'SELECT submitted_at FROM standups WHERE intern_id = $1 ORDER BY submitted_at DESC LIMIT 1',
        [intern.id]
      );

      return {
        intern,
        taskCount: parseInt(taskStats.rows[0].total),
        completedCount: parseInt(taskStats.rows[0].completed),
        lastStandup: lastStandup.rows[0] ? lastStandup.rows[0].submitted_at : null
      };
    }));

    await db.redisClient.setEx(cacheKey, 60, JSON.stringify(dashboardData));

    res.json({ success: true, data: dashboardData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

