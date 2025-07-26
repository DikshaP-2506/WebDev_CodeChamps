const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Create a new product group
router.post('/', async (req, res) => {
  try {
    const { product, quantity, price, location, deadline, created_by, latitude, longitude } = req.body;
    if (!product || !quantity || !location || !deadline || !created_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await query(
      `INSERT INTO product_groups (product, quantity, price, location, deadline, status, created_by, latitude, longitude) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
      [product, quantity, price || '', location, deadline, created_by, latitude || '', longitude || '']
    );
    res.status(201).json({ message: 'Product group created', id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product group', details: err.message });
  }
});

// Get all product groups (optionally filter by created_by)
router.get('/', async (req, res) => {
  try {
    const { created_by } = req.query;
    let sql = 'SELECT * FROM product_groups';
    let params = [];
    if (created_by) {
      sql += ' WHERE created_by = ?';
      params.push(created_by);
    }
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product groups', details: err.message });
  }
});

// Update status: accept, decline, deliver
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['accepted', 'declined', 'delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await query('UPDATE product_groups SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Product group marked as ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status', details: err.message });
  }
});

module.exports = router; 