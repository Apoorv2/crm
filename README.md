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

---

## 🎯 **Quick Start for Interviewers (Zero Technical Knowledge Required)**

### **Step 1: Install Docker Desktop**
1. Download from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Install and start Docker Desktop
3. Wait for Docker to be running (green icon in system tray)

### **Step 2: Clone and Run**
```bash
# Open terminal/command prompt and run these commands:
git clone https://github.com/Apoorv2/crm.git
cd crm
docker-compose up -d
```

### **Step 3: Access the Application**
- **Frontend (Web App)**: http://localhost:3002
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### **Step 4: Login**
Use these pre-created credentials:

| **Role** | **Email** | **Password** | **Access Level** |
|----------|-----------|--------------|------------------|
| **Admin** | `admin@palmonas.com` | `admin123` | Full access |
| **Support** | `support@palmonas.com` | `support123` | Order management |
| **Read-only** | `readonly@palmonas.com` | `readonly123` | View only |

### **Step 5: Demo Script**
1. **Login** as admin@palmonas.com / admin123
2. **Dashboard** - Show real-time metrics and jewelry data
3. **Orders** - Demonstrate filtering, search, and status updates
4. **Analytics** - Show charts and platform performance
5. **Users** - Show user management (admin only)

### **Troubleshooting**
```bash
# If containers don't start:
docker-compose down
docker-compose up -d

# If ports are busy:
# Change ports in docker-compose.yml (3002 → 3003)

# To see logs:
docker-compose logs

# To reset everything:
docker-compose down -v
docker-compose up -d
```

---

## 🚀 **Detailed Quick Start (For Developers)**

### **1. Clone the Repository**
```bash
git clone https://github.com/Apoorv2/crm.git
cd crm
```

### **2. Start the Application**
```bash
docker-compose up -d
```

### **3. Verify Services are Running**
```bash
docker-compose ps
```

**Expected output:**
```
NAME           STATUS                    PORTS
crm_backend    Up 2 minutes (healthy)   0.0.0.0:5000->5000/tcp
crm_frontend   Up 2 minutes             0.0.0.0:3002->3000/tcp
crm_mongodb    Up 2 minutes (healthy)   0.0.0.0:27017->27017/tcp
```

### **4. Access the Application**
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### **5. Login Credentials**
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

### **Jewelry Products Included:**
- Diamond Huggie Hoop Earrings (₹3,500)
- Golden Flutter Studs (₹1,800)
- Pearl Drape Drops (₹2,600)
- Tennis Bracelet (₹4,500)
- Statement Cocktail Ring (₹3,800)
- Layered Chain Necklace (₹2,800)
- Earrings & Necklace Set (₹5,200)
- And 8+ more jewelry items

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

# Add more sample orders
docker-compose exec backend npm run seed-orders 50
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

## 🔍 **Troubleshooting Guide**

### **Common Issues and Solutions**

#### **1. Port Already in Use**
```bash
# Check what's using the ports
netstat -an | grep 3002
netstat -an | grep 5000

# Stop conflicting services or change ports in docker-compose.yml
```

#### **2. Docker Not Running**
```bash
# Start Docker Desktop
# Wait for Docker to be fully running (green icon)
```

#### **3. Containers Not Starting**
```bash
# Check Docker logs
docker-compose logs

# Restart containers
docker-compose down
docker-compose up -d
```

#### **4. Database Empty**
```bash
# Reset with fresh data
docker-compose down -v
docker-compose up -d
```

#### **5. Permission Issues**
```bash
# On Linux/Mac, ensure Docker has proper permissions
sudo usermod -aG docker $USER
# Log out and log back in
```

### **Useful Commands**
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Check service status
docker-compose ps

# Restart specific service
docker-compose restart backend

# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin crm

# View database collections
docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin crm --eval "show collections"
```


---


---

## 📋 **Quick Reference Card**

### **Start Application:**
```bash
git clone https://github.com/Apoorv2/crm.git
cd crm
docker-compose up -d
```

### **Access URLs:**
- **Web App**: http://localhost:3002
- **API**: http://localhost:5000
- **Database**: localhost:27017

### **Login Credentials:**
- **Admin**: admin@palmonas.com / admin123
- **Support**: support@palmonas.com / support123
- **Read-only**: readonly@palmonas.com / readonly123

### **Stop Application:**
```bash
docker-compose down
```

### **Reset Everything:**
```bash
docker-compose down -v
docker-compose up -d
``` 