import { Typography, Box, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AnalyticsDashboard from '../components/principal/AnalyticsDashboard';
import PolicyManager from '../components/principal/PolicyManager';
import { useAuth } from '../context/AuthContext';
import socketService from '../services/socket';

const PrincipalDashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socketService.connect(user.id);
    }
    return () => {
      socketService.disconnect();
    };
  }, [user]);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Principal Dashboard 🎓
          </Typography>
          <Typography variant="body1" color="text.secondary">
            System-wide analytics and management
          </Typography>
        </Box>

        <Stack spacing={3}>
          <AnalyticsDashboard />
          <PolicyManager />
        </Stack>
      </motion.div>
    </DashboardLayout>
  );
};

export default PrincipalDashboard;
