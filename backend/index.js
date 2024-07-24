const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
    req.userId = decoded.userId;
    next();
  });
};

// User registration
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id',
      [username, hashedPassword, email]
    );
    res.json({ message: 'User registered successfully', userId: result.rows[0].id });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

// Create account
app.post('/accounts', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      'INSERT INTO accounts (user_id) VALUES ($1) RETURNING id',
      [req.userId]
    );
    res.json({ accountId: result.rows[0].id });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create account' });
  }
});

// Deposit
app.post('/deposit', verifyToken, async (req, res) => {
  const { accountId, amount } = req.body;
  try {
    await db.query('BEGIN');
    await db.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
      [amount, accountId, req.userId]
    );
    await db.query(
      'INSERT INTO transactions (account_id, type, amount) VALUES ($1, $2, $3)',
      [accountId, 'deposit', amount]
    );
    await db.query('COMMIT');
    res.json({ message: 'Deposit successful' });
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: 'Deposit failed' });
  }
});

// Withdrawal
app.post('/withdraw', verifyToken, async (req, res) => {
  const { accountId, amount } = req.body;
  try {
    await db.query('BEGIN');
    const result = await db.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3 AND balance >= $1 RETURNING id',
      [amount, accountId, req.userId]
    );
    if (result.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient funds or invalid account' });
    }
    await db.query(
      'INSERT INTO transactions (account_id, type, amount) VALUES ($1, $2, $3)',
      [accountId, 'withdrawal', amount]
    );
    await db.query('COMMIT');
    res.json({ message: 'Withdrawal successful' });
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: 'Withdrawal failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});