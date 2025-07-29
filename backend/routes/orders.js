const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const { authenticateToken, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const orderValidation = [
  body('platform').isIn(['amazon', 'blinkit', 'organic', 'flipkart', 'swiggy']),
  body('platformOrderId').notEmpty(),
  body('orderNumber').notEmpty(),
  body('orderDate').isISO8601(),
  body('customer.name').notEmpty(),
  body('customer.email').isEmail(),
  body('items').isArray({ min: 1 }),
  body('total').isFloat({ min: 0 })
];

// @route   GET /api/orders
// @desc    Get all orders with filtering and pagination
// @access  Private
router.get('/', authenticateToken, requirePermission('view_orders'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('platform').optional().isIn(['amazon', 'blinkit', 'organic', 'flipkart', 'swiggy']),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled', 'returned']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('search').optional().isString(),
  query('sortBy').optional().isIn(['orderDate', 'total', 'status', 'platform']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      platform,
      status,
      startDate,
      endDate,
      search,
      sortBy = 'orderDate',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};

    if (platform) filter.platform = platform;
    if (status) filter.status = status;

    // Date range filter
    if (startDate || endDate) {
      filter.orderDate = {};
      if (startDate) filter.orderDate.$gte = new Date(startDate);
      if (endDate) filter.orderDate.$lte = new Date(endDate);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { platformOrderId: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const orders = await Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('updatedBy', 'name email');

    // Get total count for pagination
    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', authenticateToken, requirePermission('view_orders'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('updatedBy', 'name email')
      .populate('createdBy', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', authenticateToken, requirePermission('edit_orders'), orderValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orderData = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({ order });
  } catch (error) {
    console.error('Create order error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Order number already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order
// @access  Private
router.put('/:id', authenticateToken, requirePermission('edit_orders'), orderValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order data
    Object.assign(order, req.body);
    order.updatedBy = req.user._id;

    await order.save();

    res.json({ order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', authenticateToken, requirePermission('edit_orders'), [
  body('status').isIn(['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled', 'returned']),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update status
    order.status = status;
    order.updatedBy = req.user._id;

    // Add to status history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: req.user._id,
      notes
    });

    await order.save();

    // TODO: Sync status back to platform (if API available)
    // await syncOrderStatusToPlatform(order);

    res.json({ 
      order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requirePermission('delete_orders'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/platform/:platform
// @desc    Get orders by platform
// @access  Private
router.get('/platform/:platform', authenticateToken, requirePermission('view_orders'), async (req, res) => {
  try {
    const { platform } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const orders = await Order.find({ platform })
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('updatedBy', 'name email');

    const total = await Order.countDocuments({ platform });

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get platform orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/status/:status
// @desc    Get orders by status
// @access  Private
router.get('/status/:status', authenticateToken, requirePermission('view_orders'), async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const orders = await Order.find({ status })
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('updatedBy', 'name email');

    const total = await Order.countDocuments({ status });

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get status orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 