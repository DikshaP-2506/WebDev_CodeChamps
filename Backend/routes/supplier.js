const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Create supplier profile
router.post('/', async (req, res) => {
  try {
    console.log('Received supplier data:', req.body);
    
    const {
      firebaseUserId, fullName, mobileNumber, languagePreference, businessName, businessAddress,
      city, pincode, state, businessType, supplyCapabilities,
      preferredDeliveryTime, latitude, longitude,
      // Additional fields
      gstNumber, licenseNumber, yearsInBusiness, employeeCount,
      primaryEmail, whatsappBusiness,
      foodSafetyLicense, organicCertification, isoCertification, exportLicense
    } = req.body;

    // Validation
    if (!fullName || !mobileNumber || !languagePreference || !businessAddress || 
        !city || !pincode || !state || !businessType || !supplyCapabilities || 
        !preferredDeliveryTime) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['fullName', 'mobileNumber', 'languagePreference', 'businessAddress', 'city', 'pincode', 'state', 'businessType', 'supplyCapabilities', 'preferredDeliveryTime']
      });
    }

    // Convert arrays to JSON strings for storage
    const supplyCapabilitiesJson = JSON.stringify(supplyCapabilities);

    const result = await query(
      `INSERT INTO suppliers (
        firebase_user_id, full_name, mobile_number, language_preference, business_name, business_address,
        city, pincode, state, business_type, supply_capabilities,
        preferred_delivery_time, latitude, longitude,
        gst_number, license_number, years_in_business, employee_count,
        primary_email, whatsapp_business,
        food_safety_license, organic_certification, iso_certification, export_license
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firebaseUserId || null, fullName, mobileNumber, languagePreference, businessName || '', businessAddress,
        city, pincode, state, businessType, supplyCapabilitiesJson,
        preferredDeliveryTime, latitude || '', longitude || '',
        gstNumber || '', licenseNumber || '', yearsInBusiness || '', employeeCount || '',
        primaryEmail || '', whatsappBusiness || '',
        foodSafetyLicense || '', organicCertification || '', isoCertification || '', exportLicense || ''
      ]
    );

    console.log('Supplier created successfully:', result);
    
    res.status(201).json({ 
      message: 'Supplier profile created successfully',
      supplierId: result.lastID,
      data: {
        id: result.lastID,
        fullName,
        mobileNumber,
        languagePreference,
        businessName,
        businessAddress,
        city,
        pincode,
        state,
        businessType,
        supplyCapabilities,
        preferredDeliveryTime,
        latitude,
        longitude,
        gstNumber,
        licenseNumber,
        yearsInBusiness,
        employeeCount,
        primaryEmail,
        whatsappBusiness,
        foodSafetyLicense,
        organicCertification,
        isoCertification,
        exportLicense
      }
    });
  } catch (err) {
    console.error('Error creating supplier:', err);
    res.status(500).json({ 
      error: 'Failed to create supplier profile',
      details: err.message 
    });
  }
});

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM suppliers ORDER BY created_at DESC');
    
    // Parse supply_capabilities JSON for each supplier
    const suppliers = result.rows.map(supplier => ({
      ...supplier,
      supply_capabilities: JSON.parse(supplier.supply_capabilities || '[]')
    }));
    
    res.json({ 
      suppliers,
      total: suppliers.length 
    });
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// Get supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM suppliers WHERE id = ?', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    const supplier = {
      ...result.rows[0],
      supply_capabilities: JSON.parse(result.rows[0].supply_capabilities || '[]')
    };
    
    res.json(supplier);
  } catch (err) {
    console.error('Error fetching supplier:', err);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// Get supplier by Firebase user ID
router.get('/by-user/:firebaseUserId', async (req, res) => {
  try {
    const { firebaseUserId } = req.params;
    const result = await query('SELECT * FROM suppliers WHERE firebase_user_id = ?', [firebaseUserId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    const rawSupplier = result.rows[0];
    
    // Convert snake_case database columns to camelCase for frontend
    const supplier = {
      id: rawSupplier.id,
      fullName: rawSupplier.full_name,
      mobileNumber: rawSupplier.mobile_number,
      languagePreference: rawSupplier.language_preference,
      businessName: rawSupplier.business_name || '',
      businessAddress: rawSupplier.business_address,
      city: rawSupplier.city,
      pincode: rawSupplier.pincode,
      state: rawSupplier.state,
      businessType: rawSupplier.business_type,
      supplyCapabilities: JSON.parse(rawSupplier.supply_capabilities || '[]'),
      preferredDeliveryTime: rawSupplier.preferred_delivery_time,
      latitude: rawSupplier.latitude || '',
      longitude: rawSupplier.longitude || '',
      // Additional fields (if they exist in database)
      gstNumber: rawSupplier.gst_number || '',
      licenseNumber: rawSupplier.license_number || '',
      yearsInBusiness: rawSupplier.years_in_business || '',
      employeeCount: rawSupplier.employee_count || '',
      primaryEmail: rawSupplier.primary_email || '',
      whatsappBusiness: rawSupplier.whatsapp_business || '',
      foodSafetyLicense: rawSupplier.food_safety_license || '',
      organicCertification: rawSupplier.organic_certification || '',
      isoCertification: rawSupplier.iso_certification || '',
      exportLicense: rawSupplier.export_license || ''
    };
    
    res.json({ supplier });
  } catch (err) {
    console.error('Error fetching supplier by user ID:', err);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// Update supplier profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName, mobileNumber, languagePreference, businessName, businessAddress,
      city, pincode, state, businessType, supplyCapabilities,
      preferredDeliveryTime, latitude, longitude,
      // Additional fields
      gstNumber, licenseNumber, yearsInBusiness, employeeCount,
      primaryEmail, whatsappBusiness,
      foodSafetyLicense, organicCertification, isoCertification, exportLicense
    } = req.body;

    // Check if supplier exists
    const existingSupplier = await query('SELECT * FROM suppliers WHERE id = ?', [id]);
    if (existingSupplier.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // Convert supplyCapabilities array to JSON string for storage
    const supplyCapabilitiesJson = JSON.stringify(supplyCapabilities || []);

    const result = await query(
      `UPDATE suppliers SET 
        full_name = ?, mobile_number = ?, language_preference = ?, business_name = ?, 
        business_address = ?, city = ?, pincode = ?, state = ?, business_type = ?, 
        supply_capabilities = ?, preferred_delivery_time = ?, latitude = ?, longitude = ?,
        gst_number = ?, license_number = ?, years_in_business = ?, employee_count = ?,
        primary_email = ?, whatsapp_business = ?,
        food_safety_license = ?, organic_certification = ?, iso_certification = ?, export_license = ?
      WHERE id = ?`,
      [
        fullName, mobileNumber, languagePreference, businessName || '', businessAddress,
        city, pincode, state, businessType, supplyCapabilitiesJson,
        preferredDeliveryTime, latitude || '', longitude || '',
        gstNumber || '', licenseNumber || '', yearsInBusiness || '', employeeCount || '',
        primaryEmail || '', whatsappBusiness || '',
        foodSafetyLicense || '', organicCertification || '', isoCertification || '', exportLicense || '',
        id
      ]
    );

    console.log('Supplier updated successfully:', result);
    
    res.json({ 
      message: 'Supplier profile updated successfully',
      supplierId: id,
      changes: result.changes
    });
  } catch (err) {
    console.error('Error updating supplier:', err);
    res.status(500).json({ 
      error: 'Failed to update supplier profile',
      details: err.message 
    });
  }
});

// Delete supplier profile
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if supplier exists
    const existingSupplier = await query('SELECT * FROM suppliers WHERE id = ?', [id]);
    if (existingSupplier.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const result = await query('DELETE FROM suppliers WHERE id = ?', [id]);
    
    console.log('Supplier deleted successfully:', result);
    
    res.json({ 
      message: 'Supplier profile deleted successfully',
      supplierId: id,
      changes: result.changes
    });
  } catch (err) {
    console.error('Error deleting supplier:', err);
    res.status(500).json({ 
      error: 'Failed to delete supplier profile',
      details: err.message 
    });
  }
});

// Search suppliers by capabilities
router.get('/search/capabilities', async (req, res) => {
  try {
    const { capabilities } = req.query;
    
    if (!capabilities) {
      return res.status(400).json({ error: 'Capabilities parameter is required' });
    }

    // Split capabilities if it's a comma-separated string
    const searchCapabilities = Array.isArray(capabilities) ? capabilities : capabilities.split(',');
    
    const result = await query('SELECT * FROM suppliers ORDER BY created_at DESC');
    
    // Filter suppliers based on capabilities
    const filteredSuppliers = result.rows.filter(supplier => {
      const supplierCapabilities = JSON.parse(supplier.supply_capabilities || '[]');
      return searchCapabilities.some(capability => 
        supplierCapabilities.includes(capability.trim())
      );
    }).map(supplier => ({
      ...supplier,
      supply_capabilities: JSON.parse(supplier.supply_capabilities || '[]')
    }));
    
    res.json(filteredSuppliers);
  } catch (err) {
    console.error('Error searching suppliers:', err);
    res.status(500).json({ error: 'Failed to search suppliers' });
  }
});

// Search suppliers by location
router.get('/search/location', async (req, res) => {
  try {
    const { city, state, pincode } = req.query;
    
    if (!city && !state && !pincode) {
      return res.status(400).json({ error: 'At least one location parameter (city, state, or pincode) is required' });
    }

    let whereClause = [];
    let params = [];

    if (city) {
      whereClause.push('LOWER(city) LIKE ?');
      params.push(`%${city.toLowerCase()}%`);
    }
    if (state) {
      whereClause.push('LOWER(state) LIKE ?');
      params.push(`%${state.toLowerCase()}%`);
    }
    if (pincode) {
      whereClause.push('pincode = ?');
      params.push(pincode);
    }

    const sql = `SELECT * FROM suppliers WHERE ${whereClause.join(' OR ')} ORDER BY created_at DESC`;
    const result = await query(sql, params);
    
    // Parse supply_capabilities JSON for each supplier
    const suppliers = result.rows.map(supplier => ({
      ...supplier,
      supply_capabilities: JSON.parse(supplier.supply_capabilities || '[]')
    }));
    
    res.json(suppliers);
  } catch (err) {
    console.error('Error searching suppliers by location:', err);
    res.status(500).json({ error: 'Failed to search suppliers by location' });
  }
});

module.exports = router;