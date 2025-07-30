const mongoose = require('mongoose');
const OrderIngestionService = require('./services/order-ingestion');

// MongoDB connection function
async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb:27017/crm?authSource=admin';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Wait for MongoDB to be ready
async function waitForMongoDB() {
  const maxRetries = 30;
  const retryInterval = 2000; // 2 seconds

  for (let i = 0; i < maxRetries; i++) {
    try {
      await connectDB();
      return true;
    } catch (error) {
      console.log(`Attempt ${i + 1}/${maxRetries}: MongoDB not ready, retrying in ${retryInterval/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }
  
  console.error('❌ Failed to connect to MongoDB after maximum retries');
  return false;
}

// Check if data exists in database
async function checkIfDataExists() {
  try {
    const orderCount = await mongoose.model('Order').countDocuments();
    const userCount = await mongoose.model('User').countDocuments();
    
    console.log(`📊 Database status: ${orderCount} orders, ${userCount} users`);
    return orderCount > 0 || userCount > 0;
  } catch (error) {
    console.error('Error checking data existence:', error);
    return false;
  }
}

// Seed database with initial data
async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with initial data...');
    
    // Import and run seed script
    const seedScript = require('./scripts/seed-data');
    await seedScript.seedDatabase();
    
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Initialize order ingestion service
async function initializeOrderIngestion() {
  try {
    console.log('🚀 Initializing order ingestion service...');
    
    const orderIngestionService = new OrderIngestionService();
    
    // Start the service
    orderIngestionService.start();
    
    // Store service instance globally for access
    global.orderIngestionService = orderIngestionService;
    
    console.log('✅ Order ingestion service initialized');
    
    // Log service status
    const status = orderIngestionService.getStatus();
    console.log('📊 Order ingestion service status:', status);
    
  } catch (error) {
    console.error('❌ Error initializing order ingestion service:', error);
    // Don't throw error - service is optional for MVP
  }
}

// Main startup function
async function startup() {
  try {
    console.log('🚀 Starting Palmonas CRM Backend...');
    
    // Wait for MongoDB
    const mongoReady = await waitForMongoDB();
    if (!mongoReady) {
      throw new Error('MongoDB connection failed');
    }
    
    // Check if data exists
    const dataExists = await checkIfDataExists();
    
    // Seed database if empty
    if (!dataExists) {
      await seedDatabase();
    } else {
      console.log('📊 Database already contains data, skipping seeding');
    }
    
    // Initialize order ingestion service
    await initializeOrderIngestion();
    
    // Start the Express server
    console.log('🌐 Starting Express server...');
    require('./server');
    
  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  // Stop order ingestion service if running
  if (global.orderIngestionService) {
    global.orderIngestionService.stop();
  }
  
  // Close MongoDB connection
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  }
  
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  // Stop order ingestion service if running
  if (global.orderIngestionService) {
    global.orderIngestionService.stop();
  }
  
  // Close MongoDB connection
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  }
  
  process.exit(0);
});

// Start the application
startup(); 