const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/standups', require('./routes/standups'));
app.use('/api/evaluations', require('./routes/evaluations'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Initialize DB and Start Server
db.initializeDB().then(() => {
  app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
