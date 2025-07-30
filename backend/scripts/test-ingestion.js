/**
 * Test Script for Order Ingestion Service
 * Demonstrates the functionality of background jobs and webhooks
 */

const OrderIngestionService = require('../services/order-ingestion');
const PlatformIntegrationService = require('../services/platform-integration');

async function testOrderIngestion() {
  console.log('🧪 Testing Order Ingestion Service...\n');

  try {
    // Initialize services
    const orderIngestionService = new OrderIngestionService();
    const platformIntegration = new PlatformIntegrationService();

    console.log('1️⃣ Testing Platform Integration Service...');
    
    // Test fetching orders from all platforms
    console.log('📥 Fetching orders from all platforms...');
    const allPlatformResults = await platformIntegration.fetchOrdersFromAllPlatforms();
    
    console.log('Results:');
    for (const [platform, result] of Object.entries(allPlatformResults)) {
      if (result.success) {
        console.log(`  ✅ ${platform}: ${result.count} orders`);
        result.orders.forEach(order => {
          console.log(`    - ${order.orderNumber}: ${order.customer.name} (${order.total} INR)`);
        });
      } else {
        console.log(`  ❌ ${platform}: ${result.error}`);
      }
    }

    console.log('\n2️⃣ Testing Individual Platform Fetching...');
    
    // Test fetching from specific platform
    const amazonOrders = await platformIntegration.fetchOrdersFromPlatform('amazon');
    console.log(`📦 Amazon orders: ${amazonOrders.length}`);
    
    const blinkitOrders = await platformIntegration.fetchOrdersFromPlatform('blinkit');
    console.log(`📦 Blinkit orders: ${blinkitOrders.length}`);

    console.log('\n3️⃣ Testing Webhook Processing...');
    
    // Test webhook data processing
    const mockAmazonWebhook = {
      amazon_order_id: 'AMZ-TEST-001',
      order_date: '2024-01-15T15:30:00Z',
      status: 'confirmed',
      buyer_name: 'Test Customer',
      buyer_email: 'test@example.com',
      buyer_phone: '+91-9876543210',
      items: [
        {
          asin: 'B08N5WRWNW',
          title: 'Test Diamond Earrings',
          quantity: 1,
          price: 2500,
          sku: 'TEST-001'
        }
      ],
      total_amount: 2500
    };

    console.log('📨 Processing mock Amazon webhook...');
    const webhookResult = await orderIngestionService.processWebhook('amazon', mockAmazonWebhook);
    
    if (webhookResult.success) {
      console.log(`  ✅ Webhook processed: ${webhookResult.action} order ${webhookResult.order.orderNumber}`);
    } else {
      console.log(`  ❌ Webhook failed: ${webhookResult.error}`);
    }

    console.log('\n4️⃣ Testing Manual Fetch Trigger...');
    
    // Test manual fetch trigger
    console.log('🔧 Triggering manual fetch for Amazon...');
    const manualFetchResult = await orderIngestionService.triggerManualFetch('amazon');
    
    if (manualFetchResult.success) {
      console.log(`  ✅ Manual fetch completed: ${manualFetchResult.count} orders`);
    } else {
      console.log(`  ❌ Manual fetch failed: ${manualFetchResult.error}`);
    }

    console.log('\n5️⃣ Testing Service Status...');
    
    // Test service status
    const status = orderIngestionService.getStatus();
    console.log('Service Status:', status);

    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testOrderIngestion();
}

module.exports = { testOrderIngestion }; 