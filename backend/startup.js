const mongoose = require('mongoose');
const { seedDatabase } = require('./scripts/seed-data');

// Wait for MongoDB to be ready
async function waitForMongoDB() {
  const maxRetries = 30;
  const retryDelay = 2000; // 2 seconds
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb:27017/crm?authSource=admin');
      console.log('✅ Connected to MongoDB');
      return true;
    } catch (error) {
      console.log(`⏳ Waiting for MongoDB... (attempt ${i + 1}/${maxRetries})`);
      if (i === maxRetries - 1) {
        console.error('❌ Failed to connect to MongoDB after maximum retries');
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

// Check if data already exists
async function checkIfDataExists() {
  try {
    const User = require('./models/User');
    const Order = require('./models/Order');
    
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    
    return { userCount, orderCount };
  } catch (error) {
    console.error('Error checking existing data:', error);
    return { userCount: 0, orderCount: 0 };
  }
}

// Main startup function
async function startup() {
  console.log('🚀 Starting CRM backend with auto-seeding...');
  
  // Wait for MongoDB to be ready
  const mongoReady = await waitForMongoDB();
  if (!mongoReady) {
    console.error('❌ Cannot proceed without MongoDB connection');
    process.exit(1);
  }
  
  // Check if data already exists
  const { userCount, orderCount } = await checkIfDataExists();
  
  if (userCount === 0 && orderCount === 0) {
    console.log('📊 Database is empty, seeding initial data...');
    try {
      await seedDatabase();
      console.log('✅ Database seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding database:', error);
      // Don't exit, continue with startup even if seeding fails
    }
  } else {
    console.log(`📊 Database already has data: ${userCount} users, ${orderCount} orders`);
  }
  
  // Start the server
  console.log('🌐 Starting Express server...');
  require('./server');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start the application
startup().catch(error => {
  console.error('❌ Startup failed:', error);
  process.exit(1);
}); 