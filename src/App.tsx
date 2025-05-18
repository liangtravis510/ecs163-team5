import { AppBar, Toolbar, Typography, Container, Box, Paper, Link } from '@mui/material';

function App() {
  return (
    <Box sx={{ bgcolor: '#2f353f', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#2f353f', borderBottom: '4px solid #2f353f' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Competitive Pokémon Visualization</Typography>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h3" gutterBottom>
          Pokémon battling in Smogon/VCG Worlds
        </Typography>
        <Typography variant="h5" gutterBottom>
          A Data Visualization
        </Typography>
        <Typography variant="body2">Last updated: May 14, 2025</Typography>
      </Container>

      {/* About Section */}
      <Container sx={{ mt: 8, maxWidth: 'md' }}>
        <Paper 
          elevation={0} 
          sx={{ 
            bgcolor: '#1a1f2c', 
            color: '#c0c0c0', 
            p: 3, 
            border: '1px solid #333', 
            borderRadius: '8px'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
            About This Tool
          </Typography>
          <Typography variant="body2" paragraph>
            This tracker lets players explore Pokémon usage trends from Smogon and VGC over time.
          </Typography>
          <Typography variant="body2" paragraph>
            Discover how formats evolve, which Pokémon dominate, and build your team based on real data.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Box sx={{ width: '12px', height: '12px', bgcolor: '#f8f800', borderRadius: '2px', mr: 1 }}></Box>
            <Link href="#" underline="hover" sx={{ color: '#f8f800'}}>
              Read more about our data update
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
