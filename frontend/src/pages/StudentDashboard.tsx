import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import LeaveStatsCard from '../components/student/LeaveStatsCard'; // ✅ FIXED: Correct name
import LeaveApplicationForm from '../components/student/LeaveApplicationForm';
import MyApplications from '../components/student/MyApplications';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import socketService from '../services/socket';

const StudentDashboard = () => {
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
        {/* Welcome Header - Improved Spacing */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            gutterBottom
            className="gradient-text"
          >
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
            {user?.department} • Year {user?.year}
          </Typography>
        </Box>

        {/* Top Section: Leave Stats + Application Form */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr',
              md: '350px 1fr',
              lg: '380px 1fr'
            },
            gap: 3,
            mb: 4,
            alignItems: 'start',
          }}
        >
          {/* Leave Stats Card - Animated */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <LeaveStatsCard /> {/* ✅ FIXED: Correct component name */}
          </motion.div>

          {/* Application Form - Animated */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LeaveApplicationForm onSuccess={() => window.location.reload()} />
          </motion.div>
        </Box>

        {/* Bottom Section: My Applications - Animated + Spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={{ pb: 8 }}> {/* ✅ IMPROVED: Extra padding for scroll */}
            <MyApplications />
          </Box>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
