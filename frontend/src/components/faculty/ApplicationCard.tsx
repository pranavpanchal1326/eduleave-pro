import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Collapse,
  IconButton,
} from '@mui/material';
import { 
  ExpandMore,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { LeaveApplication } from '../../types';
import { formatDate, getStatusColor, getTimeAgo } from '../../utils/helpers';

interface ApplicationCardProps {
  application: LeaveApplication;
  onReview: (application: LeaveApplication) => void;
}

const ApplicationCard = ({ application, onReview }: ApplicationCardProps) => {
  const [showFullReason, setShowFullReason] = useState(false);
  const statusColor = getStatusColor(application.status);
  
  const getCategoryEmoji = (category: string) => {
    const map: { [key: string]: string } = {
      sick: '🤒',
      casual: '☕',
      event: '🎉',
      personal: '👤',
    };
    return map[category] || '📝';
  };

  const shouldTruncate = application.reason && application.reason.length > 150;
  const displayReason = showFullReason || !shouldTruncate 
    ? application.reason 
    : application.reason?.substring(0, 150) + '...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        sx={{ 
          mb: 2, 
          boxShadow: 2,
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': { boxShadow: 4 },
        }}
      >
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                👤 {application.studentName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {application.department} • Year {application.year}
              </Typography>
            </Box>
            <Chip
              label={application.status.toUpperCase()}
              size="small"
              sx={{
                bgcolor: statusColor,
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Leave Info */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              🏷️ {getCategoryEmoji(application.leaveCategory)} {application.leaveCategory.charAt(0).toUpperCase() + application.leaveCategory.slice(1)} Leave
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              📅 {formatDate(application.startDate)} - {formatDate(application.endDate)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ⏰ {application.duration} day{application.duration !== 1 ? 's' : ''}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Reason Section */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                Reason for Leave:
              </Typography>
              {shouldTruncate && (
                <IconButton
                  size="small"
                  onClick={() => setShowFullReason(!showFullReason)}
                  sx={{
                    transform: showFullReason ? 'rotate(180deg)' : 'rotate(0deg)',
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
              sx={{ 
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                mb: shouldTruncate && !showFullReason ? 1 : 0
              }}
            >
              {displayReason || 'No reason provided'}
            </Typography>

            {shouldTruncate && !showFullReason && (
              <Button 
                size="small" 
                onClick={() => setShowFullReason(true)}
                sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
              >
                Read more
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Submitted {getTimeAgo(application.createdAt)}
            </Typography>
            
            {application.status === 'pending' && (
              <Button
                variant="contained"
                size="small"
                onClick={() => onReview(application)}
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

            {application.status === 'approved' && (
              <Chip
                icon={<CheckCircle />}
                label="Approved"
                size="small"
                sx={{ bgcolor: 'success.main', color: 'white' }}
              />
            )}

            {application.status === 'rejected' && (
              <Chip
                icon={<Cancel />}
                label="Rejected"
                size="small"
                sx={{ bgcolor: 'error.main', color: 'white' }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ApplicationCard;
