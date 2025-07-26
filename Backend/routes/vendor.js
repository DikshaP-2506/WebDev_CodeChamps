const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Create vendor profile
router.post('/', async (req, res) => {
  try {
    console.log('Received vendor data:', req.body);
    
    const {
      fullName, mobileNumber, languagePreference, stallName, stallAddress,
      city, pincode, state, stallType, rawMaterialNeeds,
      preferredDeliveryTime, latitude, longitude
    } = req.body;

    // Validation
    if (!fullName || !mobileNumber || !languagePreference || !stallAddress || 
        !city || !pincode || !state || !stallType || !rawMaterialNeeds || 
        !preferredDeliveryTime) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['fullName', 'mobileNumber', 'languagePreference', 'stallAddress', 'city', 'pincode', 'state', 'stallType', 'rawMaterialNeeds', 'preferredDeliveryTime']
      });
    }

    // Convert rawMaterialNeeds array to JSON string for storage
    const rawMaterialsJson = JSON.stringify(rawMaterialNeeds);

    const result = await query(
      `INSERT INTO vendors (
        full_name, mobile_number, language_preference, stall_name, stall_address,
        city, pincode, state, stall_type, raw_material_needs,
        preferred_delivery_time, latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName, mobileNumber, languagePreference, stallName || '', stallAddress,
        city, pincode, state, stallType, rawMaterialsJson,
        preferredDeliveryTime, latitude || '', longitude || ''
      ]
    );

    console.log('Vendor created successfully:', result);
    
    res.status(201).json({ 
      message: 'Vendor profile created successfully',
      vendorId: result.lastID,
      data: {
        id: result.lastID,
        fullName,
        mobileNumber,
        languagePreference,
        stallName,
        stallAddress,
        city,
        pincode,
        state,
        stallType,
        rawMaterialNeeds,
        preferredDeliveryTime,
        latitude,
        longitude
      }
    });
  } catch (err) {
    console.error('Error creating vendor:', err);
    res.status(500).json({ 
      error: 'Failed to create vendor profile',
      details: err.message 
    });
  }
});

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM vendors ORDER BY created_at DESC');
    
    // Parse raw_material_needs JSON for each vendor
    const vendors = result.rows.map(vendor => ({
      ...vendor,
      raw_material_needs: JSON.parse(vendor.raw_material_needs || '[]')
    }));
    
    res.json(vendors);
  } catch (err) {
    console.error('Error fetching vendors:', err);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// Get vendor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM vendors WHERE id = ?', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    const vendor = {
      ...result.rows[0],
      raw_material_needs: JSON.parse(result.rows[0].raw_material_needs || '[]')
    };
    
    res.json(vendor);
  } catch (err) {
    console.error('Error fetching vendor:', err);
    res.status(500).json({ error: 'Failed to fetch vendor' });
  }
});

module.exports = router;