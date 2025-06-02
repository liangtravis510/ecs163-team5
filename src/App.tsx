import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
} from "@mui/material";
import TeamCarousel from "./components/TeamCarousel";
import TypeDistribution from "./components/TypeDistribution";
import TypeChartHeatmap from "./components/TypeChartHeatmap";
import StatOverview from "./components/StatOverview";
///import RadarChart from "./components/RadarChart";
import StreamChart from "./components/StreamChart";
import TeamBuilderBarChart from "./components/TeamBuilderAssistant";

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

      {/* Type Distribution Bar Chart */}
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
            Pokémon Types
          </Typography>
          <Typography variant="body1">
            Pokémon have primary and secondary types. This visualization shows
            the distribution of Pokémon by their primary types, with stacks
            representing their secondary types.
          </Typography>
          <TypeDistribution />
        </Paper>
      </Container>

      {/* Typing heatmap*/}
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
            With every combination of pokemon types comes strengths and
            weaknesses. Some grant immunity to certain type moves, others
            provide significantly larger advantages/disadvantages but it is up
            to the trainer to find the best way to navigate certain
            weaknesses/strengths. Below shows examples of type combinations and
            their weakness/advantages based on certain typing of their attacks.
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
              { label: "No Effect (0×)", color: "#222" },
              { label: "Not Very Effective (½×)", color: "#4a90e2" },
              { label: "Effective (1×)", color: "#fff", border: "#ccc" },
              { label: "Super Effective (2×)", color: "pink" },
              { label: "Double Weak (4×)", color: "#ff2222" },
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

      {/* attributes chart*/}
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
            How do stats affect Pokemon Battles
          </Typography>

          <StatOverview />
        </Paper>
      </Container>

      {/* Usage Stream Chart*/}
      <Container maxWidth={false} sx={{ mt: 8, px: 4 }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#1a1f2c",
            color: "#c0c0c0",
            p: 4, // more padding for breathing room
            borderRadius: "8px",
          }}
        >
          <StreamChart />
        </Paper>
      </Container>

      {/* Team Builder and Type Spread*/}
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
            Team Builder Asssistant: Net Weaknesses and Resistances
          </Typography>
          <Typography variant="body1">
            Use the search box to add your favorite Pokémon to your team! The
            weakness and resistance calculator will show you what types you're
            weak and strong against!
          </Typography>

          {/* Your TeamBuilderBarChart component goes here */}
          <TeamBuilderBarChart />
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
