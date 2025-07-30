// MongoDB initialization script
// This script runs when the MongoDB container starts

// Create database and collections
db = db.getSiblingDB('crm');

// Create collections
db.createCollection('users');
db.createCollection('orders');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "isActive": 1 });

db.orders.createIndex({ "orderNumber": 1 }, { unique: true });
db.orders.createIndex({ "platform": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "orderDate": 1 });
db.orders.createIndex({ "customer.email": 1 });
db.orders.createIndex({ "platformOrderId": 1 });
db.orders.createIndex({ "createdBy": 1 });
db.orders.createIndex({ "syncStatus": 1 });

// Create compound indexes for common queries
db.orders.createIndex({ "platform": 1, "status": 1 });
db.orders.createIndex({ "orderDate": 1, "status": 1 });
db.orders.createIndex({ "customer.email": 1, "orderDate": 1 });

print('MongoDB initialized with collections and indexes');

// Note: Actual data seeding will be handled by the Node.js application
// to ensure proper password hashing and data validation 