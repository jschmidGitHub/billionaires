import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'sqlite_db.db');
console.log("Opening db at path: ", dbPath);
const db = new Database(dbPath);

// Optional: enable foreign keys and better errors
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL'); // better concurrency

// Test the connection
console.log('SQLite connected:', db.open ? 'Yes' : 'No');

export default db;