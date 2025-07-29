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
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  AdminPanelSettings,
  Support,
  Person
} from '@mui/icons-material';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  permissions: string[];
  createdAt: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'readonly',
    isActive: true
  });

  const roles = [
    { value: 'admin', label: 'Admin', icon: <AdminPanelSettings /> },
    { value: 'support', label: 'Support', icon: <Support /> },
    { value: 'readonly', label: 'Read Only', icon: <Person /> }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data.users);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setIsEditMode(true);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        isActive: user.isActive
      });
    } else {
      setSelectedUser(null);
      setIsEditMode(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'readonly',
        isActive: true
      });
    }
    setUserDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setUserDialogOpen(false);
    setSelectedUser(null);
    setIsEditMode(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'readonly',
      isActive: true
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && selectedUser) {
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive
        };
        
        if (formData.password) {
          updateData.password = formData.password;
        }

        await axios.put(`/api/users/${selectedUser._id}`, updateData);
      } else {
        await axios.post('/api/users', formData);
      }

      fetchUsers();
      handleCloseDialog();
    } catch (err: any) {
      console.error('Failed to save user:', err);
      setError(err.response?.data?.error || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`/api/users/${userId}`);
      fetchUsers();
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await axios.put(`/api/users/${userId}`, {
        isActive: !currentStatus
      });
      fetchUsers();
    } catch (err: any) {
      console.error('Failed to update user status:', err);
      setError(err.response?.data?.error || 'Failed to update user status');
    }
  };

  const getRoleIcon = (role: string) => {
    const roleData = roles.find(r => r.value === role);
    return roleData ? roleData.icon : <Person />;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'support': return 'warning';
      case 'readonly': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* User Statistics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {users.length}
                  </Typography>
                </Box>
                <Person color="primary" sx={{ fontSize: 40 }} />
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
                    Active Users
                  </Typography>
                  <Typography variant="h4">
                    {users.filter(u => u.isActive).length}
                  </Typography>
                </Box>
                <AdminPanelSettings color="success" sx={{ fontSize: 40 }} />
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
                    Admins
                  </Typography>
                  <Typography variant="h4">
                    {users.filter(u => u.role === 'admin').length}
                  </Typography>
                </Box>
                <AdminPanelSettings color="error" sx={{ fontSize: 40 }} />
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
                    Support Users
                  </Typography>
                  <Typography variant="h4">
                    {users.filter(u => u.role === 'support').length}
                  </Typography>
                </Box>
                <Support color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {getRoleIcon(user.role)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      color={getRoleColor(user.role) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      color={user.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleActive(user._id, user.isActive)}
                      >
                        <Switch
                          checked={user.isActive}
                          size="small"
                          color="success"
                        />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* User Dialog */}
      <Dialog open={userDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditMode ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!isEditMode}
                  helperText={isEditMode ? 'Leave blank to keep current password' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    label="Role"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        <Box display="flex" alignItems="center">
                          {role.icon}
                          <Typography sx={{ ml: 1 }}>
                            {role.label}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users; 