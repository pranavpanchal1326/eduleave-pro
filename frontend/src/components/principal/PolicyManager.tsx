import {
    Card,
    CardContent,
    Typography,
    Box,
    TextField,
    Button,
    Divider,
    Stack,
  } from '@mui/material';
  import { Settings, Save } from '@mui/icons-material';
  import { useState } from 'react';
  import { motion } from 'framer-motion';
  import { toast } from 'react-toastify';
  
  const PolicyManager = () => {
    const [leaveQuota, setLeaveQuota] = useState(12);
  
    const handleSave = () => {
      toast.success('Policy updated successfully! ✅');
    };
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Settings sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Policy Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure system-wide leave policies
                </Typography>
              </Box>
            </Box>
  
            <Divider sx={{ my: 3 }} />
  
            <Stack spacing={3}>
              {/* Fields Row */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    Annual Leave Quota
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={leaveQuota}
                    onChange={(e) => setLeaveQuota(Number(e.target.value))}
                    helperText="Total leave days per student per year"
                    InputProps={{
                      endAdornment: <Typography color="text.secondary">days</Typography>,
                    }}
                  />
                </Box>
  
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    Academic Year
                  </Typography>
                  <TextField
                    fullWidth
                    value="2024-2025"
                    InputProps={{ readOnly: true }}
                    helperText="Current academic year"
                  />
                </Box>
              </Box>
  
              {/* Note Box */}
              <Box
                sx={{
                  p: 3,
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Note:</strong> Changing the leave quota will affect all students. The new
                  quota will be applied immediately to all active student accounts.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current settings: {leaveQuota} days per year
                </Typography>
              </Box>
  
              {/* Save Button */}
              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ px: 4, alignSelf: 'flex-start' }}
              >
                Save Changes
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  
  export default PolicyManager;
  