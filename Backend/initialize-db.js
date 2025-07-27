const { db } = require('./db');

// Initialize database with vendors and suppliers tables
const initializeDatabase = () => {
  console.log('Initializing database...');
  
  db.serialize(() => {
    // Create vendors table
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
    )`, (err) => {
      if (err) {
        console.error('Error creating vendors table:', err);
      } else {
        console.log('Vendors table created successfully (or already exists)');
      }
    });

    // Create suppliers table with all required columns
    db.run(`DROP TABLE IF EXISTS suppliers`, (err) => {
      if (err) {
        console.error('Error dropping suppliers table:', err);
      } else {
        console.log('Dropped existing suppliers table');
      }
    });
    
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
      latitude TEXT,
      longitude TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating suppliers table:', err);
      } else {
        console.log('Suppliers table created successfully (or already exists)');
      }
    });

    // Create product_groups table with all required columns
    db.run(`DROP TABLE IF EXISTS product_groups`, (err) => {
      if (err) {
        console.error('Error dropping product_groups table:', err);
      } else {
        console.log('Dropped existing product_groups table');
      }
    });
    
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

    // Database tables created successfully
    console.log('Database initialization completed. All tables ready for real data.');
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

module.exports = { initializeDatabase };