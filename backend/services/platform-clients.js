/**
 * Platform API Clients
 * Individual clients for each e-commerce platform
 */

/**
 * Amazon API Client
 */
class AmazonAPIClient {
  constructor() {
    this.platformName = 'amazon';
    this.apiKey = process.env.AMAZON_API_KEY;
    this.apiSecret = process.env.AMAZON_API_SECRET;
  }

  async fetchOrders() {
    try {
      console.log('Fetching orders from Amazon...');
      const mockOrders = this.getMockOrders();
      return mockOrders.map(order => this.transformAmazonOrder(order));
    } catch (error) {
      console.error('Amazon API error:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      console.log(`Updating Amazon order ${orderId} status to ${status}`);
      return { success: true, message: 'Status updated successfully' };
    } catch (error) {
      console.error('Amazon status update error:', error);
      throw error;
    }
  }

  async transformWebhookData(webhookData) {
    return {
      platform: 'amazon',
      platformOrderId: webhookData.amazon_order_id,
      orderNumber: `AMZ-${webhookData.amazon_order_id}`,
      orderDate: new Date(webhookData.order_date),
      status: this.mapAmazonStatus(webhookData.status),
      customer: {
        name: webhookData.buyer_name,
        email: webhookData.buyer_email,
        phone: webhookData.buyer_phone
      },
      items: webhookData.items.map(item => ({
        productId: item.asin,
        name: item.title,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        sku: item.sku
      })),
      total: webhookData.total_amount,
      platformData: webhookData
    };
  }

  getMockOrders() {
    return [
      {
        amazon_order_id: 'AMZ-2024-001',
        order_date: '2024-01-15T10:30:00Z',
        status: 'shipped',
        buyer_name: 'John Doe',
        buyer_email: 'john@example.com',
        buyer_phone: '+91-9876543210',
        items: [
          {
            asin: 'B08N5WRWNW',
            title: 'Diamond Huggie Hoop Earrings',
            quantity: 1,
            price: 3500,
            sku: 'DHH-001'
          }
        ],
        total_amount: 3500
      }
    ];
  }

  transformAmazonOrder(amazonOrder) {
    return {
      platform: 'amazon',
      platformOrderId: amazonOrder.amazon_order_id,
      orderNumber: `AMZ-${amazonOrder.amazon_order_id}`,
      orderDate: new Date(amazonOrder.order_date),
      status: this.mapAmazonStatus(amazonOrder.status),
      customer: {
        name: amazonOrder.buyer_name,
        email: amazonOrder.buyer_email,
        phone: amazonOrder.buyer_phone
      },
      items: amazonOrder.items.map(item => ({
        productId: item.asin,
        name: item.title,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        sku: item.sku
      })),
      total: amazonOrder.total_amount,
      platformData: amazonOrder
    };
  }

  mapAmazonStatus(amazonStatus) {
    const statusMap = {
      'pending': 'pending',
      'shipped': 'dispatched',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    return statusMap[amazonStatus] || 'pending';
  }
}

/**
 * Blinkit API Client
 */
class BlinkitAPIClient {
  constructor() {
    this.platformName = 'blinkit';
    this.apiKey = process.env.BLINKIT_API_KEY;
    this.apiSecret = process.env.BLINKIT_API_SECRET;
  }

  async fetchOrders() {
    try {
      console.log('Fetching orders from Blinkit...');
      const mockOrders = this.getMockOrders();
      return mockOrders.map(order => this.transformBlinkitOrder(order));
    } catch (error) {
      console.error('Blinkit API error:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      console.log(`Updating Blinkit order ${orderId} status to ${status}`);
      return { success: true, message: 'Status updated successfully' };
    } catch (error) {
      console.error('Blinkit status update error:', error);
      throw error;
    }
  }

  async transformWebhookData(webhookData) {
    return {
      platform: 'blinkit',
      platformOrderId: webhookData.blinkit_order_id,
      orderNumber: `BLK-${webhookData.blinkit_order_id}`,
      orderDate: new Date(webhookData.created_at),
      status: this.mapBlinkitStatus(webhookData.order_status),
      customer: {
        name: webhookData.customer_name,
        email: webhookData.customer_email,
        phone: webhookData.customer_phone
      },
      items: webhookData.items.map(item => ({
        productId: item.product_id,
        name: item.product_name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        sku: item.sku
      })),
      total: webhookData.total_amount,
      platformData: webhookData
    };
  }

  getMockOrders() {
    return [
      {
        blinkit_order_id: 'BLK-2024-001',
        created_at: '2024-01-15T11:00:00Z',
        order_status: 'confirmed',
        customer_name: 'Jane Smith',
        customer_email: 'jane@example.com',
        customer_phone: '+91-9876543211',
        items: [
          {
            product_id: 'BLK-001',
            product_name: 'Golden Flutter Studs',
            quantity: 2,
            price: 1800,
            sku: 'GFS-001'
          }
        ],
        total_amount: 3600
      }
    ];
  }

  transformBlinkitOrder(blinkitOrder) {
    return {
      platform: 'blinkit',
      platformOrderId: blinkitOrder.blinkit_order_id,
      orderNumber: `BLK-${blinkitOrder.blinkit_order_id}`,
      orderDate: new Date(blinkitOrder.created_at),
      status: this.mapBlinkitStatus(blinkitOrder.order_status),
      customer: {
        name: blinkitOrder.customer_name,
        email: blinkitOrder.customer_email,
        phone: blinkitOrder.customer_phone
      },
      items: blinkitOrder.items.map(item => ({
        productId: item.product_id,
        name: item.product_name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        sku: item.sku
      })),
      total: blinkitOrder.total_amount,
      platformData: blinkitOrder
    };
  }

  mapBlinkitStatus(blinkitStatus) {
    const statusMap = {
      'confirmed': 'confirmed',
      'preparing': 'processing',
      'out_for_delivery': 'dispatched',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    return statusMap[blinkitStatus] || 'pending';
  }
}

/**
 * Flipkart API Client
 */
class FlipkartAPIClient {
  constructor() {
    this.platformName = 'flipkart';
    this.apiKey = process.env.FLIPKART_API_KEY;
    this.apiSecret = process.env.FLIPKART_API_SECRET;
  }

  async fetchOrders() {
    try {
      console.log('Fetching orders from Flipkart...');
      const mockOrders = this.getMockOrders();
      return mockOrders.map(order => this.transformFlipkartOrder(order));
    } catch (error) {
      console.error('Flipkart API error:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      console.log(`Updating Flipkart order ${orderId} status to ${status}`);
      return { success: true, message: 'Status updated successfully' };
    } catch (error) {
      console.error('Flipkart status update error:', error);
      throw error;
    }
  }

  async transformWebhookData(webhookData) {
    return {
      platform: 'flipkart',
      platformOrderId: webhookData.flipkart_order_id,
      orderNumber: `FLP-${webhookData.flipkart_order_id}`,
      orderDate: new Date(webhookData.order_date),
      status: this.mapFlipkartStatus(webhookData.status),
      customer: {
        name: webhookData.customer.name,
        email: webhookData.customer.email,
        phone: webhookData.customer.phone
      },
      items: webhookData.items.map(item => ({
        productId: item.product_id,
        name: item.title,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        sku: item.sku
      })),
      total: webhookData.total_amount,
      platformData: webhookData
    };
  }

  getMockOrders() {
    return [
      {
        flipkart_order_id: 'FLP-2024-001',
        order_date: '2024-01-15T12:00:00Z',
        status: 'processing',
        customer: {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+91-9876543212'
        },
        items: [
          {
            product_id: 'FLP-001',
            title: 'Pearl Drape Drops',
            quantity: 1,
            price: 2600,
            sku: 'PDD-001'
          }
        ],
        total_amount: 2600
      }
    ];
  }

  transformFlipkartOrder(flipkartOrder) {
    return {
      platform: 'flipkart',
      platformOrderId: flipkartOrder.flipkart_order_id,
      orderNumber: `FLP-${flipkartOrder.flipkart_order_id}`,
      orderDate: new Date(flipkartOrder.order_date),
      status: this.mapFlipkartStatus(flipkartOrder.status),
      customer: {
        name: flipkartOrder.customer.name,
        email: flipkartOrder.customer.email,
        phone: flipkartOrder.customer.phone
      },
      items: flipkartOrder.items.map(item => ({
        productId: item.product_id,
        name: item.title,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        sku: item.sku
      })),
      total: flipkartOrder.total_amount,
      platformData: flipkartOrder
    };
  }

  mapFlipkartStatus(flipkartStatus) {
    const statusMap = {
      'confirmed': 'confirmed',
      'processing': 'processing',
      'shipped': 'dispatched',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    return statusMap[flipkartStatus] || 'pending';
  }
}

/**
 * Swiggy API Client
 */
class SwiggyAPIClient {
  constructor() {
    this.platformName = 'swiggy';
    this.apiKey = process.env.SWIGGY_API_KEY;
    this.apiSecret = process.env.SWIGGY_API_SECRET;
  }

  async fetchOrders() {
    try {
      console.log('Fetching orders from Swiggy...');
      const mockOrders = this.getMockOrders();
      return mockOrders.map(order => this.transformSwiggyOrder(order));
    } catch (error) {
      console.error('Swiggy API error:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      console.log(`Updating Swiggy order ${orderId} status to ${status}`);
      return { success: true, message: 'Status updated successfully' };
    } catch (error) {
      console.error('Swiggy status update error:', error);
      throw error;
    }
  }

  async transformWebhookData(webhookData) {
    return {
      platform: 'swiggy',
      platformOrderId: webhookData.swiggy_order_id,
      orderNumber: `SWG-${webhookData.swiggy_order_id}`,
      orderDate: new Date(webhookData.created_at),
      status: this.mapSwiggyStatus(webhookData.status),
      customer: {
        name: webhookData.customer.name,
        email: webhookData.customer.email,
        phone: webhookData.customer.phone
      },
      items: webhookData.items.map(item => ({
        productId: item.item_id,
        name: item.item_name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        sku: item.sku
      })),
      total: webhookData.total_amount,
      platformData: webhookData
    };
  }

  getMockOrders() {
    return [
      {
        swiggy_order_id: 'SWG-2024-001',
        created_at: '2024-01-15T13:00:00Z',
        status: 'confirmed',
        customer: {
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          phone: '+91-9876543213'
        },
        items: [
          {
            item_id: 'SWG-001',
            item_name: 'Tennis Bracelet',
            quantity: 1,
            price: 4500,
            sku: 'TB-001'
          }
        ],
        total_amount: 4500
      }
    ];
  }

  transformSwiggyOrder(swiggyOrder) {
    return {
      platform: 'swiggy',
      platformOrderId: swiggyOrder.swiggy_order_id,
      orderNumber: `SWG-${swiggyOrder.swiggy_order_id}`,
      orderDate: new Date(swiggyOrder.created_at),
      status: this.mapSwiggyStatus(swiggyOrder.status),
      customer: {
        name: swiggyOrder.customer.name,
        email: swiggyOrder.customer.email,
        phone: swiggyOrder.customer.phone
      },
      items: swiggyOrder.items.map(item => ({
        productId: item.item_id,
        name: item.item_name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        sku: item.sku
      })),
      total: swiggyOrder.total_amount,
      platformData: swiggyOrder
    };
  }

  mapSwiggyStatus(swiggyStatus) {
    const statusMap = {
      'confirmed': 'confirmed',
      'preparing': 'processing',
      'out_for_delivery': 'dispatched',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    return statusMap[swiggyStatus] || 'pending';
  }
}

/**
 * Organic Website API Client
 */
class OrganicAPIClient {
  constructor() {
    this.platformName = 'organic';
    this.apiKey = process.env.ORGANIC_API_KEY;
    this.apiSecret = process.env.ORGANIC_API_SECRET;
  }

  async fetchOrders() {
    try {
      console.log('Fetching orders from Organic website...');
      const mockOrders = this.getMockOrders();
      return mockOrders.map(order => this.transformOrganicOrder(order));
    } catch (error) {
      console.error('Organic API error:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      console.log(`Updating Organic order ${orderId} status to ${status}`);
      return { success: true, message: 'Status updated successfully' };
    } catch (error) {
      console.error('Organic status update error:', error);
      throw error;
    }
  }

  async transformWebhookData(webhookData) {
    return {
      platform: 'organic',
      platformOrderId: webhookData.order_id,
      orderNumber: `ORG-${webhookData.order_id}`,
      orderDate: new Date(webhookData.created_at),
      status: this.mapOrganicStatus(webhookData.status),
      customer: {
        name: webhookData.customer.name,
        email: webhookData.customer.email,
        phone: webhookData.customer.phone
      },
      items: webhookData.items.map(item => ({
        productId: item.product_id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        sku: item.sku
      })),
      total: webhookData.total_amount,
      platformData: webhookData
    };
  }

  getMockOrders() {
    return [
      {
        order_id: 'ORG-2024-001',
        created_at: '2024-01-15T14:00:00Z',
        status: 'pending',
        customer: {
          name: 'David Brown',
          email: 'david@example.com',
          phone: '+91-9876543214'
        },
        items: [
          {
            product_id: 'ORG-001',
            name: 'Statement Cocktail Ring',
            quantity: 1,
            price: 3800,
            sku: 'SCR-001'
          }
        ],
        total_amount: 3800
      }
    ];
  }

  transformOrganicOrder(organicOrder) {
    return {
      platform: 'organic',
      platformOrderId: organicOrder.order_id,
      orderNumber: `ORG-${organicOrder.order_id}`,
      orderDate: new Date(organicOrder.created_at),
      status: this.mapOrganicStatus(organicOrder.status),
      customer: {
        name: organicOrder.customer.name,
        email: organicOrder.customer.email,
        phone: organicOrder.customer.phone
      },
      items: organicOrder.items.map(item => ({
        productId: item.product_id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        sku: item.sku
      })),
      total: organicOrder.total_amount,
      platformData: organicOrder
    };
  }

  mapOrganicStatus(organicStatus) {
    const statusMap = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'processing': 'processing',
      'shipped': 'dispatched',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    return statusMap[organicStatus] || 'pending';
  }
}

module.exports = {
  AmazonAPIClient,
  BlinkitAPIClient,
  FlipkartAPIClient,
  SwiggyAPIClient,
  OrganicAPIClient
}; 