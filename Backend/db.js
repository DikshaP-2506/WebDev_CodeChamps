const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'vendors.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create vendors table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    language_preference TEXT NOT NULL,
    stall_name TEXT,
    stall_address TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    state TEXT NOT NULL,
    stall_type TEXT NOT NULL,
    raw_material_needs TEXT NOT NULL,
    preferred_delivery_time TEXT NOT NULL,
    latitude TEXT,
    longitude TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    language_preference TEXT NOT NULL,
    business_name TEXT,
    business_address TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    state TEXT NOT NULL,
    business_type TEXT NOT NULL,
    supply_capabilities TEXT NOT NULL,
    preferred_delivery_time TEXT NOT NULL,
    latitude TEXT,
    longitude TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Promisify database operations
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (sql.toLowerCase().includes('insert') || sql.toLowerCase().includes('update') || sql.toLowerCase().includes('delete')) {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ 
            lastID: this.lastID, 
            changes: this.changes,
            rows: [{ id: this.lastID }] 
          });
        }
      });
    } else {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve({ rows });
        }
      });
    }
  });
};

module.exports = { query, db };