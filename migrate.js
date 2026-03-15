const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'rk_database.sqlite');
const db = new Database(dbPath);

console.log('Migrating database...');

try {
  db.exec('ALTER TABLE products ADD COLUMN serial_no TEXT;');
  console.log('Added serial_no');
} catch (e) { console.log('serial_no might exist:', e.message); }

try {
  db.exec('ALTER TABLE products ADD COLUMN model_no TEXT;');
  console.log('Added model_no');
} catch (e) { console.log('model_no might exist:', e.message); }

try {
  db.exec('ALTER TABLE products ADD COLUMN ratio TEXT;');
  console.log('Added ratio');
} catch (e) { console.log('ratio might exist:', e.message); }

try {
  db.exec('ALTER TABLE products ADD COLUMN images TEXT;');
  console.log('Added images');
} catch (e) { console.log('images might exist:', e.message); }

console.log('Migration complete.');
db.close();
