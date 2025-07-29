const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Platform identification
  platform: {
    type: String,
    required: true,
    enum: ['amazon', 'blinkit', 'organic', 'flipkart', 'swiggy'],
    index: true
  },
  platformOrderId: {
    type: String,
    required: true,
    index: true
  },
  
  // Order details
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  orderDate: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
    index: true
  },
  
  // Customer information
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    }
  },
  
  // Product details
  items: [{
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    sku: String,
    category: String
  }],
  
  // Financial information
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Shipping information
  shipping: {
    method: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    carrier: String
  },
  
  // Platform-specific data
  platformData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Status tracking
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  
  // Sync information
  lastSynced: {
    type: Date,
    default: Date.now
  },
  syncStatus: {
    type: String,
    enum: ['synced', 'pending', 'failed'],
    default: 'synced'
  },
  
  // Tags and notes
  tags: [String],
  notes: String,
  
  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ platform: 1, orderDate: -1 });
orderSchema.index({ status: 1, orderDate: -1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ total: -1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.updatedBy
    });
  }
  next();
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.orderDate.getTime()) / (1000 * 60 * 60 * 24));
});

// Method to calculate total items
orderSchema.methods.getTotalItems = function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

// Static method to get orders by platform
orderSchema.statics.getByPlatform = function(platform) {
  return this.find({ platform }).sort({ orderDate: -1 });
};

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ orderDate: -1 });
};

module.exports = mongoose.model('Order', orderSchema); 