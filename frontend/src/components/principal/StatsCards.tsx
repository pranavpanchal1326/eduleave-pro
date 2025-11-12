import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, HourglassEmpty, CheckCircle, Cancel } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Stats } from '../../types';

interface StatsCardsProps {
  stats: Stats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: <HourglassEmpty sx={{ fontSize: 40 }} />,
      color: '#FFA726',
      gradient: 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)',
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: '#66BB6A',
      gradient: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: <Cancel sx={{ fontSize: 40 }} />,
      color: '#EF5350',
      gradient: 'linear-gradient(135deg, #EF5350 0%, #E53935 100%)',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: 3,
      }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
        >
          <Card
            sx={{
              background: card.gradient,
              color: 'white',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" fontWeight={700}>
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ opacity: 0.3 }}>{card.icon}</Box>
              </Box>

              {/* Decorative circle */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  right: -30,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
};

export default StatsCards;
