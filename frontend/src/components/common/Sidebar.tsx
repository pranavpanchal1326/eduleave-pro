import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  People,
  Analytics,
  Settings,
  ExitToApp,
  Description,
  PendingActions,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const studentMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Apply Leave', icon: <Assignment />, path: '/dashboard' },
    { text: 'My Applications', icon: <Description />, path: '/dashboard' },
  ];

  const facultyMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Pending Requests', icon: <PendingActions />, path: '/dashboard' },
    { text: 'All Applications', icon: <Description />, path: '/dashboard' },
  ];

  const principalMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Analytics', icon: <Analytics />, path: '/dashboard' },
    { text: 'Policy Settings', icon: <Settings />, path: '/dashboard' },
  ];

  const menuItems =
    user?.role === 'student'
      ? studentMenuItems
      : user?.role === 'faculty'
      ? facultyMenuItems
      : principalMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo & Brand */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          EduLeave Pro
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          {user?.role?.toUpperCase()} PORTAL
        </Typography>
      </Box>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '1.5rem',
              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" fontWeight={600} noWrap>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.department || 'Administrator'}
            </Typography>
            {user?.year && (
              <Typography variant="caption" color="text.secondary" display="block">
                Year {user.year}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                py: 1.5,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'white' : 'primary.main',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              bgcolor: 'error.main',
              color: 'white',
              borderColor: 'error.main',
              '& .MuiListItemIcon-root': {
                color: 'white',
              },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: open ? 'block' : 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            position: 'fixed',
            height: '100vh',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
