import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Chip,
    Divider,
    Stack,
  } from '@mui/material';
  import { CheckCircle, Cancel, CalendarToday, Person } from '@mui/icons-material';
  import { useState } from 'react';
  import { motion } from 'framer-motion';
  import { LeaveApplication } from '../../types';
  import { formatDate } from '../../utils/helpers';
  import { leaveService } from '../../services/leaveService';
  import { toast } from 'react-toastify';
  
  interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    application: LeaveApplication | null;
    onSuccess: () => void;
  }
  
  const ReviewModal = ({ open, onClose, application, onSuccess }: ReviewModalProps) => {
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(false);
  
    if (!application) return null;
  
    const handleApprove = async () => {
      setLoading(true);
      try {
        await leaveService.approveLeave(application._id, comments);
        toast.success('Leave application approved! ✅');
        onSuccess();
        onClose();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to approve');
      } finally {
        setLoading(false);
      }
    };
  
    const handleReject = async () => {
      if (!comments.trim()) {
        toast.error('Please provide a reason for rejection');
        return;
      }
      setLoading(true);
      try {
        await leaveService.rejectLeave(application._id, comments);
        toast.success('Leave application rejected');
        onSuccess();
        onClose();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to reject');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              Review Leave Application
            </Typography>
            <Chip
              label={application.leaveType.toUpperCase()}
              size="small"
              color="primary"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </DialogTitle>
  
        <DialogContent dividers>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Stack spacing={3}>
              {/* Student Details */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Person sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight={600}>
                    Student Details
                  </Typography>
                </Box>
                <Typography variant="body1">{application.studentName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {application.department} • Year {application.year}
                </Typography>
              </Box>
  
              {/* Dates */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarToday sx={{ fontSize: 20, color: 'primary.main' }} />
                    <Typography variant="body2" fontWeight={600}>
                      Start Date
                    </Typography>
                  </Box>
                  <Typography variant="body1">{formatDate(application.startDate)}</Typography>
                </Box>
  
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarToday sx={{ fontSize: 20, color: 'primary.main' }} />
                    <Typography variant="body2" fontWeight={600}>
                      End Date
                    </Typography>
                  </Box>
                  <Typography variant="body1">{formatDate(application.endDate)}</Typography>
                </Box>
              </Box>
  
              {/* Duration */}
              <Box>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Duration
                </Typography>
                <Chip
                  label={`${application.duration} day${application.duration !== 1 ? 's' : ''}`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
  
              <Divider />
  
              {/* Reason */}
              <Box>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Reason for Leave
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    borderLeft: '3px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <Typography variant="body2">{application.reason}</Typography>
                </Box>
              </Box>
  
              {/* Comments */}
              <TextField
                fullWidth
                label="Comments (Optional for approval, Required for rejection)"
                multiline
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any comments or feedback..."
              />
            </Stack>
          </motion.div>
        </DialogContent>
  
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleReject}
            disabled={loading}
            startIcon={<Cancel />}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleApprove}
            disabled={loading}
            startIcon={<CheckCircle />}
          >
            {loading ? 'Processing...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ReviewModal;
  