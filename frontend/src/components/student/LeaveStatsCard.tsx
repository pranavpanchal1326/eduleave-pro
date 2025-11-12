import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { 
  PendingActions, 
  CheckCircle, 
  Cancel, 
  Description 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { leaveService } from '../../services/leaveService';
import { LeaveApplication } from '../../types'; // ✅ Import type

interface LeaveStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const LeaveStatsCard = () => {
  const [stats, setStats] = useState<LeaveStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const applications: LeaveApplication[] = await leaveService.getMyApplications(); // ✅ FIXED: Removed .data

      const statsData = {
        total: applications.length,
        pending: applications.filter((app) => app.status === 'pending').length,
        approved: applications.filter((app) => app.status === 'approved').length,
        rejected: applications.filter((app) => app.status === 'rejected').length,
      };

      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingPercentage = stats.total > 0 ? (stats.pending / stats.total) * 100 : 0;
  const approvedPercentage = stats.total > 0 ? (stats.approved / stats.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          height: '100%',
          minHeight: 280,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Description sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700}>
              My Leave Stats
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <>
              {/* Total Applications */}
              <Box sx={{ textAlign: 'center', my: 3 }}>
                <Typography variant="h1" fontWeight={800} sx={{ fontSize: '4rem', lineHeight: 1 }}>
                  {stats.total}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
                  Total Applications
                </Typography>
              </Box>

              {/* Status Breakdown */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Approved
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {approvedPercentage.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={approvedPercentage}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#4caf50',
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Quick Stats Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mt: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <PendingActions sx={{ fontSize: 24, mb: 0.5 }} />
                  <Typography variant="h6" fontWeight={700}>
                    {stats.pending}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Pending
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircle sx={{ fontSize: 24, mb: 0.5 }} />
                  <Typography variant="h6" fontWeight={700}>
                    {stats.approved}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Approved
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Cancel sx={{ fontSize: 24, mb: 0.5 }} />
                  <Typography variant="h6" fontWeight={700}>
                    {stats.rejected}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Rejected
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LeaveStatsCard;
