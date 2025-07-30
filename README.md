# 🏢 Palmonas CRM - Admin Portal for Multi-Platform Order Management

A comprehensive **Admin CRM Portal** for managing customer orders from multiple e-commerce platforms (Amazon, Blinkit, Organic, Flipkart, Swiggy). Built as an MVP with modern full-stack technologies and containerized deployment.

## 🚀 Features

### **Core Features**
- **Unified Order Dashboard** - Centralized view of all platform orders
- **Advanced Search & Filtering** - By date, platform, status, customer
- **Order Status Management** - Update and track order statuses
- **Real-time Analytics** - Charts, metrics, and performance insights
- **User Management** - Role-based access control (Admin, Support, Read-only)
- **Multi-Platform Support** - Amazon, Blinkit, Organic, Flipkart, Swiggy

### **Technical Features**
- **Auto-Seeding** - Database automatically populated with sample data on startup
- **Health Checks** - Robust startup sequence with dependency management
- **Persistent Data** - MongoDB data persistence across restarts
- **Security** - JWT authentication, role-based permissions, input validation
- **Scalable Architecture** - Modular design ready for production scaling

## 🛠 Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Material-UI** for modern UI components
- **Chart.js** for analytics visualization
- **React Router** for navigation
- **Axios** for API communication

### **Backend**
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

### **Infrastructure**
- **Docker** containerization
- **Docker Compose** for multi-service orchestration
- **MongoDB** with persistent storage
- **Health checks** for reliable startup

## 📋 Prerequisites

- **Docker** and **Docker Compose**
- **Git** for cloning the repository
- **Node.js 18+** (for local development)

## 🚀 Quick Start

### **1. Clone the Repository**
```bash
git clone https://github.com/Apoorv2/crm.git
cd crm
```

### **2. Start the Application**
```bash
docker-compose up -d
```

### **3. Access the Application**
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### **4. Login Credentials**
The system automatically seeds the database with sample users:

```
Admin User:
- Email: admin@palmonas.com
- Password: admin123

Support User:
- Email: support@palmonas.com
- Password: support123

Read-only User:
- Email: readonly@palmonas.com
- Password: readonly123
```

## 🔧 Auto-Seeding Feature

The CRM includes an intelligent auto-seeding system that:

- **Automatically detects** if the database is empty
- **Populates sample data** including users and orders
- **Ensures consistent startup** regardless of container restarts
- **Maintains data integrity** with proper password hashing
- **Provides immediate access** to all features

### **Sample Data Includes:**
- **3 Users** with different roles (Admin, Support, Read-only)
- **12 Sample Orders** across all platforms with recent dates
- **15+ Jewelry Products** including earrings, necklaces, rings, bracelets, and sets
- **Realistic jewelry data** with customers, items, and statuses
- **Analytics-ready data** for dashboard and reports

## 📊 API Endpoints

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Admin only)
- `GET /api/auth/me` - Get current user profile

### **Orders**
- `GET /api/orders` - List orders with filtering
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders` - Create new order

### **Analytics**
- `GET /api/analytics/dashboard` - Dashboard overview
- `GET /api/analytics/trends` - Order and revenue trends
- `GET /api/analytics/platforms` - Platform performance

### **Users**
- `GET /api/users` - List users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)

## 🏗 Architecture Highlights

### **Scalability**
- Modular code structure
- Environment-based configuration
- Database indexing for performance
- API rate limiting
- Error handling and logging

### **Fault Tolerance**
- Health checks for all services
- Graceful startup sequence
- Automatic retry mechanisms
- Data validation and sanitization
- Graceful shutdown handling

### **Security**
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers

## 🛠 Development

### **Local Development**
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Access backend shell
docker-compose exec backend sh

# Access frontend shell
docker-compose exec frontend sh

# Manual database seeding
docker-compose exec backend npm run seed
```

### **Database Schema**

#### **User Model**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/support/readonly),
  isActive: Boolean,
  permissions: [String],
  lastLogin: Date,
  createdAt: Date
}
```

#### **Order Model**
```javascript
{
  orderNumber: String (unique),
  platform: String,
  platformOrderId: String,
  customer: {
    name: String,
    email: String,
    phone: String,
    address: Object
  },
  items: [{
    name: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  status: String,
  total: Number,
  orderDate: Date,
  statusHistory: [Object]
}
```

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file based on `.env.example`:

```env
# Database
MONGODB_URI=mongodb://admin:password123@mongodb:27017/crm?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

### **Production Deployment**
1. Update environment variables
2. Set `NODE_ENV=production`
3. Use production MongoDB instance
4. Configure proper JWT secrets
5. Set up SSL certificates

### **Monitoring**
- Health check endpoints available
- Log aggregation recommended
- Database monitoring
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the technical specifications
- Open an issue on GitHub

---

**Built with ❤️ for Palmonas - Unified Order Management Made Simple** 