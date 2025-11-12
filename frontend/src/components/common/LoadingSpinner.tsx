import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CircularProgress size={60} sx={{ color: '#fff' }} />
      </motion.div>
      <Typography
        variant="h6"
        sx={{ color: '#fff', mt: 3, fontWeight: 600 }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
