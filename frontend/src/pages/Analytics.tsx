import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShoppingCart,
  People,
  LocalShipping
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
    trend: Array<{
      date: string;
      revenue: number;
    }>;
  };
  orders: {
    total: number;
    change: number;
    trend: Array<{
      date: string;
      orders: number;
    }>;
  };
  platforms: Array<{
    platform: string;
    orders: number;
    revenue: number;
    percentage: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  customerMetrics: {
    totalCustomers: number;
    newCustomers: number;
    repeatCustomers: number;
    averageOrderValue: number;
  };
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/analytics/trends?period=${period}`);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch analytics:', err);
      setError(err.response?.data?.error || 'Failed to load analytics data');
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '#4caf50';
      case 'dispatched': return '#2196f3';
      case 'processing': return '#ff9800';
      case 'pending': return '#9e9e9e';
      case 'cancelled': return '#f44336';
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
        <Alert severity="warning">No analytics data available</Alert>
      </Box>
    );
  }

  // Chart data
  const revenueChartData = {
    labels: data.revenue.trend.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Revenue',
        data: data.revenue.trend.map(item => item.revenue),
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const ordersChartData = {
    labels: data.orders.trend.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Orders',
        data: data.orders.trend.map(item => item.orders),
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const platformChartData = {
    labels: data.platforms.map(p => p.platform),
    datasets: [
      {
        data: data.platforms.map(p => p.revenue),
        backgroundColor: data.platforms.map(p => getPlatformColor(p.platform)),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const statusChartData = {
    labels: data.statusDistribution.map(s => s.status),
    datasets: [
      {
        data: data.statusDistribution.map(s => s.count),
        backgroundColor: data.statusDistribution.map(s => getStatusColor(s.status)),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Analytics & Reports
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Period"
          >
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
            <MenuItem value="1y">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    ₹{data.revenue.total.toLocaleString()}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {data.revenue.change >= 0 ? (
                      <TrendingUp color="success" sx={{ mr: 0.5 }} />
                    ) : (
                      <TrendingDown color="error" sx={{ mr: 0.5 }} />
                    )}
                    <Typography
                      variant="body2"
                      color={data.revenue.change >= 0 ? 'success.main' : 'error.main'}
                    >
                      {data.revenue.change >= 0 ? '+' : ''}{data.revenue.change}%
                    </Typography>
                  </Box>
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
                    Total Orders
                  </Typography>
                  <Typography variant="h4">
                    {data.orders.total.toLocaleString()}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {data.orders.change >= 0 ? (
                      <TrendingUp color="success" sx={{ mr: 0.5 }} />
                    ) : (
                      <TrendingDown color="error" sx={{ mr: 0.5 }} />
                    )}
                    <Typography
                      variant="body2"
                      color={data.orders.change >= 0 ? 'success.main' : 'error.main'}
                    >
                      {data.orders.change >= 0 ? '+' : ''}{data.orders.change}%
                    </Typography>
                  </Box>
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
                    Total Customers
                  </Typography>
                  <Typography variant="h4">
                    {data.customerMetrics.totalCustomers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    {data.customerMetrics.newCustomers} new this period
                  </Typography>
                </Box>
                <People color="secondary" sx={{ fontSize: 40 }} />
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
                    ₹{data.customerMetrics.averageOrderValue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    {data.customerMetrics.repeatCustomers} repeat customers
                  </Typography>
                </Box>
                <LocalShipping color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Trend
            </Typography>
            <Line data={revenueChartData} options={chartOptions} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Platform Distribution
            </Typography>
            <Doughnut data={platformChartData} options={{ responsive: true }} />
            <Box mt={2}>
              {data.platforms.map((platform) => (
                <Box key={platform.platform} display="flex" justifyContent="space-between" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: getPlatformColor(platform.platform),
                        mr: 1
                      }}
                    />
                    <Typography variant="body2">
                      {platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {platform.percentage}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Orders Trend
            </Typography>
            <Bar data={ordersChartData} options={chartOptions} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Status Distribution
            </Typography>
            <Doughnut data={statusChartData} options={{ responsive: true }} />
            <Box mt={2}>
              {data.statusDistribution.map((status) => (
                <Box key={status.status} display="flex" justifyContent="space-between" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(status.status),
                        mr: 1
                      }}
                    />
                    <Typography variant="body2">
                      {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {status.count} ({status.percentage}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Products */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Top Products
        </Typography>
        <Grid container spacing={2}>
          {data.topProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={product.name}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        #{index + 1} {product.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {product.quantity} units sold
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary">
                      ₹{product.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Analytics; 