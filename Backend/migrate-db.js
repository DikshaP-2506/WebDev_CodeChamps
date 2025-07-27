const { db } = require('./db');

// Database migration script to add missing columns
const migrateDatabase = () => {
  console.log('Starting database migration...');
  
  db.serialize(() => {
    // Check if actual_rate column exists, if not add it
    db.all("PRAGMA table_info(product_groups)", (err, columns) => {
      if (err) {
        console.error('Error checking table info:', err);
        return;
      }
      
      const columnNames = columns.map(col => col.name);
      console.log('Existing columns:', columnNames);
      
      // Add missing columns
      const columnsToAdd = [
        { name: 'actual_rate', type: 'TEXT' },
        { name: 'final_rate', type: 'TEXT' },
        { name: 'discount_percentage', type: 'TEXT' },
        { name: 'latitude', type: 'TEXT' },
        { name: 'longitude', type: 'TEXT' }
      ];
      
      columnsToAdd.forEach(column => {
        if (!columnNames.includes(column.name)) {
          db.run(`ALTER TABLE product_groups ADD COLUMN ${column.name} ${column.type}`, (err) => {
            if (err) {
              console.error(`Error adding column ${column.name}:`, err);
            } else {
              console.log(`Added column ${column.name} to product_groups table`);
            }
          });
        } else {
          console.log(`Column ${column.name} already exists`);
        }
      });
      
      // Check suppliers table and add missing columns
      db.all("PRAGMA table_info(suppliers)", (err, supplierColumns) => {
        if (err) {
          console.error('Error checking suppliers table info:', err);
          return;
        }
        
        const supplierColumnNames = supplierColumns.map(col => col.name);
        console.log('Existing supplier columns:', supplierColumnNames);
        
        const supplierColumnsToAdd = [
          { name: 'firebase_user_id', type: 'TEXT UNIQUE' },
          { name: 'primary_email', type: 'TEXT' },
          { name: 'whatsapp_business', type: 'TEXT' },
          { name: 'gst_number', type: 'TEXT' },
          { name: 'license_number', type: 'TEXT' },
          { name: 'years_in_business', type: 'TEXT' },
          { name: 'employee_count', type: 'TEXT' },
          { name: 'food_safety_license', type: 'TEXT' },
          { name: 'organic_certification', type: 'TEXT' },
          { name: 'iso_certification', type: 'TEXT' },
          { name: 'export_license', type: 'TEXT' }
        ];
        
        supplierColumnsToAdd.forEach(column => {
          if (!supplierColumnNames.includes(column.name)) {
            db.run(`ALTER TABLE suppliers ADD COLUMN ${column.name} ${column.type}`, (err) => {
              if (err) {
                console.error(`Error adding column ${column.name} to suppliers:`, err);
              } else {
                console.log(`Added column ${column.name} to suppliers table`);
              }
            });
          } else {
            console.log(`Supplier column ${column.name} already exists`);
          }
        });
      });
    });
    
    console.log('Database migration completed');
  });
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateDatabase();
  
  // Close database connection after a delay to allow migrations to complete
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
      process.exit(0);
    });
  }, 2000);
}

module.exports = { migrateDatabase };
