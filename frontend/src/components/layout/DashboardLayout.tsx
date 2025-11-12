import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  return (
    <Box 
      sx={{ 
        display: 'flex',
        height: '100vh', // ✅ CRITICAL: Fixed viewport height
        overflow: 'hidden', // ✅ CRITICAL: Prevent body scroll
        bgcolor: 'background.default',
      }}
    >
      {/* Sidebar - Fixed Position */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: { xs: 0, md: sidebarOpen ? '280px' : 0 },
          transition: 'margin 0.3s ease',
          height: '100vh', // ✅ CRITICAL: Full height
          overflow: 'hidden', // ✅ Prevent overflow here
        }}
      >
        {/* Navbar - Fixed at Top */}
        <Box sx={{ flexShrink: 0 }}> {/* ✅ Prevent navbar from shrinking */}
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </Box>

        {/* Scrollable Content Container - THIS IS THE KEY */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: 'auto', // ✅ CRITICAL: Enable scroll HERE
            overflowX: 'hidden',
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: 'background.default',
            
            // ✅ Beautiful Scrollbar
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            },
          }}
        >
          {/* Content Wrapper with Max Width */}
          <Box sx={{ maxWidth: '1600px', mx: 'auto', width: '100%' }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
