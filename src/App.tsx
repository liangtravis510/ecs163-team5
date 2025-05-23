import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
} from "@mui/material";
import TeamCarousel from "./components/TeamCarousel";
import TypeChartHeatmap from "./components/TypeChartHeatmap";

function App() {
  return (
    <Box sx={{ bgcolor: "#2f353f", minHeight: "100vh", color: "white" }}>
      {/* Header */}
      <AppBar
        position="static"
        sx={{ bgcolor: "#2f353f", borderBottom: "4px solid #2f353f" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">
            Competitive Pokémon Visualization
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Pokémon battling in Smogon/VCG Worlds
        </Typography>
        <Typography variant="h5" gutterBottom>
          A Data Visualization
        </Typography>
        <Typography variant="body2">Last updated: May 14, 2025</Typography>
      </Container>

      {/* Intro to Building a Team*/}
      <Container sx={{ mt: 8, maxWidth: "md" }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#1a1f2c",
            color: "#c0c0c0",
            p: 3,
            border: "px solid #333",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: "#ffffff" }}>
            Build A Team
          </Typography>
          <Typography variant="body1">
            In competitive pokemon, a player is in charge of selecting 6
            different Pokemon with different types, abilities and roles.
          </Typography>
          <TeamCarousel />
        </Paper>
      </Container>

      {/* Intro to Building a Team*/}
      <Container sx={{ mt: 8, maxWidth: "md" }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#1a1f2c",
            color: "#c0c0c0",
            p: 3,
            border: "px solid #333",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: "#ffffff" }}>
            Typing Advantages/Disadvantages
          </Typography>
          <Typography variant="body1">
            For each move in pokemon has a type and could be effective, super
            effective, not effective, or has no effect at all
          </Typography>
          <TypeChartHeatmap />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
              mt: 2,
            }}
          >
            {[
              { label: "Super Effective (2×)", color: "#f44" },
              { label: "Double Weak (4×)", color: "#ff2222" },
              { label: "Effective (1×)", color: "#fff", border: "#ccc" },
              { label: "Not Very Effective (½×)", color: "#4a90e2" },
              { label: "No Effect (0×)", color: "#222" },
            ].map(({ label, color, border }) => (
              <Box
                key={label}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: color,
                    border: border ? `1px solid ${border}` : "1px solid #444",
                    borderRadius: 2,
                  }}
                />
                <Typography variant="body2" sx={{ color: "white" }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
