import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  People,
  LocalShipping,
  CheckCircle,
  Cancel,
  Schedule
} from '@mui/icons-material';
import axios from 'axios';

interface DashboardData {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    activeCustomers: number;
  };
  ordersByStatus: {
    pending: number;
    processing: number;
    dispatched: number;
    delivered: number;
    cancelled: number;
  };
  ordersByPlatform: {
    amazon: number;
    blinkit: number;
    organic: number;
    flipkart: number;
    swiggy: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    platform: string;
    customer: {
      name: string;
      email: string;
    };
    total: number;
    status: string;
    orderDate: string;
  }>;
  dailyTrends: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/analytics/dashboard');
        setData(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.response?.data?.error || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'dispatched': return 'info';
      case 'processing': return 'warning';
      case 'pending': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'amazon': return '#ff9900';
      case 'blinkit': return '#ff6b35';
      case 'organic': return '#4caf50';
      case 'flipkart': return '#2874f0';
      case 'swiggy': return '#fc8019';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3}>
        <Alert severity="warning">No data available</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4">
                    {data.summary.totalOrders.toLocaleString()}
                  </Typography>
                </Box>
                <ShoppingCart color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    ₹{data.summary.totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <AttachMoney color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Order Value
                  </Typography>
                  <Typography variant="h4">
                    ₹{data.summary.averageOrderValue.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUp color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Customers
                  </Typography>
                  <Typography variant="h4">
                    {data.summary.activeCustomers.toLocaleString()}
                  </Typography>
                </Box>
                <People color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status and Platform Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Orders by Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Schedule color="warning" sx={{ mr: 1 }} />
                  <Typography>Pending: {data.ordersByStatus.pending}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocalShipping color="info" sx={{ mr: 1 }} />
                  <Typography>Dispatched: {data.ordersByStatus.dispatched}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography>Delivered: {data.ordersByStatus.delivered}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Cancel color="error" sx={{ mr: 1 }} />
                  <Typography>Cancelled: {data.ordersByStatus.cancelled}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Orders by Platform
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {Object.entries(data.ordersByPlatform).map(([platform, count]) => (
                <Chip
                  key={platform}
                  label={`${platform}: ${count}`}
                  sx={{
                    backgroundColor: getPlatformColor(platform),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Orders
        </Typography>
        <Box>
          {data.recentOrders.map((order) => (
            <Box key={order.id} mb={2} p={2} border="1px solid #eee" borderRadius={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {order.orderNumber}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {order.customer.name} • {order.customer.email}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip
                    label={order.platform}
                    size="small"
                    sx={{
                      backgroundColor: getPlatformColor(order.platform),
                      color: 'white'
                    }}
                  />
                  <Chip
                    label={order.status}
                    size="small"
                    color={getStatusColor(order.status) as any}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    ₹{order.total.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard; 