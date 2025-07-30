const Order = require('../models/Order');
const {
  AmazonAPIClient,
  BlinkitAPIClient,
  FlipkartAPIClient,
  SwiggyAPIClient,
  OrganicAPIClient
} = require('./platform-clients');

/**
 * Platform Integration Service
 * Handles API differences across different e-commerce platforms
 * Converts platform-specific data to unified format
 */
class PlatformIntegrationService {
  constructor() {
    this.platforms = {
      amazon: new AmazonAPIClient(),
      blinkit: new BlinkitAPIClient(),
      flipkart: new FlipkartAPIClient(),
      swiggy: new SwiggyAPIClient(),
      organic: new OrganicAPIClient()
    };
  }

  /**
   * Fetch orders from all platforms
   */
  async fetchOrdersFromAllPlatforms() {
    const results = {};
    
    for (const [platform, client] of Object.entries(this.platforms)) {
      try {
        console.log(`Fetching orders from ${platform}...`);
        const orders = await client.fetchOrders();
        results[platform] = {
          success: true,
          count: orders.length,
          orders: orders
        };
      } catch (error) {
        console.error(`Error fetching from ${platform}:`, error.message);
        results[platform] = {
          success: false,
          error: error.message
        };
      }
    }
    
    return results;
  }

  /**
   * Fetch orders from specific platform
   */
  async fetchOrdersFromPlatform(platform) {
    if (!this.platforms[platform]) {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    
    return await this.platforms[platform].fetchOrders();
  }

  /**
   * Update order status on platform
   */
  async updateOrderStatusOnPlatform(platform, orderId, status) {
    if (!this.platforms[platform]) {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    
    return await this.platforms[platform].updateOrderStatus(orderId, status);
  }

  /**
   * Process webhook data from platform
   */
  async processWebhookData(platform, webhookData) {
    if (!this.platforms[platform]) {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    
    const transformedOrder = await this.platforms[platform].transformWebhookData(webhookData);
    return await this.saveOrder(transformedOrder);
  }

  /**
   * Save order to database
   */
  async saveOrder(orderData) {
    try {
      // Check if order already exists
      const existingOrder = await Order.findOne({
        platform: orderData.platform,
        platformOrderId: orderData.platformOrderId
      });

      if (existingOrder) {
        // Update existing order
        Object.assign(existingOrder, orderData);
        await existingOrder.save();
        return { action: 'updated', order: existingOrder };
      } else {
        // Create new order
        const newOrder = new Order(orderData);
        await newOrder.save();
        return { action: 'created', order: newOrder };
      }
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  }
}

module.exports = PlatformIntegrationService; 