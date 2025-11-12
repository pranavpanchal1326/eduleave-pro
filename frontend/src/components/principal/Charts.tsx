import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import api from '../../services/api';

interface ChartsProps {
  departmentData: any[];
  statusData: any[];
}

const COLORS = ['#66BB6A', '#FFA726', '#EF5350'];

const Charts = ({ departmentData: initialDeptData, statusData: initialStatusData }: ChartsProps) => {
  const [departmentData, setDepartmentData] = useState(initialDeptData);
  const [statusData, setStatusData] = useState(initialStatusData);
  const [loading, setLoading] = useState(false);

  // Fetch real-time data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/analytics/stats');
        const data = response.data.data;
        
        // Update department data
        if (data.departments) {
          setDepartmentData(data.departments);
        }
        
        // Update status data
        if (data.overview) {
          setStatusData([
            { name: 'Approved', value: data.overview.approved },
            { name: 'Pending', value: data.overview.pending },
            { name: 'Rejected', value: data.overview.rejected },
          ]);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Fallback to props data if API fails
        setDepartmentData(initialDeptData);
        setStatusData(initialStatusData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [initialDeptData, initialStatusData]);

  const total = statusData.reduce((sum, item) => sum + item.value, 0);

  if (loading && departmentData.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
      {/* Department Stats */}
      <Box sx={{ flex: { xs: 1, md: 2 } }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                  Applications by Department
                </Typography>
                {loading && <CircularProgress size={20} />}
              </Box>
              
              {departmentData.length > 0 ? (
                <Box>
                  {departmentData.map((dept: any, index: number) => {
                    const total = (dept.approved || 0) + (dept.pending || 0) + (dept.rejected || 0);
                    return (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1" fontWeight={600}>
                            {dept.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total: {total}
                          </Typography>
                        </Box>
                        
                        {/* Progress bars */}
                        <Box sx={{ display: 'flex', height: 40, borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                          {dept.approved > 0 && (
                            <Box
                              sx={{
                                width: `${(dept.approved / total) * 100}%`,
                                bgcolor: '#66BB6A',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                              }}
                            >
                              {dept.approved}
                            </Box>
                          )}
                          {dept.pending > 0 && (
                            <Box
                              sx={{
                                width: `${(dept.pending / total) * 100}%`,
                                bgcolor: '#FFA726',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                              }}
                            >
                              {dept.pending}
                            </Box>
                          )}
                          {dept.rejected > 0 && (
                            <Box
                              sx={{
                                width: `${(dept.rejected / total) * 100}%`,
                                bgcolor: '#EF5350',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                              }}
                            >
                              {dept.rejected}
                            </Box>
                          )}
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, fontSize: '0.75rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#66BB6A', borderRadius: '50%' }} />
                            <Typography variant="caption">Approved: {dept.approved || 0}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#FFA726', borderRadius: '50%' }} />
                            <Typography variant="caption">Pending: {dept.pending || 0}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#EF5350', borderRadius: '50%' }} />
                            <Typography variant="caption">Rejected: {dept.rejected || 0}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography color="text.secondary" align="center">
                  No department data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      {/* Status Distribution */}
      <Box sx={{ flex: 1 }}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={3}>
                Status Distribution
              </Typography>
              
              {statusData.length > 0 ? (
                <Box>
                  {statusData.map((status, index) => {
                    const percentage = total ? ((status.value / total) * 100).toFixed(1) : 0;
                    return (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {status.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {status.value} ({percentage}%)
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: 'action.hover',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            style={{
                              height: '100%',
                              background: COLORS[index % COLORS.length],
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                  
                  {/* Summary */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      <strong>Total Applications:</strong> {total}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography color="text.secondary" align="center">
                  No status data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Charts;
