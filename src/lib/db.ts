import { createClient } from '@libsql/client';

// Use environment variables for Turso, or local file for development
const isProduction = process.env.NODE_ENV === 'production';
const url = isProduction && process.env.TURSO_DATABASE_URL 
  ? process.env.TURSO_DATABASE_URL 
  : "file:rk_database.sqlite";
const authToken = isProduction ? process.env.TURSO_AUTH_TOKEN : undefined;

const db = createClient({
  url: url,
  authToken: authToken,
});

// Initialize database tables if they do not exist
export async function initDB() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      description TEXT NOT NULL,
      serial_no TEXT,
      model_no TEXT,
      ratio TEXT,
      images TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      read_time TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      duration TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS slideshow (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: Add image column to blogs if not exists
  try {
    await db.execute("ALTER TABLE blogs ADD COLUMN image TEXT");
  } catch (e) {}

  // Migration: Add phone column to inquiries if not exists
  try {
    await db.execute("ALTER TABLE inquiries ADD COLUMN phone TEXT");
  } catch (e) {}
}

// Note: In Next.js App Router, we usually call initDB in a root layout or 
// handle migrations separately. For now, we'll keep the export and 
// let server actions ensure the DB is ready or rely on a pre-deployment step.

export default db;
