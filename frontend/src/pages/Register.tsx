import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  InputAdornment,
  IconButton,
  Stack,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  School,
  Business,
  VpnKey, // ✅ NEW: Key icon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { RegisterData } from '../types';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    year: undefined,
    collegeName: '',
    registrationKey: '', // ✅ NEW
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false); // ✅ NEW
  const [loading, setLoading] = useState(false);

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Chemical',
    'Electrical',
  ];

  const handleChange = (field: keyof RegisterData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={10}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join EduLeave Pro today
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Name and Email Row */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* College Name */}
                <TextField
                  fullWidth
                  label="College Name"
                  value={formData.collegeName}
                  onChange={(e) => handleChange('collegeName', e.target.value)}
                  required
                  placeholder="e.g., MIT, Stanford, IIT Delhi"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password and Role Row */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    select
                    label="Role"
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    required
                  >
                    <MenuItem value="student">👨‍🎓 Student</MenuItem>
                    <MenuItem value="faculty">👨‍🏫 Faculty</MenuItem>
                    <MenuItem value="principal">👔 Principal</MenuItem>
                  </TextField>
                </Box>

                {/* ✅ NEW: Registration Key (Only for Faculty/Principal) */}
                {formData.role !== 'student' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <strong>🔑 Registration Key Required</strong>
                      <br />
                      {formData.role === 'faculty' 
                        ? 'Faculty members need a registration key. Contact your IT department.'
                        : 'Principal registration requires a master key. Contact the administrator.'}
                    </Alert>
                    <TextField
                      fullWidth
                      label="Registration Key"
                      type={showKey ? 'text' : 'password'}
                      value={formData.registrationKey}
                      onChange={(e) => handleChange('registrationKey', e.target.value)}
                      required
                      placeholder="Enter your registration key"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKey color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowKey(!showKey)} edge="end">
                              {showKey ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>
                )}

                {/* Department and Year Row (conditional) */}
                {(formData.role === 'student' || formData.role === 'faculty') && (
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    <TextField
                      fullWidth
                      select
                      label="Department"
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <School color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </TextField>

                    {formData.role === 'student' && (
                      <TextField
                        fullWidth
                        select
                        label="Year"
                        value={formData.year || ''}
                        onChange={(e) => handleChange('year', Number(e.target.value))}
                        required
                      >
                        <MenuItem value={1}>First Year</MenuItem>
                        <MenuItem value={2}>Second Year</MenuItem>
                        <MenuItem value={3}>Third Year</MenuItem>
                        <MenuItem value={4}>Fourth Year</MenuItem>
                      </TextField>
                    )}
                  </Box>
                )}
              </Stack>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Login here
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register;
