const cron = require('node-cron');
const PlatformIntegrationService = require('./platform-integration');

/**
 * Order Ingestion Service
 * Handles background jobs and webhooks for fetching orders from platforms
 */
class OrderIngestionService {
  constructor() {
    this.platformIntegration = new PlatformIntegrationService();
    this.isRunning = false;
    this.jobs = new Map();
  }

  /**
   * Start the ingestion service
   */
  start() {
    if (this.isRunning) {
      console.log('Order ingestion service is already running');
      return;
    }

    console.log('Starting order ingestion service...');
    this.isRunning = true;

    // Schedule background jobs
    this.scheduleBackgroundJobs();

    // Start webhook handlers
    this.startWebhookHandlers();

    console.log('Order ingestion service started successfully');
  }

  /**
   * Stop the ingestion service
   */
  stop() {
    if (!this.isRunning) {
      console.log('Order ingestion service is not running');
      return;
    }

    console.log('Stopping order ingestion service...');
    this.isRunning = false;

    // Stop all scheduled jobs
    this.jobs.forEach(job => job.stop());
    this.jobs.clear();

    console.log('Order ingestion service stopped');
  }

  /**
   * Schedule background jobs for order fetching
   */
  scheduleBackgroundJobs() {
    // Fetch orders from all platforms every 15 minutes
    const fetchAllOrdersJob = cron.schedule('*/15 * * * *', async () => {
      console.log('Running scheduled job: Fetch orders from all platforms');
      await this.fetchOrdersFromAllPlatforms();
    }, {
      scheduled: false
    });

    // Fetch orders from specific platforms every 30 minutes
    const fetchSpecificPlatformsJob = cron.schedule('*/30 * * * *', async () => {
      console.log('Running scheduled job: Fetch orders from specific platforms');
      await this.fetchOrdersFromSpecificPlatforms();
    }, {
      scheduled: false
    });

    // Store job references
    this.jobs.set('fetchAllOrders', fetchAllOrdersJob);
    this.jobs.set('fetchSpecificPlatforms', fetchSpecificPlatformsJob);

    // Start the jobs
    fetchAllOrdersJob.start();
    fetchSpecificPlatformsJob.start();

    console.log('Background jobs scheduled successfully');
  }

  /**
   * Start webhook handlers
   */
  startWebhookHandlers() {
    console.log('Webhook handlers ready for incoming requests');
    // In production, this would set up Express routes for webhook endpoints
  }

  /**
   * Fetch orders from all platforms
   */
  async fetchOrdersFromAllPlatforms() {
    try {
      console.log('Fetching orders from all platforms...');
      
      const results = await this.platformIntegration.fetchOrdersFromAllPlatforms();
      
      let totalOrders = 0;
      let successCount = 0;
      let errorCount = 0;

      for (const [platform, result] of Object.entries(results)) {
        if (result.success) {
          console.log(`✅ ${platform}: ${result.count} orders fetched`);
          totalOrders += result.count;
          successCount++;
          
          // Save orders to database
          for (const order of result.orders) {
            await this.platformIntegration.saveOrder(order);
          }
        } else {
          console.log(`❌ ${platform}: ${result.error}`);
          errorCount++;
        }
      }

      console.log(`Order ingestion completed: ${totalOrders} orders processed, ${successCount} platforms successful, ${errorCount} platforms failed`);
      
      return {
        success: true,
        totalOrders,
        successCount,
        errorCount,
        results
      };
    } catch (error) {
      console.error('Error in fetchOrdersFromAllPlatforms:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Fetch orders from specific platforms
   */
  async fetchOrdersFromSpecificPlatforms() {
    try {
      console.log('Fetching orders from specific platforms...');
      
      // Define priority platforms (high-volume platforms)
      const priorityPlatforms = ['amazon', 'flipkart'];
      
      const results = {};
      
      for (const platform of priorityPlatforms) {
        try {
          console.log(`Fetching orders from ${platform}...`);
          const orders = await this.platformIntegration.fetchOrdersFromPlatform(platform);
          
          results[platform] = {
            success: true,
            count: orders.length,
            orders: orders
          };
          
          // Save orders to database
          for (const order of orders) {
            await this.platformIntegration.saveOrder(order);
          }
          
          console.log(`✅ ${platform}: ${orders.length} orders fetched`);
        } catch (error) {
          console.error(`❌ Error fetching from ${platform}:`, error.message);
          results[platform] = {
            success: false,
            error: error.message
          };
        }
      }
      
      return {
        success: true,
        results
      };
    } catch (error) {
      console.error('Error in fetchOrdersFromSpecificPlatforms:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process webhook from platform
   */
  async processWebhook(platform, webhookData) {
    try {
      console.log(`Processing webhook from ${platform}...`);
      
      // Validate webhook data
      if (!this.validateWebhookData(platform, webhookData)) {
        throw new Error('Invalid webhook data');
      }
      
      // Process the webhook
      const result = await this.platformIntegration.processWebhookData(platform, webhookData);
      
      console.log(`✅ Webhook processed: ${result.action} order ${result.order.orderNumber}`);
      
      return {
        success: true,
        action: result.action,
        order: result.order
      };
    } catch (error) {
      console.error(`❌ Error processing webhook from ${platform}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validate webhook data
   */
  validateWebhookData(platform, webhookData) {
    // Basic validation - in production, this would include signature verification
    if (!webhookData || typeof webhookData !== 'object') {
      return false;
    }
    
    // Platform-specific validation
    switch (platform) {
      case 'amazon':
        return webhookData.amazon_order_id && webhookData.order_date;
      case 'blinkit':
        return webhookData.blinkit_order_id && webhookData.created_at;
      case 'flipkart':
        return webhookData.flipkart_order_id && webhookData.order_date;
      case 'swiggy':
        return webhookData.swiggy_order_id && webhookData.created_at;
      case 'organic':
        return webhookData.order_id && webhookData.created_at;
      default:
        return false;
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeJobs: this.jobs.size,
      jobNames: Array.from(this.jobs.keys())
    };
  }

  /**
   * Manually trigger order fetching
   */
  async triggerManualFetch(platform = null) {
    try {
      if (platform) {
        console.log(`Manually triggering fetch for ${platform}...`);
        const orders = await this.platformIntegration.fetchOrdersFromPlatform(platform);
        
        for (const order of orders) {
          await this.platformIntegration.saveOrder(order);
        }
        
        return {
          success: true,
          platform,
          count: orders.length
        };
      } else {
        console.log('Manually triggering fetch for all platforms...');
        return await this.fetchOrdersFromAllPlatforms();
      }
    } catch (error) {
      console.error('Error in manual fetch:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = OrderIngestionService; 