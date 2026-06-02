const { Pool } = require('pg');
const redis = require('redis');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://admin:secret@localhost:5432/internship_db',
});

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

const initializeDB = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');

    // Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('admin','mentor','intern')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT,
        description TEXT,
        status TEXT DEFAULT 'todo',
        assigned_to INT REFERENCES users(id),
        assigned_by INT REFERENCES users(id),
        due_date DATE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS standups (
        id SERIAL PRIMARY KEY,
        intern_id INT REFERENCES users(id),
        yesterday TEXT,
        today TEXT,
        blockers TEXT,
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS evaluations (
        id SERIAL PRIMARY KEY,
        intern_id INT REFERENCES users(id),
        reviewer_id INT REFERENCES users(id),
        score INT CHECK(score BETWEEN 1 AND 10),
        feedback TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Seed Data
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log('Seeding initial data...');
      
      const adminPass = await bcrypt.hash('admin123', 10);
      const mentorPass = await bcrypt.hash('mentor123', 10);
      const internPass = await bcrypt.hash('intern123', 10);

      const users = await pool.query(`
        INSERT INTO users (name, email, password, role) VALUES
        ('Super Admin', 'admin@intern.dev', $1, 'admin'),
        ('Mentor One', 'mentor1@intern.dev', $2, 'mentor'),
        ('Mentor Two', 'mentor2@intern.dev', $2, 'mentor'),
        ('Intern One', 'intern1@intern.dev', $3, 'intern'),
        ('Intern Two', 'intern2@intern.dev', $3, 'intern'),
        ('Intern Three', 'intern3@intern.dev', $3, 'intern')
        RETURNING id, role, email
      `, [adminPass, mentorPass, internPass]);

      const userMap = {};
      users.rows.forEach(u => {
        if (u.email === 'admin@intern.dev') userMap.admin = u.id;
        if (u.email === 'mentor1@intern.dev') userMap.mentor1 = u.id;
        if (u.email === 'intern1@intern.dev') userMap.intern1 = u.id;
      });

      // Seed 3 tasks for intern1
      await pool.query(`
        INSERT INTO tasks (title, description, assigned_to, assigned_by, due_date) VALUES
        ('Setup Environment', 'Install Docker and Node.js', $1, $2, NOW() + INTERVAL '1 day'),
        ('Project Scaffolding', 'Create the base project structure', $1, $2, NOW() + INTERVAL '2 days'),
        ('Auth Implementation', 'Implement JWT authentication', $1, $2, NOW() + INTERVAL '3 days')
      `, [userMap.intern1, userMap.mentor1]);

      // Seed 2 standups for intern1
      await pool.query(`
        INSERT INTO standups (intern_id, yesterday, today, blockers) VALUES
        ($1, 'Researched architecture', 'Setting up Docker', 'None'),
        ($1, 'Finished Docker setup', 'Initializing backend', 'Minor issue with PG connection')
      `, [userMap.intern1]);

      // Seed 1 evaluation for intern1
      await pool.query(`
        INSERT INTO evaluations (intern_id, reviewer_id, score, feedback) VALUES
        ($1, $2, 9, 'Excellent progress on environment setup.')
      `, [userMap.intern1, userMap.mentor1]);

      console.log('Seeding complete.');
    }
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  redisClient,
  initializeDB,
};

