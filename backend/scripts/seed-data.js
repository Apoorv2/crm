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
        name: 'Diamond Huggie Hoop Earrings',
        quantity: 1,
        unitPrice: 3500,
        totalPrice: 3500,
        sku: 'DHH-001',
        category: 'Hoops'
      }
    ],
    subtotal: 3500,
    tax: 630,
    discount: 0,
    total: 4130,
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
        name: 'Golden Flutter Studs',
        quantity: 1,
        unitPrice: 1800,
        totalPrice: 1800,
        sku: 'GFS-001',
        category: 'Studs'
      },
      {
        productId: 'PROD-003',
        name: 'Delicate Pendant Necklace',
        quantity: 1,
        unitPrice: 2200,
        totalPrice: 2200,
        sku: 'DPN-001',
        category: 'Necklaces'
      }
    ],
    subtotal: 4000,
    tax: 720,
    discount: 200,
    total: 4520,
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
        name: 'Pearl Drape Drops',
        quantity: 1,
        unitPrice: 2600,
        totalPrice: 2600,
        sku: 'PDD-001',
        category: 'Drops'
      }
    ],
    subtotal: 2600,
    tax: 468,
    discount: 0,
    total: 3068,
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
        name: 'Tennis Bracelet',
        quantity: 1,
        unitPrice: 4500,
        totalPrice: 4500,
        sku: 'TB-001',
        category: 'Bracelets'
      }
    ],
    subtotal: 4500,
    tax: 810,
    discount: 300,
    total: 5010,
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
        name: 'Statement Cocktail Ring',
        quantity: 1,
        unitPrice: 3800,
        totalPrice: 3800,
        sku: 'SCR-001',
        category: 'Rings'
      }
    ],
    subtotal: 3800,
    tax: 684,
    discount: 0,
    total: 4484,
    currency: 'INR',
    shipping: {
      method: 'Premium Delivery',
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
        name: 'Layered Chain Necklace',
        quantity: 1,
        unitPrice: 2800,
        totalPrice: 2800,
        sku: 'LCN-001',
        category: 'Necklaces'
      }
    ],
    subtotal: 2800,
    tax: 504,
    discount: 150,
    total: 3154,
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
    status: 'confirmed',
    customer: {
      name: 'Sophie Chen',
      email: 'sophie@example.com',
      phone: '+91-9876543216',
      address: {
        street: '555 Birch Ave',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-008',
        name: 'Earrings & Necklace Set',
        quantity: 1,
        unitPrice: 5200,
        totalPrice: 5200,
        sku: 'ENS-001',
        category: 'Sets'
      }
    ],
    subtotal: 5200,
    tax: 936,
    discount: 400,
    total: 5736,
    currency: 'INR',
    shipping: {
      method: 'Express',
      trackingNumber: 'TRK-006',
      estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      carrier: 'Blinkit Delivery'
    },
    syncStatus: 'synced',
    tags: []
  },
  // Additional jewelry orders for richer initial data
  {
    platform: 'amazon',
    platformOrderId: 'AMZ-003',
    orderNumber: 'ORD-008',
    orderDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    status: 'processing',
    customer: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91-9876543217',
      address: {
        street: '789 Rose Garden',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-009',
        name: 'Eyeconic 925 Silver Studs',
        quantity: 1,
        unitPrice: 1200,
        totalPrice: 1200,
        sku: 'ESS-001',
        category: 'Studs'
      }
    ],
    subtotal: 1200,
    tax: 216,
    discount: 0,
    total: 1416,
    currency: 'INR',
    shipping: {
      method: 'Standard',
      trackingNumber: 'TRK-007',
      estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      carrier: 'Amazon Logistics'
    },
    syncStatus: 'synced',
    tags: []
  },
  {
    platform: 'flipkart',
    platformOrderId: 'FLP-002',
    orderNumber: 'ORD-009',
    orderDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    status: 'delivered',
    customer: {
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      phone: '+91-9876543218',
      address: {
        street: '456 Lotus Lane',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-010',
        name: 'Tiny Sunbeam Loops',
        quantity: 1,
        unitPrice: 2200,
        totalPrice: 2200,
        sku: 'TSL-001',
        category: 'Hoops'
      },
      {
        productId: 'PROD-011',
        name: 'Charm Bracelet',
        quantity: 1,
        unitPrice: 3200,
        totalPrice: 3200,
        sku: 'CB-001',
        category: 'Bracelets'
      }
    ],
    subtotal: 5400,
    tax: 972,
    discount: 300,
    total: 6072,
    currency: 'INR',
    shipping: {
      method: 'Express',
      trackingNumber: 'TRK-008',
      estimatedDelivery: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      actualDelivery: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      carrier: 'Flipkart Logistics'
    },
    syncStatus: 'synced',
    tags: []
  },
  {
    platform: 'organic',
    platformOrderId: 'ORG-002',
    orderNumber: 'ORD-010',
    orderDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    status: 'confirmed',
    customer: {
      name: 'Anjali Patel',
      email: 'anjali@example.com',
      phone: '+91-9876543219',
      address: {
        street: '321 Tulip Street',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        pincode: '226001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-012',
        name: 'Gold Bow and Tassel Drop Earrings',
        quantity: 1,
        unitPrice: 3200,
        totalPrice: 3200,
        sku: 'GBT-001',
        category: 'Drops'
      }
    ],
    subtotal: 3200,
    tax: 576,
    discount: 200,
    total: 3576,
    currency: 'INR',
    shipping: {
      method: 'Premium Delivery',
      trackingNumber: 'TRK-009',
      estimatedDelivery: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      carrier: 'Courier Service'
    },
    syncStatus: 'synced',
    tags: []
  },
  {
    platform: 'swiggy',
    platformOrderId: 'SWG-002',
    orderNumber: 'ORD-011',
    orderDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), // 11 days ago
    status: 'dispatched',
    customer: {
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      phone: '+91-9876543220',
      address: {
        street: '654 Marigold Road',
        city: 'Chandigarh',
        state: 'Punjab',
        pincode: '160001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-013',
        name: 'Stackable Ring Set',
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
        sku: 'SRS-001',
        category: 'Rings'
      },
      {
        productId: 'PROD-014',
        name: 'Delicate Anklet',
        quantity: 1,
        unitPrice: 1400,
        totalPrice: 1400,
        sku: 'DA-001',
        category: 'Anklets'
      }
    ],
    subtotal: 2900,
    tax: 522,
    discount: 150,
    total: 3272,
    currency: 'INR',
    shipping: {
      method: 'Standard',
      trackingNumber: 'TRK-010',
      estimatedDelivery: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      carrier: 'Swiggy Delivery'
    },
    syncStatus: 'synced',
    tags: []
  },
  {
    platform: 'blinkit',
    platformOrderId: 'BLK-003',
    orderNumber: 'ORD-012',
    orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    status: 'delivered',
    customer: {
      name: 'Meera Reddy',
      email: 'meera@example.com',
      phone: '+91-9876543221',
      address: {
        street: '987 Jasmine Avenue',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        pincode: '641001',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'PROD-015',
        name: 'Bohemian Collection Earrings',
        quantity: 1,
        unitPrice: 3400,
        totalPrice: 3400,
        sku: 'BCE-001',
        category: 'Collections'
      }
    ],
    subtotal: 3400,
    tax: 612,
    discount: 250,
    total: 3762,
    currency: 'INR',
    shipping: {
      method: 'Express',
      trackingNumber: 'TRK-011',
      estimatedDelivery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      actualDelivery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
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

// Export the main seeding function
async function seedDatabase() {
  try {
    await connectDB();
    await seedUsers();
    await seedOrders();
    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  seedUsers,
  seedOrders
}; 