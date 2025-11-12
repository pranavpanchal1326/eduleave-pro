import { useEffect } from 'react';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { School, Assignment, Analytics, Speed } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Assignment sx={{ fontSize: 50 }} />,
      title: 'Easy Leave Application',
      description: 'Submit leave requests in seconds with our intuitive interface',
    },
    {
      icon: <Speed sx={{ fontSize: 50 }} />,
      title: 'Fast Approval',
      description: 'Faculty can review and approve requests instantly',
    },
    {
      icon: <Analytics sx={{ fontSize: 50 }} />,
      title: 'Analytics Dashboard',
      description: 'Track leave trends and generate insightful reports',
    },
    {
      icon: <School sx={{ fontSize: 50 }} />,
      title: 'College-Wide System',
      description: 'Manage leave for all departments in one place',
    },
  ];

  // ✅ FIX: Move navigate to useEffect
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Show loading while checking auth
  if (user) {
    return null;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Elements */}
        <motion.div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            top: '-100px',
            right: '-100px',
          }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 4,
            }}
          >
            {/* Left Content */}
            <Box sx={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: { xs: '3rem', md: '4rem' },
                    mb: 3,
                  }}
                >
                  EduLeave Pro
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  The modern leave management system built for colleges.
                  Streamline applications, approvals, and tracking.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      background: '#fff',
                      color: '#667eea',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      color: '#fff',
                      borderColor: '#fff',
                      '&:hover': {
                        borderColor: '#fff',
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </motion.div>
            </Box>

            {/* Right Image */}
            <Box sx={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="https://illustrations.popsy.co/amber/student-going-to-school.svg"
                  alt="Student"
                  sx={{
                    width: '100%',
                    maxWidth: '500px',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                  }}
                />
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 6, fontWeight: 700 }}
            className="gradient-text"
          >
            Why Choose EduLeave Pro?
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 4,
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of students and faculty already using EduLeave Pro
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                px: 5,
                py: 2,
                fontSize: '1.2rem',
                background: '#fff',
                color: '#667eea',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Create Free Account
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
