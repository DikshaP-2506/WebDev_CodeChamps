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

    // Create suppliers table
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
    )`, (err) => {
      if (err) {
        console.error('Error creating suppliers table:', err);
      } else {
        console.log('Suppliers table created successfully (or already exists)');
      }
    });

    // Create product_groups table
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

    // Add sample vendor data (optional)
    db.get("SELECT COUNT(*) as count FROM vendors", (err, row) => {
      if (err) {
        console.error('Error checking vendor count:', err);
        return;
      }
      
      if (row.count === 0) {
        console.log('Adding sample vendor data...');
        const sampleVendorData = [
          'Sample Vendor',
          '+91 9876543210',
          'Hindi',
          'Sample Stall',
          'Sample Address, Near Landmark',
          'Mumbai',
          '400001',
          'Maharashtra',
          'Chaat',
          JSON.stringify(['Spices', 'Oil', 'Vegetables']),
          'Morning (6 AM - 12 PM)',
          '19.0760',
          '72.8777'
        ];
        
        db.run(`INSERT INTO vendors (
          full_name, mobile_number, language_preference, stall_name, stall_address,
          city, pincode, state, stall_type, raw_material_needs,
          preferred_delivery_time, latitude, longitude
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, sampleVendorData, function(err) {
          if (err) {
            console.error('Error inserting sample vendor data:', err);
          } else {
            console.log('Sample vendor added with ID:', this.lastID);
          }
        });
      }
    });

    // Add sample supplier data (optional)
    db.get("SELECT COUNT(*) as count FROM suppliers", (err, row) => {
      if (err) {
        console.error('Error checking supplier count:', err);
        return;
      }
      
      if (row.count === 0) {
        console.log('Adding sample supplier data...');
        const sampleSupplierData = [
          'Sample Supplier',
          '+91 9876543211',
          'English',
          'ABC Trading Company',
          'Commercial Street, Business District',
          'Mumbai',
          '400002',
          'Maharashtra',
          'Wholesale',
          JSON.stringify(['Spices', 'Grains', 'Oil', 'Vegetables']),
          'Morning (6 AM - 12 PM)',
          '19.0850',
          '72.8850'
        ];
        
        db.run(`INSERT INTO suppliers (
          full_name, mobile_number, language_preference, business_name, business_address,
          city, pincode, state, business_type, supply_capabilities,
          preferred_delivery_time, latitude, longitude
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, sampleSupplierData, function(err) {
          if (err) {
            console.error('Error inserting sample supplier data:', err);
          } else {
            console.log('Sample supplier added with ID:', this.lastID);
          }
        });
      }
    });
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