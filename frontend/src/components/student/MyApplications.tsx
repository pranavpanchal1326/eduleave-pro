import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { leaveService } from '../../services/leaveService';
import { LeaveApplication } from '../../types';
import ApplicationCard from './ApplicationCard';

const MyApplications = () => {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getMyApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) =>
    filter === 'all' ? true : app.status === filter
  );

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Header with Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 3 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              My Applications
            </Typography>
            <Tabs
              value={filter}
              onChange={(_, value) => setFilter(value)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={`All (${counts.all})`} value="all" />
              <Tab label={`Pending (${counts.pending})`} value="pending" />
              <Tab label={`Approved (${counts.approved})`} value="approved" />
              <Tab label={`Rejected (${counts.rejected})`} value="rejected" />
            </Tabs>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : filteredApplications.length > 0 ? (
              <Box>
                {filteredApplications.map((app) => (
                  <ApplicationCard key={app._id} application={app} />
                ))}
              </Box>
            ) : (
              <Alert severity="info">
                No {filter !== 'all' && filter} applications found.
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MyApplications;
