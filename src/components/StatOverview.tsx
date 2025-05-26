import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from "@mui/material";

const statDescriptions: Record<string, string> = {
  hp: "HP (<strong>Hit Points</strong>) determines how much damage a Pokémon can take before fainting. ",
  attack: "Attack affects the power of <strong>physical moves</strong>.",
  defense: "Defense reduces damage from <strong>physical moves</strong>.  ",
  sp_atk: "Special Attack powers up <strong>special moves</strong>",
  sp_def: "Special Defense reduces damage from <strong>special moves</strong>.",
  speed:
    "Speed determines which Pokémon <strong>moves first</strong> each turn.",
};

const statTakeaways: Record<string, string> = {
  hp: "Bulky Pokémon with high HP are useful for stalling and tanking hits. Outliers like Blissey are specialize in their defensive role ",
  attack:
    "High Attack stats are key for physical sweepers and wallbreakers. Pokémon such as Mega Garchomp make for very good sweepers with an attack stat of 170",
  defense:
    "Physically defensive Pokémon serve as walls against strong physical attackers. Great for pivoting and support roles. Mega Steelix exiles at this with its staggering 230 defense making it a great waller against physical teams",
  sp_atk:
    "Special Attack enables powerful ranged attacks. Useful for Pokémon like Alakazam which can counter pokemon with high defense but low special defenses",
  sp_def:
    "High Special Defense allows Pokémon to counter special sweepers. Examples include Shuckle with a 230 Sp. Def.",
  speed:
    "Speed controls turn order and tempo. Fast Pokémon like Dragapult or Weavile can take their turn first against slower opponents",
};

const statKeys = Object.keys(statDescriptions);

interface StatRecord {
  name: string;
  value: number;
}

export default function StatOverview() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedStat, setSelectedStat] = useState("hp");

  useEffect(() => {
    const loadData = async () => {
      const data = await d3.csv("/data/pokmeon_competitive.csv");
      const statData: StatRecord[] = data
        .map((d) => ({
          name: d["name"] || "Unknown",
          value: +d[selectedStat]!,
        }))
        .filter((d) => !isNaN(d.value));

      const svg = d3.select(svgRef.current);
      const width = 800;
      const height = 400;
      const margin = { top: 20, right: 20, bottom: 40, left: 60 };

      svg.attr("width", width).attr("height", height);
      svg.selectAll("*").remove();

      const x = d3
        .scaleLinear()
        .domain(d3.extent(statData, (d) => d.value) as [number, number])
        .nice()
        .range([margin.left, width - margin.right]);

      const bins = d3
        .bin<StatRecord, number>()
        .value((d) => d.value)
        .domain(x.domain() as [number, number])
        .thresholds(20)(statData);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(bins, (d) => d.length) || 1])
        .range([height - margin.bottom, margin.top]);

      const tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "#222")
        .style("color", "white")
        .style("padding", "6px 8px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("font-size", "12px")
        .style("display", "none");

      const barGroup = svg.append("g");

      const bars = barGroup.selectAll("rect").data(bins, (d: any) => d.x0);

      bars
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.x0!))
        .attr("y", y(0))
        .attr("width", (d) => Math.max(x(d.x1!) - x(d.x0!) - 1, 0))
        .attr("height", 0)
        .attr("fill", "#66bb6a")
        .merge(bars as any)
        .on("mouseover", (_, d) => {
          const maxPokemon = d.reduce(
            (prev, curr) => (curr.value > prev.value ? curr : prev),
            d[0]
          );
          const spriteNameMap: Record<string, string> = {
            "mewtwo-mega-x": "mewtwo-megax",
            "mewtwo-mega-y": "mewtwo-megay",
            "charizard-mega-x": "charizard-megax",
            "charizard-mega-y": "charizard-megay",
            "necrozma-dawn-wings": "necrozma-dawnwings",
            "necrozma-dusk-mane": "necrozma-duskmane",
            "keldeo-ordinary": "keldeo",
            "wormadam-plant": "wormadam",
            "wormadam-sandy": "wormadam-sandy",
            "wormadam-trash": "wormadam-trash",
          };
          const rawName = maxPokemon.name.toLowerCase();
          const showdownName =
            spriteNameMap[rawName] || rawName.replace(/[^a-z0-9-]/g, "");

          tooltip
            .style("display", "block")
            .html(
              `<strong>Pokemon:</strong><br/><img src='https://play.pokemonshowdown.com/sprites/gen5/${showdownName}.png' width='40' height='40' /><br/>${maxPokemon.name} (${maxPokemon.value})`
            );
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", () => tooltip.style("display", "none"))
        .transition()
        .duration(750)
        .attr("y", (d) => y(d.length))
        .attr("height", (d) => y(0) - y(d.length));

      bars
        .exit()
        .transition()
        .duration(500)
        .attr("y", y(0))
        .attr("height", 0)
        .remove();

      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Stat Value");

      svg
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .append("text")
        .attr("x", -height / 2)
        .attr("y", -35)
        .attr("transform", "rotate(-90)")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Number of Pokémon");
    };

    loadData();
  }, [selectedStat]);

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Stat Distribution:{" "}
        {selectedStat === "sp_atk"
          ? "Sp. Atk"
          : selectedStat === "sp_def"
          ? "Sp. Def"
          : selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1)}
      </Typography>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: "#1e1e1e", color: "white" }}>
        <Typography
          dangerouslySetInnerHTML={{ __html: statDescriptions[selectedStat] }}
        />
      </Paper>

      <ToggleButtonGroup
        value={selectedStat}
        exclusive
        onChange={(_, value) => value && setSelectedStat(value)}
        sx={{ mb: 2, flexWrap: "wrap" }}
      >
        {statKeys.map((stat) => (
          <ToggleButton
            key={stat}
            value={stat}
            sx={{
              color: "white",
              borderColor: "white",
              "&.Mui-selected": { backgroundColor: "#66bb6a", color: "black" },
            }}
          >
            {stat === "sp_atk"
              ? "Sp. Atk"
              : stat === "sp_def"
              ? "Sp. Def"
              : stat.charAt(0).toUpperCase() + stat.slice(1)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <svg ref={svgRef} style={{ display: "block", margin: "0 auto" }}></svg>

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        <Paper sx={{ p: 2, backgroundColor: "#2a2a2a", color: "white" }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Key Takeaway</strong>
          </Typography>
          <Typography>{statTakeaways[selectedStat]}</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
