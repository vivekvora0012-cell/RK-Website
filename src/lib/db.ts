import { createClient, Client } from '@libsql/client';

// singleton for database client
let client: Client | null = null;

export function getClient(): Client {
  if (client) return client;

  const isProduction = process.env.NODE_ENV === 'production';
  const rawUrl = process.env.TURSO_DATABASE_URL;
  const rawToken = process.env.TURSO_AUTH_TOKEN;

  // Development fallback to local file
  const url = (isProduction && rawUrl) ? rawUrl : "file:rk_database.sqlite";
  const authToken = isProduction ? rawToken : undefined;

  try {
    client = createClient({
      url: url,
      authToken: authToken,
    });
    return client;
  } catch (error) {
    console.error("Critical: Failed to create database client:", error);
    // Return a dummy client or throw a more descriptive error
    throw new Error("Database configuration error.");
  }
}

// Proxied db object for backward compatibility
const db = {
  execute: async (...args: any[]) => {
    try {
      const c = getClient();
      return await (c.execute as any)(...args);
    } catch (e) {
      console.error("Database execution error:", e);
      // Return empty results instead of crashing for select queries
      if (typeof args[0] === 'string' && args[0].trim().toUpperCase().startsWith('SELECT')) {
        return { rows: [], columns: [], rowsAffected: 0 };
      }
      throw e;
    }
  },
  batch: async (...args: any[]) => {
    const c = getClient();
    return await (c.batch as any)(...args);
  }
};

// Initialize database tables if they do not exist
export async function initDB() {
  try {
    const c = getClient();
    
    await c.execute(`
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

    await c.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await c.execute(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        read_time TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await c.execute(`
      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        duration TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await c.execute(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await c.execute(`
      CREATE TABLE IF NOT EXISTS slideshow (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await c.execute(`
      CREATE TABLE IF NOT EXISTS social_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migration logic
    try { await c.execute("ALTER TABLE blogs ADD COLUMN image TEXT"); } catch {}
    try { await c.execute("ALTER TABLE inquiries ADD COLUMN phone TEXT"); } catch {}

  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

export default db;
