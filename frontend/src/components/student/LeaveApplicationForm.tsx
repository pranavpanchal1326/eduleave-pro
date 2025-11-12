import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Alert,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Send } from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import { leaveService } from '../../services/leaveService';
import { toast } from 'react-toastify';
import { LEAVE_TYPES } from '../../utils/constants';

interface LeaveApplicationFormProps {
  onSuccess?: () => void;
}

// ✅ Type alias for cleaner code
type LeaveCategory = 'sick' | 'casual' | 'event' | 'personal';

// ✅ Leave Categories
const LEAVE_CATEGORIES = [
  { value: 'sick', label: '🤒 Sick Leave', description: 'Medical reasons, illness' },
  { value: 'casual', label: '☕ Casual Leave', description: 'Personal work, short breaks' },
  { value: 'event', label: '🎉 Event Leave', description: 'College events, competitions' },
  { value: 'personal', label: '👤 Personal Leave', description: 'Private/personal reasons' },
];

const LeaveApplicationForm = ({ onSuccess }: LeaveApplicationFormProps) => {
  const [leaveType, setLeaveType] = useState<'half-day' | 'full-day'>('full-day');
  const [leaveCategory, setLeaveCategory] = useState<LeaveCategory>('casual'); // ✅ FIXED: Added type
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    if (leaveType === 'half-day') return 0.5;
    const days = endDate.diff(startDate, 'day') + 1;
    return Math.max(1, days);
  };

  const duration = calculateDuration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error('Please select dates');
      return;
    }

    if (endDate.isBefore(startDate)) {
      toast.error('End date cannot be before start date');
      return;
    }

    if (reason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      await leaveService.applyLeave({
        leaveType,
        leaveCategory,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        reason,
      });

      toast.success('Leave application submitted successfully! 🎉');

      // Reset form
      setLeaveType('full-day');
      setLeaveCategory('casual');
      setStartDate(dayjs());
      setEndDate(dayjs());
      setReason('');

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h5" fontWeight={700} mb={3} className="gradient-text">
            Apply for Leave
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* ✅ Leave Category Dropdown */}
              <TextField
                fullWidth
                select
                label="Leave Category"
                value={leaveCategory}
                onChange={(e) => setLeaveCategory(e.target.value as LeaveCategory)}
                required
                helperText="Select the type of leave you're applying for"
              >
                {LEAVE_CATEGORIES.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <Box>
                      <Typography variant="body1">{category.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              {/* Leave Type & Duration Row */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <TextField
                  fullWidth
                  select
                  label="Leave Type"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  required
                >
                  {LEAVE_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Duration"
                  value={`${duration} day${duration !== 1 ? 's' : ''}`}
                  InputProps={{ readOnly: true }}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontWeight: 600,
                      color: 'primary.main',
                    },
                  }}
                />
              </Box>

              {/* Dates Row */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      minDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      disabled={leaveType === 'half-day'}
                      minDate={startDate || dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>

              {/* Reason */}
              <TextField
                fullWidth
                label="Reason for Leave"
                multiline
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="Please provide a detailed reason for your leave request..."
                helperText={`${reason.length}/500 characters (minimum 10)`}
                inputProps={{ maxLength: 500 }}
                error={reason.length > 0 && reason.length < 10}
              />

              {/* Info Alert */}
              <Alert severity="info" icon="ℹ️">
                <strong>No Leave Limit!</strong> Apply for leaves as needed. Each application will be reviewed individually.
              </Alert>

              {/* Submit Button */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<Send />}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  },
                }}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LeaveApplicationForm;
