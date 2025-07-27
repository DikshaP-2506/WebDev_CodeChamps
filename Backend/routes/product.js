const express = require('express');
const router = express.Router();
const { query } = require('../initialize-db');

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, description, category, price, image } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const result = await query(
      `INSERT INTO products (name, description, category, price, image) VALUES (?, ?, ?, ?, ?)`,
      [name, description || '', category || '', price || 0, image || '']
    );
    res.status(201).json({ message: 'Product created', id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product', details: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM products', []);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, image } = req.body;
    await query(
      `UPDATE products SET name = ?, description = ?, category = ?, price = ?, image = ? WHERE id = ?`,
      [name, description || '', category || '', price || 0, image || '', id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
});

module.exports = router; 