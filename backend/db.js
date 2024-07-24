const db = require('./database');

async function setupDatabase() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createAccountsTable = `
    CREATE TABLE IF NOT EXISTS accounts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createTransactionsTable = `
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      account_id INTEGER REFERENCES accounts(id),
      type VARCHAR(20) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await db.query(createUsersTable);
    await db.query(createAccountsTable);
    await db.query(createTransactionsTable);
    console.log('Database setup completed');
  } catch (err) {
    console.error('Error setting up database:', err);
  }
}

setupDatabase();
