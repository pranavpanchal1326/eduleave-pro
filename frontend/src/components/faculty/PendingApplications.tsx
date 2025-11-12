import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Chip,
  InputAdornment,
} from '@mui/material';
import { PendingActions, Search, FilterList, Refresh } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { leaveService } from '../../services/leaveService';
import { LeaveApplication } from '../../types';
import ApplicationCard from './ApplicationCard';
import ReviewModal from './ReviewModal';

const PendingApplications = () => {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<LeaveApplication | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    year: 'all',
    category: 'all',
    search: '',
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getPendingApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (application: LeaveApplication) => {
    setSelectedApp(application);
    setReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    fetchApplications();
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({ year: 'all', category: 'all', search: '' });
  };

  const filteredApplications = applications.filter((app) => {
    if (filters.year !== 'all' && app.year !== parseInt(filters.year)) {
      return false;
    }
    if (filters.category !== 'all' && app.leaveCategory !== filters.category) {
      return false;
    }
    if (filters.search && !app.studentName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const hasActiveFilters = filters.year !== 'all' || filters.category !== 'all' || filters.search !== '';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <PendingActions sx={{ fontSize: 32, color: 'warning.main' }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" fontWeight={700}>
                  Pending Approvals
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} awaiting review
                </Typography>
              </Box>
            </Box>

            <Card variant="outlined" sx={{ mb: 3, bgcolor: 'background.default' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <FilterList fontSize="small" color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Filters
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  {hasActiveFilters && (
                    <Button size="small" startIcon={<Refresh />} onClick={resetFilters}>
                      Reset
                    </Button>
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(3, 1fr)',
                    },
                    gap: 2,
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    label="Search Student"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Enter name..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    select
                    label="Year"
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                  >
                    <MenuItem value="all">All Years</MenuItem>
                    <MenuItem value="1">1st Year</MenuItem>
                    <MenuItem value="2">2nd Year</MenuItem>
                    <MenuItem value="3">3rd Year</MenuItem>
                    <MenuItem value="4">4th Year</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    size="small"
                    select
                    label="Leave Category"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="sick">🤒 Sick</MenuItem>
                    <MenuItem value="casual">☕ Casual</MenuItem>
                    <MenuItem value="event">🎉 Event</MenuItem>
                    <MenuItem value="personal">👤 Personal</MenuItem>
                  </TextField>
                </Box>

                {hasActiveFilters && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    {filters.year !== 'all' && (
                      <Chip
                        size="small"
                        label={`Year ${filters.year}`}
                        onDelete={() => handleFilterChange('year', 'all')}
                      />
                    )}
                    {filters.category !== 'all' && (
                      <Chip
                        size="small"
                        label={filters.category}
                        onDelete={() => handleFilterChange('category', 'all')}
                      />
                    )}
                    {filters.search && (
                      <Chip
                        size="small"
                        label={`"${filters.search}"`}
                        onDelete={() => handleFilterChange('search', '')}
                      />
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : filteredApplications.length === 0 ? (
              <Alert severity={hasActiveFilters ? 'info' : 'success'}>
                {hasActiveFilters
                  ? '🔍 No applications match your filters. Try adjusting them.'
                  : '🎉 All caught up! No pending applications to review.'}
              </Alert>
            ) : (
              <AnimatePresence>
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    key={application._id}
                    application={application}
                    onReview={handleReview}
                  />
                ))}
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        application={selectedApp}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
};

export default PendingApplications;
