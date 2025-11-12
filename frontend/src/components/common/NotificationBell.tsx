import { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
} from '@mui/material';
import { Notifications, NotificationsNone } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '../../services/notificationService';
import { Notification } from '../../types';
import { getTimeAgo } from '../../utils/helpers';
import socketService from '../../services/socket';
import { toast } from 'react-toastify';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time notifications
    socketService.on('new-notification', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.info(notification.message);

    });

    return () => {
      socketService.off('new-notification');
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <IconButton color="inherit" onClick={handleClick}>
          <Badge badgeContent={unreadCount} color="error">
            {unreadCount > 0 ? <Notifications /> : <NotificationsNone />}
          </Badge>
        </IconButton>
      </motion.div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 500,
            mt: 1.5,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllAsRead}>
              Mark all read
            </Button>
          )}
        </Box>
        <Divider />

        <AnimatePresence>
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">No notifications</Typography>
            </Box>
          ) : (
            notifications.slice(0, 10).map((notification) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <MenuItem
                  onClick={() => {
                    if (!notification.isRead) {
                      handleMarkAsRead(notification._id);
                    }
                    handleClose();
                  }}
                  sx={{
                    bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                    py: 2,
                    borderLeft: notification.isRead ? 'none' : '3px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={notification.isRead ? 400 : 600}>
                      {notification.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      {getTimeAgo(notification.createdAt)}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </Menu>
    </>
  );
};

export default NotificationBell;
