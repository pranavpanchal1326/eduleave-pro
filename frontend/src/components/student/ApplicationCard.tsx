import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
  } from '@mui/material';
  import { ExpandMore, CalendarToday, Schedule, Notes } from '@mui/icons-material';
  import { motion } from 'framer-motion';
  import { LeaveApplication } from '../../types';
  import { formatDate, getStatusColor } from '../../utils/helpers';
  
  interface ApplicationCardProps {
    application: LeaveApplication;
  }
  
  const ApplicationCard = ({ application }: ApplicationCardProps) => {
    const statusColor = getStatusColor(application.status);
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
      >
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {application.leaveType === 'half-day' ? 'Half Day Leave' : 'Full Day Leave'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Applied on {formatDate(application.createdAt)}
                </Typography>
              </Box>
              <Chip
                label={application.status.toUpperCase()}
                size="small"
                sx={{
                  bgcolor: statusColor,
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              />
            </Box>
  
            <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2">
                  {formatDate(application.startDate)}
                  {application.leaveType === 'full-day' && ` - ${formatDate(application.endDate)}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2">
                  {application.duration} day{application.duration !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>
  
            <Divider sx={{ my: 2 }} />
  
            <Accordion elevation={0} sx={{ bgcolor: 'transparent' }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Notes sx={{ fontSize: 18 }} />
                  <Typography variant="body2" fontWeight={600}>
                    View Details
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Reason:</strong> {application.reason}
                </Typography>
  
                {application.status !== 'pending' && (
                  <>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Reviewed by:</strong> Faculty
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Reviewed on:</strong> {formatDate(application.reviewedAt || '')}
                    </Typography>
                    {application.reviewComments && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Comments:</strong> {application.reviewComments}
                      </Typography>
                    )}
                  </>
                )}
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  
  export default ApplicationCard;
  