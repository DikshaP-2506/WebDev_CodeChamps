const express = require('express');
const { query } = require('../initialize-db');
const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    console.log('Creating new order:', req.body);
    
    const {
      id,
      vendor_id,
      supplier_id,
      order_type = 'individual',
      items,
      subtotal = 0,
      tax = 0,
      delivery_charge = 0,
      group_discount = 0,
      total_amount,
      status = 'pending',
      payment_status = 'completed',
      payment_method = 'online',
      payment_id,
      delivery_address,
      delivery_date,
      notes,
      customer_details
    } = req.body;

    // Validate required fields
    if (!id || !vendor_id || !total_amount || !items) {
      return res.status(400).json({ 
        error: 'Missing required fields: id, vendor_id, total_amount, items' 
      });
    }

    // Convert items to JSON string if it's an object
    const itemsJson = typeof items === 'string' ? items : JSON.stringify(items);
    const customerDetailsJson = customer_details ? JSON.stringify(customer_details) : null;

    const sql = `
      INSERT INTO orders (
        id, vendor_id, supplier_id, order_type, items, subtotal, tax, 
        delivery_charge, group_discount, total_amount, status, payment_status, 
        payment_method, payment_id, delivery_address, delivery_date, notes, 
        customer_details, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    const params = [
      id, vendor_id, supplier_id, order_type, itemsJson, subtotal, tax,
      delivery_charge, group_discount, total_amount, status, payment_status,
      payment_method, payment_id, delivery_address, delivery_date, notes,
      customerDetailsJson
    ];

    const result = await query(sql, params);
    
    console.log('✅ Order created successfully:');
    console.log('📝 Order ID:', id);
    console.log('🏪 Vendor ID:', vendor_id);
    console.log('🏭 Supplier ID:', supplier_id);
    console.log('📊 Status:', status);
    console.log('💳 Payment Status:', payment_status);
    console.log('💰 Total Amount:', total_amount);
    
    res.status(201).json({
      message: 'Order created successfully',
      orderId: id,
      data: {
        id,
        vendor_id,
        supplier_id,
        order_type,
        total_amount,
        status,
        payment_status,
        created_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error.message 
    });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT o.*, v.full_name as vendor_name, v.mobile_number as vendor_phone, v.stall_name, v.city as vendor_city
       FROM orders o 
       LEFT JOIN vendors v ON o.vendor_id = v.id 
       ORDER BY o.created_at DESC`
    );
    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      message: error.message 
    });
  }
});

// Get orders by vendor ID
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const result = await query(
      'SELECT * FROM orders WHERE vendor_id = ? ORDER BY created_at DESC',
      [vendorId]
    );
    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch vendor orders',
      message: error.message 
    });
  }
});

// Get orders by supplier ID
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const { supplierId } = req.params;
    console.log('🔍 Fetching orders for supplier ID:', supplierId);
    
    const result = await query(
      `SELECT o.*, v.full_name as vendor_name, v.mobile_number as vendor_phone, v.stall_name, v.city as vendor_city
       FROM orders o 
       LEFT JOIN vendors v ON o.vendor_id = v.id 
       WHERE o.supplier_id = ? 
       ORDER BY o.created_at DESC`,
      [supplierId]
    );
    
    console.log('📊 Orders found for supplier', supplierId, ':', result.rows.length);
    console.log('📋 Order details:', result.rows.map(order => ({
      id: order.id,
      vendor_id: order.vendor_id,
      supplier_id: order.supplier_id,
      status: order.status,
      payment_status: order.payment_status,
      total_amount: order.total_amount
    })));
    
    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Error fetching supplier orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch supplier orders',
      message: error.message 
    });
  }
});

// Get pending orders (orders without supplier assigned) - for suppliers to view and accept
router.get('/pending', async (req, res) => {
  try {
    const result = await query(
      `SELECT o.*, v.full_name as vendor_name, v.mobile_number as vendor_phone, v.stall_name, v.city as vendor_city
       FROM orders o 
       LEFT JOIN vendors v ON o.vendor_id = v.id 
       WHERE o.supplier_id IS NULL AND o.status = 'pending' 
       ORDER BY o.created_at DESC`
    );
    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pending orders',
      message: error.message 
    });
  }
});

// Accept an order by supplier (assign supplier_id to the order)
router.put('/:orderId/accept', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { supplier_id } = req.body;

    if (!supplier_id) {
      return res.status(400).json({ error: 'supplier_id is required' });
    }

    // Check if order exists and is still pending
    const checkResult = await query(
      'SELECT * FROM orders WHERE id = ? AND supplier_id IS NULL AND status = ?',
      [orderId, 'pending']
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or already assigned' });
    }

    // Update order with supplier_id and change status to 'accepted'
    const result = await query(
      'UPDATE orders SET supplier_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [supplier_id, 'accepted', orderId]
    );

    res.json({ 
      message: 'Order accepted successfully',
      orderId,
      supplier_id
    });

  } catch (error) {
    console.error('Error accepting order:', error);
    res.status(500).json({ 
      error: 'Failed to accept order',
      message: error.message 
    });
  }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ order: result.rows[0] });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      error: 'Failed to fetch order',
      message: error.message 
    });
  }
});

// Update order status
router.put('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, payment_status } = req.body;

    if (!status && !payment_status) {
      return res.status(400).json({ error: 'Status or payment_status is required' });
    }

    let sql = 'UPDATE orders SET updated_at = CURRENT_TIMESTAMP';
    const params = [];

    if (status) {
      sql += ', status = ?';
      params.push(status);
    }

    if (payment_status) {
      sql += ', payment_status = ?';
      params.push(payment_status);
    }

    sql += ' WHERE id = ?';
    params.push(orderId);

    const result = await query(sql, params);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ 
      message: 'Order status updated successfully',
      orderId,
      status,
      payment_status
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      error: 'Failed to update order status',
      message: error.message 
    });
  }
});

// Delete order
router.delete('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await query('DELETE FROM orders WHERE id = ?', [orderId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      error: 'Failed to delete order',
      message: error.message 
    });
  }
});

module.exports = router;
