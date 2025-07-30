const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb:27017/crm?authSource=admin');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Generate random date within a range
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate random order data
function generateOrderData(orderNumber, platform, adminUser) {
  const platforms = ['amazon', 'blinkit', 'organic', 'flipkart', 'swiggy'];
  const statuses = ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'];
  const customers = [
    { name: 'Alice Johnson', email: 'alice@example.com', phone: '+91-9876543201' },
    { name: 'Bob Smith', email: 'bob@example.com', phone: '+91-9876543202' },
    { name: 'Carol Davis', email: 'carol@example.com', phone: '+91-9876543203' },
    { name: 'David Wilson', email: 'david@example.com', phone: '+91-9876543204' },
    { name: 'Eva Brown', email: 'eva@example.com', phone: '+91-9876543205' },
    { name: 'Frank Miller', email: 'frank@example.com', phone: '+91-9876543206' },
    { name: 'Grace Lee', email: 'grace@example.com', phone: '+91-9876543207' },
    { name: 'Henry Taylor', email: 'henry@example.com', phone: '+91-9876543208' },
    { name: 'Ivy Chen', email: 'ivy@example.com', phone: '+91-9876543209' },
    { name: 'Jack Anderson', email: 'jack@example.com', phone: '+91-9876543210' }
  ];

  const products = [
    // Studs & Small Earrings
    { name: 'Eyeconic 925 Silver Studs', category: 'Studs', basePrice: 1200 },
    { name: 'Golden Flutter Studs', category: 'Studs', basePrice: 1800 },
    { name: 'Tiny Sunbeam Loops', category: 'Hoops', basePrice: 2200 },
    { name: 'Diamond Huggie Hoop Earrings', category: 'Hoops', basePrice: 3500 },
    { name: 'Gilded Cluster Hoops', category: 'Hoops', basePrice: 2800 },
    
    // Drop & Dangle Earrings
    { name: 'Gold Bow and Tassel Drop Earrings', category: 'Drops', basePrice: 3200 },
    { name: 'Dainty Threader Dangle Earrings', category: 'Dangles', basePrice: 1900 },
    { name: 'Pearl Drape Drops', category: 'Drops', basePrice: 2600 },
    { name: 'Heartful Chain Drops', category: 'Drops', basePrice: 2400 },
    { name: 'Geometria Earrings', category: 'Geometric', basePrice: 2100 },
    { name: 'Golden Hexagon Earrings', category: 'Geometric', basePrice: 2300 },
    
    // Necklaces & Pendants
    { name: 'Layered Chain Necklace', category: 'Necklaces', basePrice: 2800 },
    { name: 'Delicate Pendant Necklace', category: 'Necklaces', basePrice: 2200 },
    { name: 'Choker with Crystal Detail', category: 'Chokers', basePrice: 1800 },
    { name: 'Statement Pendant', category: 'Pendants', basePrice: 4200 },
    { name: 'Minimalist Chain', category: 'Necklaces', basePrice: 1600 },
    
    // Rings
    { name: 'Stackable Ring Set', category: 'Rings', basePrice: 1500 },
    { name: 'Statement Cocktail Ring', category: 'Rings', basePrice: 3800 },
    { name: 'Delicate Band Ring', category: 'Rings', basePrice: 1200 },
    { name: 'Gemstone Ring', category: 'Rings', basePrice: 2900 },
    { name: 'Geometric Ring', category: 'Rings', basePrice: 2100 },
    
    // Bracelets & Bangles
    { name: 'Tennis Bracelet', category: 'Bracelets', basePrice: 4500 },
    { name: 'Charm Bracelet', category: 'Bracelets', basePrice: 3200 },
    { name: 'Bangle Set', category: 'Bangles', basePrice: 2800 },
    { name: 'Cuff Bracelet', category: 'Bracelets', basePrice: 2600 },
    { name: 'Chain Bracelet', category: 'Bracelets', basePrice: 1900 },
    
    // Anklets
    { name: 'Delicate Anklet', category: 'Anklets', basePrice: 1400 },
    { name: 'Chain Anklet', category: 'Anklets', basePrice: 1200 },
    { name: 'Charm Anklet', category: 'Anklets', basePrice: 1800 },
    
    // Sets & Collections
    { name: 'Earrings & Necklace Set', category: 'Sets', basePrice: 5200 },
    { name: 'Bracelet & Ring Set', category: 'Sets', basePrice: 3800 },
    { name: 'Complete Jewelry Set', category: 'Sets', basePrice: 7800 },
    
    // Special Collections
    { name: 'Bohemian Collection Earrings', category: 'Collections', basePrice: 3400 },
    { name: 'Vintage Style Necklace', category: 'Collections', basePrice: 4100 },
    { name: 'Modern Minimalist Ring', category: 'Collections', basePrice: 2200 },
    { name: 'Art Deco Inspired Bracelet', category: 'Collections', basePrice: 3600 },
    { name: 'Nature Inspired Pendant', category: 'Collections', basePrice: 2900 }
  ];

  const cities = [
    { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    { city: 'Delhi', state: 'Delhi', pincode: '110001' },
    { city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
    { city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
    { city: 'Kolkata', state: 'West Bengal', pincode: '700001' },
    { city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
    { city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
    { city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001' }
  ];

  const customer = customers[Math.floor(Math.random() * customers.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const orderDate = getRandomDate(new Date('2025-01-01'), new Date());
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  // Generate 1-3 random items
  const numItems = Math.floor(Math.random() * 3) + 1;
  const items = [];
  let subtotal = 0;

  for (let i = 0; i < numItems; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const unitPrice = product.basePrice + Math.floor(Math.random() * 500);
    const totalPrice = unitPrice * quantity;
    subtotal += totalPrice;

    items.push({
      productId: `PROD-${Math.floor(Math.random() * 1000)}`,
      name: product.name,
      quantity,
      unitPrice,
      totalPrice,
      sku: `${product.name.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 100)}`,
      category: product.category
    });
  }

  const tax = Math.round(subtotal * 0.18);
  const discount = Math.floor(Math.random() * 200);
  const shipping = Math.floor(Math.random() * 100);
  const total = subtotal + tax + shipping - discount;

  return {
    platform: platform || platforms[Math.floor(Math.random() * platforms.length)],
    platformOrderId: `${platform?.toUpperCase() || 'GEN'}-${Math.floor(Math.random() * 1000)}`,
    orderNumber,
    orderDate,
    status,
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: {
        street: `${Math.floor(Math.random() * 999) + 1} ${['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr'][Math.floor(Math.random() * 5)]}`,
        city: city.city,
        state: city.state,
        pincode: city.pincode,
        country: 'India'
      }
    },
    items,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    currency: 'INR',
    shipping: {
      method: ['Standard', 'Express', 'Quick Delivery', 'Premium Delivery'][Math.floor(Math.random() * 4)],
      trackingNumber: `TRK-${Math.floor(Math.random() * 10000)}`,
      estimatedDelivery: new Date(orderDate.getTime() + (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
      carrier: ['Courier Service', 'Amazon Logistics', 'Blinkit Delivery', 'Flipkart Logistics', 'Swiggy Delivery'][Math.floor(Math.random() * 5)]
    },
    syncStatus: 'synced',
    tags: [],
    createdBy: adminUser._id,
    updatedBy: adminUser._id
  };
}

// Seed additional orders
async function seedAdditionalOrders(count = 20) {
  try {
    console.log(`🌱 Seeding ${count} additional orders...`);

    // Get admin user for createdBy/updatedBy fields
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('❌ Admin user not found');
      return;
    }

    // Get current order count to generate unique order numbers
    const currentOrderCount = await Order.countDocuments();
    const startOrderNumber = currentOrderCount + 1;

    const orders = [];
    for (let i = 0; i < count; i++) {
      const orderNumber = `ORD-${String(startOrderNumber + i).padStart(3, '0')}`;
      const orderData = generateOrderData(orderNumber, null, adminUser);
      orders.push(orderData);
    }

    // Insert orders in batches
    const batchSize = 10;
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      await Order.insertMany(batch);
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(orders.length / batchSize)}`);
    }

    console.log(`🎉 Successfully seeded ${count} additional orders!`);
    console.log(`📊 Total orders in database: ${await Order.countDocuments()}`);

  } catch (error) {
    console.error('❌ Error seeding additional orders:', error);
  }
}

// Main execution
async function main() {
  await connectDB();
  
  const count = process.argv[2] ? parseInt(process.argv[2]) : 20;
  await seedAdditionalOrders(count);
  
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { seedAdditionalOrders }; 