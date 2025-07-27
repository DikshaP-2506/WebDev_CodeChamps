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

// Initialize database with all tables
const initializeDatabase = () => {
  console.log('Initializing database...');
  
  db.serialize(() => {
    // Create vendors table
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
    )`, (err) => {
      if (err) {
        console.error('Error creating vendors table:', err);
      } else {
        console.log('Vendors table created successfully (or already exists)');
      }
    });

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

    // Create suppliers table with all required columns
    db.run(`CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firebase_user_id TEXT UNIQUE,
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
      primary_email TEXT,
      whatsapp_business TEXT,
      gst_number TEXT,
      license_number TEXT,
      years_in_business TEXT,
      employee_count TEXT,
      food_safety_license TEXT,
      organic_certification TEXT,
      iso_certification TEXT,
      export_license TEXT,
      website TEXT,
      minimum_order_value TEXT,
      delivery_time TEXT,
      payment_terms TEXT,
      service_areas TEXT,
      latitude TEXT,
      longitude TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating suppliers table:', err);
      } else {
        console.log('Suppliers table created successfully (or already exists)');
      }
    });

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

    // Add new supplier profile columns
    const newSupplierColumns = [
      'website TEXT',
      'minimum_order_value TEXT',
      'delivery_time TEXT',
      'payment_terms TEXT',
      'service_areas TEXT'
    ];

    newSupplierColumns.forEach(column => {
      const columnName = column.split(' ')[0];
      db.run(`ALTER TABLE suppliers ADD COLUMN ${column}`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error(`Error adding ${columnName} column to suppliers:`, err.message);
        }
      });
    });

    // Create product_groups table with all required columns
    db.run(`CREATE TABLE IF NOT EXISTS product_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product TEXT NOT NULL,
      quantity TEXT NOT NULL,
      price TEXT,
      actual_rate TEXT,
      final_rate TEXT,
      discount_percentage TEXT,
      location TEXT NOT NULL,
      deadline DATETIME NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_by INTEGER NOT NULL,
      latitude TEXT,
      longitude TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES suppliers(id)
    )`, (err) => {
      if (err) {
        console.error('Error creating product_groups table:', err);
      } else {
        console.log('Product groups table created successfully (or already exists)');
      }
    });

    // Create orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      vendor_id INTEGER NOT NULL,
      supplier_id INTEGER,
      order_type TEXT DEFAULT 'individual',
      items TEXT NOT NULL,
      subtotal REAL DEFAULT 0,
      tax REAL DEFAULT 0.05,
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
      customer_details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vendor_id) REFERENCES vendors (id),
      FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
    )`, (err) => {
      if (err) {
        console.error('Error creating orders table:', err);
      } else {
        console.log('Orders table created successfully (or already exists)');
      }
    });
    
    // Add missing columns to orders table if they don't exist
    const orderColumns = [
      'supplier_id INTEGER',
      'customer_details TEXT'
    ];

    orderColumns.forEach(column => {
      const columnName = column.split(' ')[0];
      db.run(`ALTER TABLE orders ADD COLUMN ${column}`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error(`Error adding ${columnName} column to orders:`, err.message);
        }
      });
    });

    // Create products table for product catalog
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      price REAL,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating products table:', err);
      } else {
        console.log('Products table created successfully (or already exists)');
      }
    });

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

    console.log('Database tables initialized successfully');
    // Database tables created successfully
    console.log('Database initialization completed. All tables ready for real data.');
  });
};

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

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase();
  
  // Close database connection after initialization
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
      process.exit(0);
    });
  }, 1000);
}

module.exports = { initializeDatabase, query, db };