import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { Menu as MenuIcon, Person, Logout } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      student: '#667eea',
      faculty: '#f093fb',
      principal: '#4facfe',
    };
    return colors[role] || '#667eea';
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(10px)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              cursor: 'pointer',
            }}
            onClick={() => navigate('/dashboard')}
          >
            EduLeave Pro
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThemeToggle />
          <NotificationBell />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton onClick={handleProfileClick} sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  bgcolor: getRoleColor(user?.role || ''),
                  width: 40,
                  height: 40,
                  fontWeight: 600,
                  border: '2px solid white',
                }}
              >
                {user?.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </motion.div>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
              <Box
                sx={{
                  mt: 0.5,
                  px: 1,
                  py: 0.3,
                  borderRadius: 1,
                  bgcolor: getRoleColor(user?.role || ''),
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'inline-block',
                  textTransform: 'capitalize',
                }}
              >
                {user?.role}
              </Box>
            </Box>

            <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); }}>
              <Person sx={{ mr: 1.5, fontSize: 20 }} />
              Dashboard
            </MenuItem>

            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <Logout sx={{ mr: 1.5, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
