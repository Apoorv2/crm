import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Search,
  FilterList,
  Edit,
  Visibility,
  LocalShipping,
  CheckCircle,
  Cancel,
  Schedule
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

interface Order {
  _id: string;
  orderNumber: string;
  platform: string;
  orderDate: string;
  status: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  total: number;
  currency: string;
  shipping: {
    method: string;
    trackingNumber?: string;
  };
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  // Status update dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const platforms = ['amazon', 'blinkit', 'organic', 'flipkart', 'swiggy'];
  const statuses = ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled', 'returned'];

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage, searchTerm, platformFilter, statusFilter, dateFrom, dateTo]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(platformFilter && { platform: platformFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(dateFrom && { dateFrom: dateFrom.toISOString() }),
        ...(dateTo && { dateTo: dateTo.toISOString() })
      });

      const response = await axios.get<OrdersResponse>(`/api/orders?${params}`);
      setOrders(response.data.orders);
      setTotal(response.data.total);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError(err.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await axios.put(`/api/orders/${selectedOrder._id}/status`, {
        status: newStatus,
        notes: `Status updated to ${newStatus}`
      });

      // Refresh orders
      fetchOrders();
      setStatusDialogOpen(false);
      setSelectedOrder(null);
      setNewStatus('');
    } catch (err: any) {
      console.error('Failed to update status:', err);
      setError(err.response?.data?.error || 'Failed to update order status');
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle />;
      case 'dispatched': return <LocalShipping />;
      case 'pending': return <Schedule />;
      case 'cancelled': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPlatformFilter('');
    setStatusFilter('');
    setDateFrom(null);
    setDateTo(null);
  };

  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Orders Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
          Search & Filters
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Orders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Order number, customer name, email..."
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Platform</InputLabel>
              <Select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                label="Platform"
              >
                <MenuItem value="">All Platforms</MenuItem>
                {platforms.map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={dateFrom}
                onChange={setDateFrom}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={dateTo}
                onChange={setDateTo}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={1}>
            <Button
              variant="outlined"
              onClick={clearFilters}
              fullWidth
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Platform</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {order.orderNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.platform}
                      size="small"
                      sx={{
                        backgroundColor: getPlatformColor(order.platform),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {order.customer.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {order.customer.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status}
                      size="small"
                      color={getStatusColor(order.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{order.total.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedOrder(order);
                        setNewStatus(order.status);
                        setStatusDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Order: {selectedOrder?.orderNumber}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="New Status"
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders; 