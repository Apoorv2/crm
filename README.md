# 🏪 Palmonas CRM - Admin Portal

A comprehensive **Admin CRM Portal** for managing customer orders from multiple e-commerce platforms (Amazon, Blinkit, Flipkart, Swiggy, Organic Website).

## 🚀 Quick Start

### **Prerequisites**
- Docker & Docker Compose
- Node.js 18+ (for development)

### **One-Command Setup**
```bash
# Clone and start
git clone <repository-url>
cd CRM
docker-compose up -d

# Access the application
Frontend: http://localhost:3002
Backend API: http://localhost:5000
```

### **Default Login Credentials**
```
Email: admin@palmonas.com
Password: admin123
```

## 🎯 **Key Features**

### **✅ Core CRM Features**
- **Unified Order Dashboard**: View orders from all platforms in one place
- **Advanced Search & Filtering**: By date, platform, status, customer
- **Order Status Management**: Update and track order status changes
- **Analytics & Reports**: Revenue trends, platform performance, customer insights
- **User Management**: Role-based access control (Admin, Support, Read-only)

### **✅ Advanced Integration Features**
- **Order Ingestion Service**: Background jobs fetch orders every 15-30 minutes
- **Real-time Webhooks**: Process order notifications from platforms instantly
- **Platform Integration Layer**: Handle API differences across 5+ platforms
- **Data Transformation**: Convert platform-specific formats to unified schema
- **Mock Data System**: Realistic demo data for all platforms

### **✅ Production-Ready Architecture**
- **Scalable Design**: Easy to add new platforms and scale horizontally
- **Fault Tolerance**: Graceful error handling and retry mechanisms
- **Security**: JWT authentication, role-based permissions, input validation
- **Monitoring**: Health checks, service status, comprehensive logging

## 🔧 **Testing Advanced Features**

### **1. Test Order Ingestion Service**
```bash
# Test background jobs and webhook processing
docker-compose exec backend npm run test-ingestion
```

### **2. Test Webhook Endpoints**
```bash
# Test Amazon webhook
curl -X POST http://localhost:5000/api/webhooks/amazon \
  -H "Content-Type: application/json" \
  -d '{
    "amazon_order_id": "AMZ-TEST-001",
    "order_date": "2024-01-15T15:30:00Z",
    "status": "confirmed",
    "buyer_name": "Test Customer",
    "buyer_email": "test@example.com",
    "items": [{"asin": "B08N5WRWNW", "title": "Test Earrings", "quantity": 1, "price": 2500}],
    "total_amount": 2500
  }'
```

### **3. Check Service Status**
```bash
# Get webhook service status
curl http://localhost:5000/api/webhooks/status
```

## 📊 **Sample Data Includes**

- **12 Sample Orders** with realistic demi-fine jewelry products
- **15+ Unique Products**: Diamond Huggie Hoops, Golden Flutter Studs, Pearl Drape Drops, etc.
- **5 Platforms**: Amazon, Blinkit, Flipkart, Swiggy, Organic Website
- **Multiple Customers** with complete order history
- **Realistic Pricing**: 1,800 - 4,500 INR per product

## 🏗️ **Architecture Highlights**

### **Order Ingestion & Integration**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PLATFORMS     │    │   WEBHOOKS      │    │   BACKGROUND    │
│                 │    │                 │    │     JOBS        │
│  • Amazon       │    │  • Real-time    │    │  • Scheduled    │
│  • Blinkit      │    │    notifications │    │    fetching     │
│  • Flipkart     │    │  • Order updates │    │  • Every 15min  │
│  • Swiggy       │    │  • Status changes│    │  • Every 30min  │
│  • Organic      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                      │
                    ┌───────────▼──────────────────────▼───────────┐
                    │           ORDER INGESTION SERVICE            │
                    │  • Webhook Processing • Background Jobs      │
                    │  • Data Validation • Error Handling          │
                    └───────────────────┬──────────────────────────┘
                                        │
                    ┌───────────────────▼──────────────────────────┐
                    │         PLATFORM INTEGRATION LAYER           │
                    │  • API Clients • Data Transformation         │
                    │  • Status Mapping • Mock Data                │
                    └───────────────────┬──────────────────────────┘
                                        │
                    ┌───────────────────▼──────────────────────────┐
                    │              DATABASE                        │
                    │  • Unified Order Format • Platform Data      │
                    │  • Audit Trail • Analytics                   │
                    └──────────────────────────────────────────────┘
```

## 🚀 **Quick Start for Interviewers**

### **1. Start Everything**
```bash
docker-compose up -d
```

### **2. Verify Services**
```bash
# Check if all services are running
docker-compose ps

# Check backend logs
docker-compose logs backend
```

### **3. Access Application**
- **Frontend**: http://localhost:3002
- **Login**: admin@palmonas.com / admin123

### **4. Demo Script**
1. **Dashboard**: Show analytics and summary widgets
2. **Orders Page**: Demonstrate filtering, search, status updates
3. **Analytics**: Show revenue trends and platform performance
4. **Advanced Features**: Test order ingestion and webhooks

### **5. Test Advanced Features**
```bash
# Test order ingestion service
docker-compose exec backend npm run test-ingestion

# Test webhook processing
curl -X POST http://localhost:5000/api/webhooks/amazon -H "Content-Type: application/json" -d '{"amazon_order_id":"TEST-001","order_date":"2024-01-15T15:30:00Z","status":"confirmed","buyer_name":"Test","buyer_email":"test@example.com","items":[{"asin":"B08N5WRWNW","title":"Test","quantity":1,"price":2500}],"total_amount":2500}'
```

## 🔧 **Troubleshooting**

### **Port Conflicts**
```bash
# If ports are in use, stop conflicting services
sudo lsof -i :3002 -i :5000 -i :27017
# Or change ports in docker-compose.yml
```

### **Database Issues**
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

### **Service Not Starting**
```bash
# Check logs
docker-compose logs backend
docker-compose logs mongodb

# Restart services
docker-compose restart backend
```

## 📚 **Documentation**

- **Technical Document**: `TECHNICAL_DOCUMENT.md` - Detailed system design and architecture
- **Interview Guide**: `INTERVIEW_GUIDE.md` - How to demonstrate advanced features
- **API Documentation**: Available at `http://localhost:5000/api` when running

## 🎯 **Key Technical Highlights**

### **✅ Production-Ready Features**
- **Order Ingestion Service**: Background jobs + webhook processing
- **Integration Layer**: Handle 5+ platform API differences
- **Scalable Architecture**: Easy to add new platforms
- **Fault Tolerance**: Graceful error handling and retries
- **Security**: JWT auth, RBAC, input validation
- **Monitoring**: Health checks and service status

### **✅ Interview-Ready**
- **Easy Demo**: One-command startup with sample data
- **Comprehensive**: Shows real-world problem solving
- **Scalable**: Demonstrates production architecture thinking
- **Well-Documented**: Clear explanations for all features

---

**Ready for your interview! 🚀**

The system demonstrates advanced concepts like background jobs, webhook processing, platform integration, and scalable architecture - perfect for showcasing your technical skills. 