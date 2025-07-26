const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Create vendor profile
router.post('/', async (req, res) => {
  try {
    console.log('Received vendor data:', req.body);
    
    const {
      firebaseUserId, fullName, mobileNumber, languagePreference, stallName, stallAddress,
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
        firebase_user_id, full_name, mobile_number, language_preference, stall_name, stall_address,
        city, pincode, state, stall_type, raw_material_needs,
        preferred_delivery_time, latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firebaseUserId || null, fullName, mobileNumber, languagePreference, stallName || '', stallAddress,
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
    
    res.json({ 
      vendors,
      total: vendors.length 
    });
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
    
    const rawVendor = result.rows[0];
    const vendor = {
      id: rawVendor.id,
      firebaseUserId: rawVendor.firebase_user_id,
      fullName: rawVendor.full_name,
      mobileNumber: rawVendor.mobile_number,
      languagePreference: rawVendor.language_preference,
      stallName: rawVendor.stall_name,
      stallAddress: rawVendor.stall_address,
      city: rawVendor.city,
      pincode: rawVendor.pincode,
      state: rawVendor.state,
      stallType: rawVendor.stall_type,
      rawMaterialNeeds: JSON.parse(rawVendor.raw_material_needs || '[]'),
      preferredDeliveryTime: rawVendor.preferred_delivery_time,
      latitude: rawVendor.latitude,
      longitude: rawVendor.longitude,
      createdAt: rawVendor.created_at,
      updatedAt: rawVendor.updated_at
    };
    
    res.json({ vendor });
  } catch (err) {
    console.error('Error fetching vendor:', err);
    res.status(500).json({ error: 'Failed to fetch vendor' });
  }
});

// Update vendor by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if vendor exists
    const existingVendor = await query('SELECT * FROM vendors WHERE id = ?', [id]);
    if (existingVendor.rows?.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    // Map camelCase to snake_case for database
    const fieldMapping = {
      fullName: 'full_name',
      mobileNumber: 'mobile_number',
      languagePreference: 'language_preference',
      stallName: 'stall_name',
      stallAddress: 'stall_address',
      stallType: 'stall_type',
      rawMaterialNeeds: 'raw_material_needs',
      preferredDeliveryTime: 'preferred_delivery_time'
    };
    
    // Convert camelCase fields to snake_case and prepare values
    const dbUpdateData = {};
    Object.keys(updateData).forEach(key => {
      const dbKey = fieldMapping[key] || key; // Use mapping if exists, otherwise keep original
      let value = updateData[key];
      
      // Special handling for rawMaterialNeeds
      if (key === 'rawMaterialNeeds') {
        value = JSON.stringify(Array.isArray(value) ? value : []);
      }
      
      dbUpdateData[dbKey] = value;
    });
    
    // Build update query dynamically
    const fields = Object.keys(dbUpdateData);
    const values = Object.values(dbUpdateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const result = await query(
      `UPDATE vendors SET ${setClause}, updated_at = datetime('now') WHERE id = ?`,
      [...values, id]
    );
    
    // Fetch updated vendor and transform back to camelCase
    const updatedVendorResult = await query('SELECT * FROM vendors WHERE id = ?', [id]);
    const rawVendor = updatedVendorResult.rows[0];
    const vendor = {
      id: rawVendor.id,
      firebaseUserId: rawVendor.firebase_user_id,
      fullName: rawVendor.full_name,
      mobileNumber: rawVendor.mobile_number,
      languagePreference: rawVendor.language_preference,
      stallName: rawVendor.stall_name,
      stallAddress: rawVendor.stall_address,
      city: rawVendor.city,
      pincode: rawVendor.pincode,
      state: rawVendor.state,
      stallType: rawVendor.stall_type,
      rawMaterialNeeds: JSON.parse(rawVendor.raw_material_needs || '[]'),
      preferredDeliveryTime: rawVendor.preferred_delivery_time,
      latitude: rawVendor.latitude,
      longitude: rawVendor.longitude,
      createdAt: rawVendor.created_at,
      updatedAt: rawVendor.updated_at
    };
    
    res.json({
      message: 'Vendor profile updated successfully',
      vendorId: parseInt(id),
      data: vendor
    });
  } catch (err) {
    console.error('Error updating vendor:', err);
    res.status(500).json({ error: 'Failed to update vendor profile' });
  }
});

// Get vendor by Firebase user ID
router.get('/by-user/:firebaseUserId', async (req, res) => {
  try {
    const { firebaseUserId } = req.params;
    const result = await query('SELECT * FROM vendors WHERE firebase_user_id = ?', [firebaseUserId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    const rawVendor = result.rows[0];
    const vendor = {
      id: rawVendor.id,
      firebaseUserId: rawVendor.firebase_user_id,
      fullName: rawVendor.full_name,
      mobileNumber: rawVendor.mobile_number,
      languagePreference: rawVendor.language_preference,
      stallName: rawVendor.stall_name,
      stallAddress: rawVendor.stall_address,
      city: rawVendor.city,
      pincode: rawVendor.pincode,
      state: rawVendor.state,
      stallType: rawVendor.stall_type,
      rawMaterialNeeds: JSON.parse(rawVendor.raw_material_needs || '[]'),
      preferredDeliveryTime: rawVendor.preferred_delivery_time,
      latitude: rawVendor.latitude,
      longitude: rawVendor.longitude,
      createdAt: rawVendor.created_at,
      updatedAt: rawVendor.updated_at
    };
    
    res.json({ vendor });
  } catch (err) {
    console.error('Error fetching vendor by user ID:', err);
    res.status(500).json({ error: 'Failed to fetch vendor' });
  }
});

// Delete vendor by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if vendor exists
    const existingVendor = await query('SELECT * FROM vendors WHERE id = ?', [id]);
    if (existingVendor.rows?.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    await query('DELETE FROM vendors WHERE id = ?', [id]);
    
    res.json({ message: 'Vendor profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting vendor:', err);
    res.status(500).json({ error: 'Failed to delete vendor profile' });
  }
});

module.exports = router;