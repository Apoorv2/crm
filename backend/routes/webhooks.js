const express = require('express');
const { body, validationResult } = require('express-validator');
const OrderIngestionService = require('../services/order-ingestion');

const router = express.Router();

// Initialize order ingestion service
const orderIngestionService = new OrderIngestionService();

/**
 * Webhook Routes for Platform Integration
 * These endpoints receive real-time order notifications from platforms
 */

// @route   POST /api/webhooks/amazon
// @desc    Handle Amazon order webhooks
// @access  Public (but should be secured with signature verification)
router.post('/amazon', [
  body('amazon_order_id').notEmpty(),
  body('order_date').isISO8601(),
  body('status').notEmpty(),
  body('buyer_name').notEmpty(),
  body('buyer_email').isEmail(),
  body('items').isArray({ min: 1 }),
  body('total_amount').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid webhook data',
        details: errors.array() 
      });
    }

    // Verify webhook signature (in production)
    // if (!verifyAmazonWebhookSignature(req)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    console.log('Received Amazon webhook:', req.body);

    // Process the webhook
    const result = await orderIngestionService.processWebhook('amazon', req.body);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Order ${result.action}: ${result.order.orderNumber}`,
        order: result.order
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Amazon webhook error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// @route   POST /api/webhooks/blinkit
// @desc    Handle Blinkit order webhooks
// @access  Public
router.post('/blinkit', [
  body('blinkit_order_id').notEmpty(),
  body('created_at').isISO8601(),
  body('order_status').notEmpty(),
  body('customer_name').notEmpty(),
  body('customer_email').isEmail(),
  body('items').isArray({ min: 1 }),
  body('total_amount').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid webhook data',
        details: errors.array() 
      });
    }

    console.log('Received Blinkit webhook:', req.body);

    const result = await orderIngestionService.processWebhook('blinkit', req.body);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Order ${result.action}: ${result.order.orderNumber}`,
        order: result.order
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Blinkit webhook error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// @route   POST /api/webhooks/flipkart
// @desc    Handle Flipkart order webhooks
// @access  Public
router.post('/flipkart', [
  body('flipkart_order_id').notEmpty(),
  body('order_date').isISO8601(),
  body('status').notEmpty(),
  body('customer.name').notEmpty(),
  body('customer.email').isEmail(),
  body('items').isArray({ min: 1 }),
  body('total_amount').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid webhook data',
        details: errors.array() 
      });
    }

    console.log('Received Flipkart webhook:', req.body);

    const result = await orderIngestionService.processWebhook('flipkart', req.body);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Order ${result.action}: ${result.order.orderNumber}`,
        order: result.order
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Flipkart webhook error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// @route   POST /api/webhooks/swiggy
// @desc    Handle Swiggy order webhooks
// @access  Public
router.post('/swiggy', [
  body('swiggy_order_id').notEmpty(),
  body('created_at').isISO8601(),
  body('status').notEmpty(),
  body('customer.name').notEmpty(),
  body('customer.email').isEmail(),
  body('items').isArray({ min: 1 }),
  body('total_amount').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid webhook data',
        details: errors.array() 
      });
    }

    console.log('Received Swiggy webhook:', req.body);

    const result = await orderIngestionService.processWebhook('swiggy', req.body);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Order ${result.action}: ${result.order.orderNumber}`,
        order: result.order
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Swiggy webhook error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// @route   POST /api/webhooks/organic
// @desc    Handle Organic website order webhooks
// @access  Public
router.post('/organic', [
  body('order_id').notEmpty(),
  body('created_at').isISO8601(),
  body('status').notEmpty(),
  body('customer.name').notEmpty(),
  body('customer.email').isEmail(),
  body('items').isArray({ min: 1 }),
  body('total_amount').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid webhook data',
        details: errors.array() 
      });
    }

    console.log('Received Organic webhook:', req.body);

    const result = await orderIngestionService.processWebhook('organic', req.body);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Order ${result.action}: ${result.order.orderNumber}`,
        order: result.order
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Organic webhook error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// @route   GET /api/webhooks/status
// @desc    Get webhook service status
// @access  Private
router.get('/status', async (req, res) => {
  try {
    const status = orderIngestionService.getStatus();
    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Webhook status error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// @route   POST /api/webhooks/trigger-fetch
// @desc    Manually trigger order fetching
// @access  Private
router.post('/trigger-fetch', [
  body('platform').optional().isIn(['amazon', 'blinkit', 'flipkart', 'swiggy', 'organic'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: errors.array() 
      });
    }

    const { platform } = req.body;

    console.log(`Manually triggering fetch for platform: ${platform || 'all'}`);

    const result = await orderIngestionService.triggerManualFetch(platform);

    if (result.success) {
      res.json({
        success: true,
        message: `Fetch completed successfully`,
        result
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Trigger fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

module.exports = router; 