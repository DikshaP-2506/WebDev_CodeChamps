const { db } = require('./db');

// Check for duplicate Firebase user IDs
const checkDuplicates = () => {
  console.log('Checking for duplicate Firebase user IDs...');
  
  db.serialize(() => {
    // Check suppliers table
    db.all("SELECT firebase_user_id, COUNT(*) as count FROM suppliers WHERE firebase_user_id IS NOT NULL GROUP BY firebase_user_id HAVING count > 1", (err, rows) => {
      if (err) {
        console.error('Error checking suppliers:', err);
      } else {
        console.log('Duplicate Firebase user IDs in suppliers table:');
        if (rows.length === 0) {
          console.log('No duplicates found in suppliers table');
        } else {
          rows.forEach(row => {
            console.log(`Firebase user ID: ${row.firebase_user_id}, Count: ${row.count}`);
          });
        }
      }
    });

    // Check vendors table
    db.all("SELECT firebase_user_id, COUNT(*) as count FROM vendors WHERE firebase_user_id IS NOT NULL GROUP BY firebase_user_id HAVING count > 1", (err, rows) => {
      if (err) {
        console.error('Error checking vendors:', err);
      } else {
        console.log('\nDuplicate Firebase user IDs in vendors table:');
        if (rows.length === 0) {
          console.log('No duplicates found in vendors table');
        } else {
          rows.forEach(row => {
            console.log(`Firebase user ID: ${row.firebase_user_id}, Count: ${row.count}`);
          });
        }
      }
      
      // Close database connection
      setTimeout(() => {
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('\nDatabase connection closed');
          }
          process.exit(0);
        });
      }, 1000);
    });
  });
};

// Run the check
checkDuplicates(); 