const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Order = require('../models/Order');

// Sample users data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@palmonas.com',
    password: 'admin123',
    role: 'admin',
    isActive: true
  },
  {
    name: 'Support User',
    email: 'support@palmonas.com',
    password: 'support123',
    role: 'support',
    isActive: true
  },
  {
    name: 'Read Only User',
    email: 'readonly@palmonas.com',
    password: 'readonly123',
    role: 'readonly',
    isActive: true
  }
];

// Sample orders data with recent dates (within last 30 days)
const sampleOrders = [
  {
    platform: 'amazon',
    platformOrderId: 'AMZ-001',
    orderNumber: 'ORD-001',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'delivered',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91-9876543210',
      address: {
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-001',
        name: 'Wireless Headphones',
        quantity: 2,
        unitPrice: 1500,
        totalPrice: 3000,
        sku: 'WH-001',
        category: 'Electronics'
      }
    ],
    subtotal: 3000,
    tax: 540,
    discount: 0,
    total: 3640,
    currency: 'INR',
    shipping: {
      method: 'Express',
      trackingNumber: 'TRK-001',
      estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      carrier: 'Amazon Logistics'
    },
    syncStatus: 'synced',
    tags: []
  },
  {
    platform: 'blinkit',
    platformOrderId: 'BLK-001',
    orderNumber: 'ORD-002',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: 'processing',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91-9876543211',
      address: {
        street: '456 Oak Ave',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-002',
        name: 'Organic Bananas',
        quantity: 5,
        unitPrice: 80,
        totalPrice: 400,
        sku: 'OB-001',
        category: 'Groceries'
      },
      {
        productId: 'PROD-003',
        name: 'Fresh Milk',
        quantity: 2,
        unitPrice: 60,
        totalPrice: 120,
        sku: 'FM-001',
        category: 'Dairy'
      }
    ],
    subtotal: 520,
    tax: 94,
    discount: 20,
    total: 644,
    currency: 'INR',
    shipping: {
      method: 'Quick Delivery',
      trackingNumber: 'TRK-002',
      estimatedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      carrier: 'Blinkit Delivery'
    },
    syncStatus: 'synced',
    tags: []
  },
  {
    platform: 'organic',
    platformOrderId: 'ORG-001',
    orderNumber: 'ORD-003',
    orderDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    status: 'pending',
    customer: {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      phone: '+91-9876543212',
      address: {
        street: '789 Pine Rd',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-004',
        name: 'Organic Honey',
        quantity: 1,
        unitPrice: 500,
        totalPrice: 500,
        sku: 'OH-001',
        category: 'Organic'
      }
    ],
    subtotal: 500,
    tax: 90,
    discount: 0,
    total: 670,
    currency: 'INR',
    shipping: {
      method: 'Standard',
      trackingNumber: 'TRK-003',
      estimatedDelivery: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      carrier: 'Courier Service'
    },
    syncStatus: 'synced',
    tags: []
  },
  {
    platform: 'flipkart',
    platformOrderId: 'FLP-001',
    orderNumber: 'ORD-004',
    orderDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    status: 'dispatched',
    customer: {
      name: 'Alice Brown',
      email: 'alice@example.com',
      phone: '+91-9876543213',
      address: {
        street: '321 Elm St',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-005',
        name: 'Smartphone',
        quantity: 1,
        unitPrice: 25000,
        totalPrice: 25000,
        sku: 'SP-001',
        category: 'Electronics'
      }
    ],
    subtotal: 25000,
    tax: 4500,
    discount: 1000,
    total: 28500,
    currency: 'INR',
    shipping: {
      method: 'Free Delivery',
      trackingNumber: 'TRK-004',
      estimatedDelivery: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      carrier: 'Flipkart Logistics'
    },
    syncStatus: 'synced',
    tags: []
  },
  {
    platform: 'swiggy',
    platformOrderId: 'SWG-001',
    orderNumber: 'ORD-005',
    orderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    status: 'cancelled',
    customer: {
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      phone: '+91-9876543214',
      address: {
        street: '654 Maple Dr',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-006',
        name: 'Pizza Margherita',
        quantity: 2,
        unitPrice: 400,
        totalPrice: 800,
        sku: 'PM-001',
        category: 'Food'
      }
    ],
    subtotal: 800,
    tax: 144,
    discount: 0,
    total: 1004,
    currency: 'INR',
    shipping: {
      method: 'Food Delivery',
      carrier: 'Swiggy Delivery'
    },
    syncStatus: 'synced',
    tags: []
  },
  {
    platform: 'amazon',
    platformOrderId: 'AMZ-002',
    orderNumber: 'ORD-006',
    orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: 'delivered',
    customer: {
      name: 'Emma Johnson',
      email: 'emma@example.com',
      phone: '+91-9876543215',
      address: {
        street: '987 Cedar Ln',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-007',
        name: 'Laptop Stand',
        quantity: 1,
        unitPrice: 1200,
        totalPrice: 1200,
        sku: 'LS-001',
        category: 'Electronics'
      }
    ],
    subtotal: 1200,
    tax: 216,
    discount: 100,
    total: 1316,
    currency: 'INR',
    shipping: {
      method: 'Standard',
      trackingNumber: 'TRK-005',
      estimatedDelivery: new Date(Date.now()),
      actualDelivery: new Date(Date.now()),
      carrier: 'Amazon Logistics'
    },
    syncStatus: 'synced',
    tags: []
  },
  {
    platform: 'blinkit',
    platformOrderId: 'BLK-002',
    orderNumber: 'ORD-007',
    orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'dispatched',
    customer: {
      name: 'David Lee',
      email: 'david@example.com',
      phone: '+91-9876543216',
      address: {
        street: '147 Birch St',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-008',
        name: 'Fresh Vegetables',
        quantity: 3,
        unitPrice: 150,
        totalPrice: 450,
        sku: 'FV-001',
        category: 'Groceries'
      }
    ],
    subtotal: 450,
    tax: 81,
    discount: 0,
    total: 531,
    currency: 'INR',
    shipping: {
      method: 'Quick Delivery',
      trackingNumber: 'TRK-006',
      estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      carrier: 'Blinkit Delivery'
    },
    syncStatus: 'synced',
    tags: []
  }
];

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/crm?authSource=admin');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Seed users
async function seedUsers() {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create users (password will be hashed by User model pre-save hook)
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.email}`);
    }

    console.log('Users seeded successfully!');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

// Seed orders
async function seedOrders() {
  try {
    // Clear existing orders
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // Get admin user for createdBy field
    const adminUser = await User.findOne({ email: 'admin@palmonas.com' });
    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    // Create orders
    for (const orderData of sampleOrders) {
      const order = new Order({
        ...orderData,
        createdBy: adminUser._id,
        updatedBy: {
          _id: adminUser._id,
          email: adminUser.email,
          name: adminUser.name
        },
        statusHistory: [
          {
            status: orderData.status,
            timestamp: new Date(),
            updatedBy: adminUser._id
          }
        ]
      });
      await order.save();
      console.log(`Created order: ${orderData.orderNumber}`);
    }

    console.log('Orders seeded successfully!');
  } catch (error) {
    console.error('Error seeding orders:', error);
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    await connectDB();
    await seedUsers();
    await seedOrders();
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedUsers, seedOrders }; 