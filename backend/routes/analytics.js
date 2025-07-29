const express = require('express');
const { query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { authenticateToken, requirePermission } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private
router.get('/dashboard', authenticateToken, requirePermission('view_analytics'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.$gte = thirtyDaysAgo;
    }

    // Get total orders
    const totalOrders = await Order.countDocuments({ orderDate: dateFilter });

    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $match: { orderDate: dateFilter } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get active customers (unique customers in the period)
    const activeCustomersResult = await Order.aggregate([
      { $match: { orderDate: dateFilter } },
      { $group: { _id: '$customer.email' } },
      { $count: 'count' }
    ]);
    const activeCustomers = activeCustomersResult.length > 0 ? activeCustomersResult[0].count : 0;

    // Get orders by status
    const ordersByStatusResult = await Order.aggregate([
      { $match: { orderDate: dateFilter } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Convert to expected format
    const ordersByStatus = {
      pending: 0,
      processing: 0,
      dispatched: 0,
      delivered: 0,
      cancelled: 0
    };
    ordersByStatusResult.forEach(item => {
      if (ordersByStatus.hasOwnProperty(item._id)) {
        ordersByStatus[item._id] = item.count;
      }
    });

    // Get orders by platform
    const ordersByPlatformResult = await Order.aggregate([
      { $match: { orderDate: dateFilter } },
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);

    // Convert to expected format
    const ordersByPlatform = {
      amazon: 0,
      blinkit: 0,
      organic: 0,
      flipkart: 0,
      swiggy: 0
    };
    ordersByPlatformResult.forEach(item => {
      if (ordersByPlatform.hasOwnProperty(item._id)) {
        ordersByPlatform[item._id] = item.count;
      }
    });

    // Get recent orders (last 5 orders)
    const recentOrders = await Order.find({ orderDate: dateFilter })
      .sort({ orderDate: -1 })
      .limit(5)
      .select('orderNumber platform customer total status orderDate')
      .lean();

    // Get daily order trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyTrendsResult = await Order.aggregate([
      { $match: { orderDate: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$orderDate' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Convert to expected format
    const dailyTrends = dailyTrendsResult.map(item => ({
      date: item._id,
      orders: item.orders,
      revenue: item.revenue
    }));

    res.json({
      summary: {
        totalOrders,
        totalRevenue,
        averageOrderValue: Math.round(avgOrderValue * 100) / 100,
        activeCustomers
      },
      ordersByStatus,
      ordersByPlatform,
      recentOrders: recentOrders.map(order => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        platform: order.platform,
        customer: order.customer,
        total: order.total,
        status: order.status,
        orderDate: order.orderDate
      })),
      dailyTrends
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/revenue
// @desc    Get revenue analytics
// @access  Private
router.get('/revenue', authenticateToken, requirePermission('view_analytics'), [
  query('period').optional().isIn(['daily', 'weekly', 'monthly']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { period = 'daily', startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.$gte = thirtyDaysAgo;
    }

    let dateFormat;
    switch (period) {
      case 'daily':
        dateFormat = '%Y-%m-%d';
        break;
      case 'weekly':
        dateFormat = '%Y-%U';
        break;
      case 'monthly':
        dateFormat = '%Y-%m';
        break;
    }

    const revenueData = await Order.aggregate([
      { $match: { orderDate: dateFilter } },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$orderDate' }
          },
          revenue: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ revenueData });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/platforms
// @desc    Get platform performance analytics
// @access  Private
router.get('/platforms', authenticateToken, requirePermission('view_analytics'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.$gte = thirtyDaysAgo;
    }

    const platformStats = await Order.aggregate([
      { $match: { orderDate: dateFilter } },
      {
        $group: {
          _id: '$platform',
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' },
          ordersByStatus: {
            $push: '$status'
          }
        }
      },
      {
        $addFields: {
          statusBreakdown: {
            $reduce: {
              input: '$ordersByStatus',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $cond: {
                      if: { $in: ['$$this', Object.keys('$$value')] },
                      then: { $add: [{ $arrayElemAt: ['$$value', '$$this'] }, 1] },
                      else: { $mergeObjects: ['$$value', { '$$this': 1 }] }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({ platformStats });
  } catch (error) {
    console.error('Platform analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/trends
// @desc    Get order trends over time
// @access  Private
router.get('/trends', authenticateToken, requirePermission('view_analytics'), [
  query('period').optional().isIn(['7d', '30d', '90d', '1y'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const period = req.query.period || '30d';
    let days;
    switch (period) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      case '1y': days = 365; break;
      default: days = 30;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total revenue and orders for the period
    const totalStats = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = totalStats.length > 0 ? totalStats[0].totalRevenue : 0;
    const totalOrders = totalStats.length > 0 ? totalStats[0].totalOrders : 0;

    // Get previous period for comparison
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);
    
    const previousStats = await Order.aggregate([
      { $match: { orderDate: { $gte: previousStartDate, $lt: startDate } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const previousRevenue = previousStats.length > 0 ? previousStats[0].totalRevenue : 0;
    const previousOrders = previousStats.length > 0 ? previousStats[0].totalOrders : 0;

    // Calculate percentage changes
    const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const ordersChange = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0;

    // Get revenue trend data
    const revenueTrend = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$orderDate' }
          },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get orders trend data
    const ordersTrend = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$orderDate' }
          },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get platform distribution
    const platforms = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate } } },
      {
        $group: {
          _id: '$platform',
          orders: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      {
        $addFields: {
          percentage: { $multiply: [{ $divide: ['$revenue', totalRevenue] }, 100] }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Get status distribution
    const statusDistribution = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $addFields: {
          percentage: { $multiply: [{ $divide: ['$count', totalOrders] }, 100] }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get top products
    const topProducts = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    // Get customer metrics
    const customerMetrics = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate } } },
      {
        $group: {
          _id: '$customer.email',
          name: { $first: '$customer.name' },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$total' }
        }
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          averageOrderValue: { $avg: '$totalSpent' },
          repeatCustomers: {
            $sum: {
              $cond: [{ $gt: ['$orderCount', 1] }, 1, 0]
            }
          }
        }
      }
    ]);

    const customerData = customerMetrics.length > 0 ? customerMetrics[0] : {
      totalCustomers: 0,
      averageOrderValue: 0,
      repeatCustomers: 0
    };

    // Get new customers (customers who made their first order in this period)
    const newCustomers = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate } } },
      {
        $group: {
          _id: '$customer.email',
          firstOrderDate: { $min: '$orderDate' }
        }
      },
      {
        $match: {
          firstOrderDate: { $gte: startDate }
        }
      },
      { $count: 'count' }
    ]);

    const newCustomersCount = newCustomers.length > 0 ? newCustomers[0].count : 0;

    res.json({
      revenue: {
        total: totalRevenue,
        change: Math.round(revenueChange * 100) / 100,
        trend: revenueTrend.map(item => ({
          date: item._id,
          revenue: item.revenue
        }))
      },
      orders: {
        total: totalOrders,
        change: Math.round(ordersChange * 100) / 100,
        trend: ordersTrend.map(item => ({
          date: item._id,
          orders: item.orders
        }))
      },
      platforms: platforms.map(p => ({
        platform: p._id,
        orders: p.orders,
        revenue: p.revenue,
        percentage: Math.round(p.percentage * 100) / 100
      })),
      statusDistribution: statusDistribution.map(s => ({
        status: s._id,
        count: s.count,
        percentage: Math.round(s.percentage * 100) / 100
      })),
      topProducts: topProducts.map(p => ({
        name: p._id,
        quantity: p.quantity,
        revenue: p.revenue
      })),
      customerMetrics: {
        totalCustomers: customerData.totalCustomers,
        newCustomers: newCustomersCount,
        repeatCustomers: customerData.repeatCustomers,
        averageOrderValue: Math.round(customerData.averageOrderValue * 100) / 100
      }
    });
  } catch (error) {
    console.error('Trends analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/export
// @desc    Export analytics data
// @access  Private
router.get('/export', authenticateToken, requirePermission('export_data'), [
  query('type').isIn(['orders', 'revenue', 'platforms']),
  query('format').optional().isIn(['json', 'csv']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, format = 'json', startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    }

    let data;
    switch (type) {
      case 'orders':
        data = await Order.find(dateFilter).sort({ orderDate: -1 });
        break;
      case 'revenue':
        data = await Order.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$orderDate' }
              },
              revenue: { $sum: '$total' },
              orderCount: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        break;
      case 'platforms':
        data = await Order.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: '$platform',
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: '$total' }
            }
          },
          { $sort: { totalRevenue: -1 } }
        ]);
        break;
    }

    if (format === 'csv') {
      // TODO: Implement CSV export
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}_${Date.now()}.csv`);
      res.send('CSV export not implemented yet');
    } else {
      res.json({ data });
    }
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 