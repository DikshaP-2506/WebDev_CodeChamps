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
    firebase_user_id TEXT,
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Add firebase_user_id column if it doesn't exist (for existing databases)
  db.run(`ALTER TABLE vendors ADD COLUMN firebase_user_id TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding firebase_user_id column to vendors:', err.message);
    }
  });

  // Add updated_at column if it doesn't exist (for existing databases)
  db.run(`ALTER TABLE vendors ADD COLUMN updated_at DATETIME`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding updated_at column to vendors:', err.message);
    } else if (!err) {
      // Update existing records to set updated_at to current timestamp
      db.run(`UPDATE vendors SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL`, (updateErr) => {
        if (updateErr) {
          console.error('Error updating vendors updated_at timestamps:', updateErr.message);
        }
      });
    }
  });
  
  db.run(`CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firebase_user_id TEXT,
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Add firebase_user_id column if it doesn't exist (for existing databases)
  db.run(`ALTER TABLE suppliers ADD COLUMN firebase_user_id TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding firebase_user_id column to suppliers:', err.message);
    }
  });

  // Add updated_at column if it doesn't exist (for existing databases)
  db.run(`ALTER TABLE suppliers ADD COLUMN updated_at DATETIME`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding updated_at column to suppliers:', err.message);
    } else if (!err) {
      // Update existing records to set updated_at to current timestamp
      db.run(`UPDATE suppliers SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL`, (updateErr) => {
        if (updateErr) {
          console.error('Error updating suppliers updated_at timestamps:', updateErr.message);
        }
      });
    }
  });
  
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    vendor_id INTEGER NOT NULL,
    order_type TEXT DEFAULT 'individual',
    items TEXT NOT NULL,
    subtotal REAL DEFAULT 0,
    tax REAL DEFAULT 0,
    delivery_charge REAL DEFAULT 0,
    group_discount REAL DEFAULT 0,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'online',
    payment_id TEXT,
    delivery_address TEXT,
    delivery_date TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors (id)
  )`);
  
  console.log('Database tables initialized successfully');
  
  // Create triggers to automatically update the updated_at column
  db.run(`CREATE TRIGGER IF NOT EXISTS vendors_updated_at_trigger 
    AFTER UPDATE ON vendors 
    FOR EACH ROW 
    BEGIN 
      UPDATE vendors SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END`, (err) => {
    if (err) {
      console.error('Error creating vendors updated_at trigger:', err.message);
    }
  });
  
  db.run(`CREATE TRIGGER IF NOT EXISTS suppliers_updated_at_trigger 
    AFTER UPDATE ON suppliers 
    FOR EACH ROW 
    BEGIN 
      UPDATE suppliers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END`, (err) => {
    if (err) {
      console.error('Error creating suppliers updated_at trigger:', err.message);
    }
  });
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