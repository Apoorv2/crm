# Palmonas CRM - Admin Portal

A comprehensive admin CRM portal for managing customer orders from multiple e-commerce platforms (Amazon, Blinkit, Organic website, etc.).

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Quick Setup
```bash
# Clone the repository
git clone <repository-url>
cd CRM

# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### Access the Application
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### Seed Database
```bash
# Seed with sample data
docker-compose exec backend npm run seed
```

### Default Login Credentials
- **Admin**: admin@palmonas.com / admin123
- **Support**: support@palmonas.com / support123
- **Read-only**: readonly@palmonas.com / readonly123

## 📁 Project Structure

```
├── backend/                 # Node.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── scripts/            # Database scripts
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── App.tsx         # Main app component
│   └── public/             # Static files
├── docker-compose.yml      # Docker orchestration
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

### Orders
- `GET /api/orders` - Get all orders with filtering
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/platforms` - Platform performance
- `GET /api/analytics/trends` - Order trends

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🏗 Architecture Highlights

### Scalability Features
- **Modular Design**: Easy to split into microservices
- **Database Indexing**: Optimized queries for performance
- **Connection Pooling**: Efficient database connections
- **Rate Limiting**: API protection against abuse
- **Health Checks**: Container health monitoring

### Fault Tolerance
- **Error Handling**: Comprehensive error responses
- **Input Validation**: Request data validation
- **Graceful Shutdown**: Proper cleanup on exit
- **Retry Mechanisms**: Built-in retry logic
- **Circuit Breaker**: External API protection (ready for implementation)

### Security
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Granular permissions
- **Input Sanitization**: XSS and injection protection
- **CORS Configuration**: Cross-origin security
- **Helmet.js**: Security headers

## 🧪 Development

### Local Development
```bash
# Backend development
cd backend
npm install
npm run dev

# Frontend development
cd frontend
npm install
npm start
```

### Database Seeding
```bash
# Seed with sample data
cd backend
npm run seed
```

### Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📊 Database Schema

### Users Collection
- Email, password, name, role
- Permissions array
- Active status and timestamps

### Orders Collection
- Platform identification
- Customer information
- Product details
- Financial data
- Status tracking
- Audit trail

## 🔧 Configuration

### Environment Variables
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Platform Integration
- Amazon API credentials
- Blinkit API credentials
- Other platform configurations

## 🚀 Deployment

### Production Deployment
1. Set production environment variables
2. Build Docker images
3. Deploy with Docker Compose or Kubernetes
4. Set up reverse proxy (Nginx)
5. Configure SSL certificates

### Scaling Considerations
- Horizontal scaling with load balancer
- Database read replicas
- Redis caching layer
- CDN for static assets

## 📈 Monitoring & Logging

- **Health Checks**: `/health` endpoint
- **Request Logging**: Morgan middleware
- **Error Tracking**: Centralized error handling
- **Performance Monitoring**: Ready for APM integration

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
- Review the API endpoints
- Check the logs for errors
- Contact the development team

---

**Built with ❤️ for Palmonas** 