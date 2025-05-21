import { AppBar, Toolbar, Typography, Container, Box, Paper} from '@mui/material';
import TeamCarousel from './components/TeamCarousel';

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
        <Typography variant="h4" gutterBottom>
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
            border: 'px solid #333', 
            borderRadius: '8px'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
            Build A Team
          </Typography>
          <Typography variant="body1">
            In competitve pokemon, a player is in charge of selecting 6 different Pokemon with differnt types, abilities and roles.
          </Typography>
          <TeamCarousel />

        </Paper>
      </Container>
    </Box>
  );
}

export default App;
