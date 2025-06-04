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
import StreamChart from "./components/StreamChart";
import TeamBuilderBarChart from "./components/TeamBuilderAssistant";
import RadarChart from "./components/RadarChart"; // Testing

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
          Pokémon Battling in Smogon/VGC Worlds
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
            In competitive Pokémon, a player is in charge of selecting 6
            different Pokémon with different types, abilities, and roles.
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
            the distribution of Pokémon by their primary type. Click the bars to
            view the distribution of secondary types, as well as Pokémon with
            matching primary and secondary types.
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
            Typing Advantages and Disadvantages
          </Typography>
          <Typography variant="body1">
            With every combination of Pokémon types comes strengths and
            weaknesses. Some grant immunity to certain type moves, while others
            provide significantly larger advantages and disadvantages. It is up
            to the trainer to find the best way to navigate certain weaknesses
            and strengths. Below shows examples of type combinations and their
            weakness and advantages based on certain typing of their attacks.
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
              { label: "Double Effective (4×)", color: "#ff2222" },
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
            How Do Stats Affect Pokemon Battles?
          </Typography>
          <Typography variant="body1">
            Each Pokémon has six stats: HP, Attack, Defense, Special Attack,
            Special Defense, and Speed. These stats determine how well a Pokémon
            performs in battles.
          </Typography>
          <StatOverview />
        </Paper>
      </Container>

      {/* Usage Stream Chart*/}
      <Container
        maxWidth={false}
        sx={{ mt: 8, px: 4, maxWidth: "1200px", mx: "auto" }}
      >
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#1a1f2c",
            color: "#c0c0c0",
            p: 4, // more padding for breathing room
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: "#ffffff" }}>
            How Has Usage Changed Over Time?
          </Typography>
          <Typography variant="body1">
            Competitive Pokémon usage trends evolve with each generation's
            differences. The following streamgraph demonstrates trends of using
            different Pokémon types throughout the generations, for a given
            format and year.
          </Typography>
          <StreamChart />
        </Paper>
      </Container>

      {/* Team Builder and Type Spread*/}
      <Container maxWidth={false} sx={{ mt: 8, px: 4 }}>
        {" "}
        {/* <Container maxWidth={false} sx={{ mt: 8, px: 4 }}>      ||    <Container sx={{ mt: 8, maxWidth: "md" }}>*/}
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
            Team Builder Assistant: Net Weaknesses and Resistances and Stat Comparison Tool!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Use the search box to add your favorite Pokémon to your team! The
            weakness and resistance calculator will show you what types you're
            weak and strong against! A balanced team doesn't want any glaring 
            weaknesses to any types. Start off by selecting your favorites, to
            see how they match up to the other types! If you want to remove any
            Pokémon from your team, just click the box!
            <br />
            <br />
            As you get comfortable, you can use the other visualizations to start 
            building a competitive team. If you don't know where to begin, try using
            some of the Championship teams included at the top of this page, to see
            how they fare! Then explore at your own pace. You can use the Pokémon
            Stat Comparison Tool to help you decide between Pokémon!
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              gap: 4,
              mt: 2,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <TeamBuilderBarChart />
            </Box>
            <Box sx={{ flex: 1, minWidth: 300, ml: 50, mt: 5 }}>
              <RadarChart />
            </Box>
          </Box>
          <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
            <Paper sx={{ p: 2, backgroundColor: "#2a2a2a", color: "white" }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Note</strong>
              </Typography>
              <Typography>
                The radar chart compares two Pokémon's stats! The max axes values
                are capped out at 160 by default, as this is a common value
                among famous legendary Pokémon (such as Mewtwo, with a Special
                Attack of 154, or Lugia, with a Special Defense of 154). But, 
                if either Pokémon has a stat value of over 160, than the max value
                of all axes are dynamically recalculated to that new highest stat
                value! This is because some Pokémon have massive stat outliers;
                Blissey has an HP value of 255! Compare it to a strong Pokémon like
                Mewtwo to see this dynamic recalculation, preserving scale of differences.
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
