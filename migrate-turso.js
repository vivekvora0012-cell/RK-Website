const { createClient } = require('@libsql/client');
require('dotenv').config();

const dbLocal = createClient({
  url: "file:rk_database.sqlite"
});

const dbRemote = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error('Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in your .env file.');
    process.exit(1);
  }

  console.log('🚀 Starting migration to Turso...');

  // Initialize schema on remote
  console.log('🏗️ Initializing remote schema...');
  try {
    await dbRemote.execute("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price TEXT NOT NULL, description TEXT NOT NULL, serial_no TEXT, model_no TEXT, ratio TEXT, images TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);");
    await dbRemote.execute("CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL, icon TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);");
    await dbRemote.execute("CREATE TABLE IF NOT EXISTS blogs (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, excerpt TEXT NOT NULL, content TEXT NOT NULL, read_time TEXT NOT NULL, image TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);");
    await dbRemote.execute("CREATE TABLE IF NOT EXISTS videos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, url TEXT NOT NULL, duration TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);");
    await dbRemote.execute("CREATE TABLE IF NOT EXISTS inquiries (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, message TEXT NOT NULL, is_read INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);");
    await dbRemote.execute("CREATE TABLE IF NOT EXISTS slideshow (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL, image_url TEXT NOT NULL, order_index INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);");
    console.log('  ✅ Remote schema initialized.');
  } catch (e) {
    console.error('  ❌ Error initializing remote schema:', e.message);
  }

  const tables = ['products', 'services', 'blogs', 'videos', 'inquiries', 'slideshow'];

  for (const table of tables) {
    console.log(`📦 Migrating table: ${table}...`);
    const rs = await dbLocal.execute(`SELECT * FROM ${table}`);
    const rows = rs.rows;
    
    if (rows.length === 0) {
      console.log(`  - No data found in ${table}. Skipping.`);
      continue;
    }

    for (const row of rows) {
      const keys = Object.keys(row);
      const values = Object.values(row);
      const placeholders = keys.map(() => '?').join(', ');
      
      try {
        await dbRemote.execute({
          sql: `INSERT OR REPLACE INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`,
          args: values
        });
      } catch (e) {
        console.error(`  ❌ Error inserting into ${table}:`, e.message);
      }
    }
    console.log(`  ✅ Migrated ${rows.length} rows to ${table}.`);
  }

  console.log('🎉 Migration to Turso complete!');
}

migrate().catch(console.error);
