import { useState, useEffect } from 'react';
import { Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import api from '../../services/api';
import socketService from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import StatsCards from './StatsCards';
import Charts from './Charts';
import { Stats } from '../../types';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/analytics/stats');
      const data = response.data.data;

      setStats(data.overview);
      setDepartmentData(data.departments || []);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.error || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Connect to Socket.IO for real-time updates
    if (user) {
      socketService.connect(user.id);

      // Listen for leave application events
      socketService.on('leave-submitted', fetchAnalytics);
      socketService.on('leave-approved', fetchAnalytics);
      socketService.on('leave-rejected', fetchAnalytics);
    }

    return () => {
      socketService.off('leave-submitted');
      socketService.off('leave-approved');
      socketService.off('leave-rejected');
    };
  }, [user]);

  const statusData = [
    { name: 'Approved', value: stats.approved },
    { name: 'Pending', value: stats.pending },
    { name: 'Rejected', value: stats.rejected },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} - Showing demo data
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <StatsCards stats={stats} />
      </Box>

      <Charts departmentData={departmentData} statusData={statusData} />
    </motion.div>
  );
};

export default AnalyticsDashboard;
