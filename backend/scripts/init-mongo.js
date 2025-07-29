// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

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
db.orders.createIndex({ "platformOrderId": 1 });
db.orders.createIndex({ "orderDate": -1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "customer.email": 1 });
db.orders.createIndex({ "total": -1 });
db.orders.createIndex({ "createdAt": -1 });

// Create compound indexes
db.orders.createIndex({ "platform": 1, "orderDate": -1 });
db.orders.createIndex({ "status": 1, "orderDate": -1 });

print('Database initialized successfully!');
print('Collections created: users, orders');
print('Indexes created for optimal performance'); 