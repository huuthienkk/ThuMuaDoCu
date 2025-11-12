// admin/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { People, Store, TrendingUp, Block } from '@mui/icons-material';
import api from '../services/api';


const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  const statCards = [
    { 
      title: 'Tổng Users', 
      value: stats.totalUsers || 0, 
      icon: <People />, 
      color: '#1976d2' 
    },
    { 
      title: 'Tổng Sản phẩm', 
      value: stats.totalProducts || 0, 
      icon: <Store />, 
      color: '#2e7d32' 
    },
    { 
      title: 'Users Active', 
      value: stats.activeUsers || 0, 
      icon: <TrendingUp />, 
      color: '#ed6c02' 
    },
    { 
      title: 'Users Inactive', 
      value: stats.inactiveUsers || 0, 
      icon: <Block />, 
      color: '#d32f2f' 
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ background: card.color, color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6">{card.title}</Typography>
                    <Typography variant="h4" mt={1}>{card.value}</Typography>
                  </Box>
                  <Box sx={{ fontSize: 40 }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;