import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Search,
  FilterList,
  Refresh,
  ExpandMore,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { leaveService } from '../services/leaveService';
import { LeaveApplication } from '../types';
import ReviewModal from '../components/faculty/ReviewModal';

const FacultyDashboard = () => {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReasons, setExpandedReasons] = useState<{ [key: string]: boolean }>({});
  const [selectedApp, setSelectedApp] = useState<LeaveApplication | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    year: 'all',
    category: 'all',
    status: 'pending',
    search: '',
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, applications]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getDepartmentApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];

    if (filters.year !== 'all') {
      filtered = filtered.filter((app) => app.year === parseInt(filters.year));
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter((app) => app.leaveCategory === filters.category);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((app) => app.status === filters.status);
    }

    if (filters.search.trim()) {
      filtered = filtered.filter((app) =>
        app.studentName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      year: 'all',
      category: 'all',
      status: 'pending',
      search: '',
    });
  };

  const toggleReason = (id: string) => {
    setExpandedReasons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReview = (app: LeaveApplication) => {
    setSelectedApp(app);
    setReviewModalOpen(true);
  };

  const getCategoryEmoji = (category: string) => {
    const map: { [key: string]: string } = {
      sick: '🤒',
      casual: '☕',
      event: '🎉',
      personal: '👤',
    };
    return map[category] || '📝';
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeAgo = (date: string | Date) => {
    const now = new Date();
    const past = typeof date === 'string' ? new Date(date) : date;
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: '#ff9800',
      approved: '#4caf50',
      rejected: '#f44336',
    };
    return colors[status] || '#9e9e9e';
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom className="gradient-text">
            Leave Applications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review and manage student leave requests
          </Typography>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <FilterList color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Filters
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={resetFilters}
              >
                Reset
              </Button>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
              <TextField
                fullWidth
                label="Search Student"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Enter student name..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
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
                select
                label="Leave Category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="sick">🤒 Sick Leave</MenuItem>
                <MenuItem value="casual">☕ Casual Leave</MenuItem>
                <MenuItem value="event">🎉 Event Leave</MenuItem>
                <MenuItem value="personal">👤 Personal Leave</MenuItem>
              </TextField>

              <TextField
                fullWidth
                select
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">⏳ Pending</MenuItem>
                <MenuItem value="approved">✅ Approved</MenuItem>
                <MenuItem value="rejected">❌ Rejected</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip
                label={`${filteredApplications.length} Applications`}
                color="primary"
                variant="outlined"
              />
              {filters.year !== 'all' && (
                <Chip
                  label={`Year ${filters.year}`}
                  onDelete={() => handleFilterChange('year', 'all')}
                  size="small"
                />
              )}
              {filters.category !== 'all' && (
                <Chip
                  label={filters.category}
                  onDelete={() => handleFilterChange('category', 'all')}
                  size="small"
                />
              )}
              {filters.search && (
                <Chip
                  label={`"${filters.search}"`}
                  onDelete={() => handleFilterChange('search', '')}
                  size="small"
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Box>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : filteredApplications.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No applications found matching your filters
                </Typography>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((app) => {
              const isExpanded = expandedReasons[app._id] || false;
              const shouldTruncate = app.reason && app.reason.length > 150;
              const displayReason = isExpanded || !shouldTruncate 
                ? app.reason 
                : app.reason?.substring(0, 150) + '...';

              return (
                <Card key={app._id} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          👤 {app.studentName || 'Unknown Student'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {app.department || 'Computer Science'} • Year {app.year || 'N/A'}
                        </Typography>
                      </Box>
                      <Chip
                        label={app.status ? app.status.toUpperCase() : 'PENDING'}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(app.status || 'pending'),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Leave Info */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        🏷️ {getCategoryEmoji(app.leaveCategory || 'personal')} {app.leaveCategory ? (app.leaveCategory.charAt(0).toUpperCase() + app.leaveCategory.slice(1)) : 'General'} Leave
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        📅 {formatDate(app.startDate)} - {formatDate(app.endDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ⏰ {app.duration || 0} day{app.duration !== 1 ? 's' : ''}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Reason */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          Reason for Leave:
                        </Typography>
                        {shouldTruncate && (
                          <IconButton
                            size="small"
                            onClick={() => toggleReason(app._id)}
                            sx={{
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s',
                            }}
                          >
                            <ExpandMore fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                      >
                        {displayReason || 'No reason provided'}
                      </Typography>

                      {shouldTruncate && !isExpanded && (
                        <Button 
                          size="small" 
                          onClick={() => toggleReason(app._id)}
                          sx={{ textTransform: 'none', p: 0, mt: 0.5 }}
                        >
                          Read more
                        </Button>
                      )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Footer */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Submitted {getTimeAgo(app.createdAt)}
                      </Typography>
                      
                      {app.status === 'pending' && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleReview(app)}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            textTransform: 'none',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            },
                          }}
                        >
                          Review
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      </motion.div>

      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        application={selectedApp}
        onSuccess={fetchApplications}
      />
    </DashboardLayout>
  );
};

export default FacultyDashboard;
