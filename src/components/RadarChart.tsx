import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const spriteNameMap: Record<string, string> = {
  // From original spriteNameMap
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

  // From showdownNameMap
  "calyrex-shadow-rider": "calyrex-shadow",
  "calyrex-ice-rider": "calyrex-ice",
  "zacian-crowned": "zacian-crowned",
  "zamazenta-crowned": "zamazenta-crowned",
  "urshifu-rapid-strike": "urshifu-rapid-strike",
  "flutter mane": "fluttermane",
  "chien-pao": "chienpao",
  "samurott-hisui": "samurott-hisui",
  "landorus-therian": "landorus-therian",
  "landorus-incarnate": "landorus",
  "flutter-mane": "fluttermane",
  "tornadus-incarnate": "tornadus",
  "thundurus-incarnate": "thundurus",
  "raging-bolt": "ragingbolt",
  "urshifu-rapid": "urshifu-rapidstrike",
  "urshifu-single": "urshifu",
  "indeedee-female": "indeedee-f",
  "chi-yu": "chiyu",
  "iron-hands": "ironhands",
  "roaring-moon": "roaringmoon",
  "iron-bundle": "ironbundle",
  "ting-lu": "tinglu",
  "tatsugiri-curly": "tatsugiri",
};
const formatName = (name: string): string => {
  const normalized =
    spriteNameMap[name] || name.replace(/[^a-z0-9-]/g, "");
  const spriteURL = `https://play.pokemonshowdown.com/sprites/gen5/${normalized}.png`;
  return spriteURL;
};

type TournamentType = "Smogon" | "Worlds";
const tournaments = {
  "Worlds" : {
    "years": [2022, 2023, 2024]
  },
  "Smogon" : { 
    "years": [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]
  }
};
export default function RadarChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [year, setYear] = useState<number>(2024);
  const [format, setFormat] = useState<TournamentType>("Smogon");

  useEffect(() => {
	const currentTournament = tournaments[format];
	if (currentTournament) {
    	if (!currentTournament.years.includes(year)) {
    		setYear(currentTournament.years[0]);
		}
	}
    d3.csv("/data/top20_usage_per_year.csv", d3.autoType).then(
      (data: any[]) => {
        const filtered = data.filter(
          (d) => d.year === year && d.format === format
        );
    const svg = d3.select(svgRef.current);
	svg.selectAll("*").remove();
    const container = svgRef.current?.parentElement;
    const width = container ? container.clientWidth : 800;
    let radarMargin = { top: 10, right: 30, bottom: 60, left: 60 },
		radarWidth = width - 100,
		radarHeight = 400;
	d3.csv("/data/pokmeon_competitive.csv", d3.autoType).then(rawData =>{
		let processedData = rawData.filter(d => 
			filtered.some(item => item.name === d.name)
		);
     	console.log("processedData", processedData)
		const attributes = ["hp", "attack", "defense", "sp_atk", "sp_def", "speed"];
		// Radar Chart for select pokeman
		const g1 = svg.append("g")
			.attr("transform", `translate(${radarMargin.left}, ${radarMargin.top})`);
		const imageGroup = svg.append("g")
			.attr("transform", `translate(${radarMargin.left}, ${radarMargin.top + 20})`);

		const radarGroup = svg.append("g")
			.attr("transform", "translate(250,250)");
	
		const angleSlice = (2 * Math.PI) / attributes.length;
		const levels = 4;
		const maxValue = d3.max(processedData, d => Math.max(...attributes.map(attr => d[attr])));
	
		
		for (let level = 1; level <= levels; level++) {
			const r = (level / levels) * 100;
			radarGroup.append("polygon")
				.attr("points", attributes.map((_, i) => {
					const angle = i * angleSlice + 0.5 * angleSlice;
					return [
						r * Math.cos(angle),
						r * Math.sin(angle)
					].join(",");
				}).join(" "))
				.attr("fill", "none")
				.attr("stroke", "#ccc");
		}
	
		// add attibutes description
		attributes.forEach((attr, i) => {
			const angle = i * angleSlice + 0.5 * angleSlice;
			radarGroup.append("text")
				.attr("x", 120 * Math.cos(angle))
				.attr("y", 120 * Math.sin(angle))
				.attr("text-anchor", "middle")
				.attr("font-size", "12px")
				.text(attr);
		});
	
		
		const radarLine = d3.lineRadial()
			.radius(d => (d.value / maxValue) * 100)
			.angle((d, i) => i * angleSlice + 2 * angleSlice)
			.curve(d3.curveLinearClosed);
		
		const radarPath1 = radarGroup.append("path")
			.attr("fill", "rgba(0, 128, 255, 0.3)")
			.attr("stroke", "blue");
	
		const radarPath2 = radarGroup.append("path")
		.attr("fill", "rgba(255, 255, 0, 0.3)")
		.attr("stroke", "yellow");
		function updateRadar() {
			g1.select(".title").remove();
			const sortedData = processedData
				.sort((a, b) => d3.ascending(a["total_stats"], b["total_stats"]));
			if (sortedData.length == 0) return;
			const poke1 = sortedData[0];
			const poke2 = sortedData[sortedData.length - 1];
			const usage1 = filtered.find(item =>
				poke1.name == item.name 
			).usage.toFixed(2);
			const usage2 = filtered.find(item =>
				poke2.name == item.name 
			).usage.toFixed(2);
			const data1 = attributes.map(attr => ({ axis: attr, value: poke1[attr] }));
			radarPath1
				.datum(data1)
				.attr("d", radarLine);
	
			const data2 = attributes.map(attr => ({ axis: attr, value: poke2[attr] }));
			radarPath2
				.datum(data2)
				.attr("d", radarLine);
			
			const text1 = poke1["name"] + "(" + usage1 + "%)";
			const text2 = poke1["name"] + "(" + usage2 + "%)";
			g1.append("text")
			.attr("x", 100)
			.attr("y", 10)
			.attr("text-anchor", "middle")
			.attr("font-size", "18px")
			.attr("class", "title")
			.attr("fill", "blue")
			.text(text1);

			g1.append("text")
			.attr("x", 100 + text1.length * 8)
			.attr("y", 10)
			.attr("text-anchor", "middle")
			.attr("font-size", "18px")
			.attr("class", "title")
			.text("VS ");

			g1.append("text")
			.attr("x", 100 + text1.length * 16 + 10)
			.attr("y", 10)
			.attr("text-anchor", "middle")
			.attr("font-size", "18px")
			.attr("class", "title")
			.attr("fill", "yellow")
			.text(text2);

			imageGroup.append("image")
            .attr("xlink:href", formatName(poke1["name"]))
			.attr("x", 20)
			.attr("y", 0)

			imageGroup.append("image")
            .attr("xlink:href", formatName(poke2["name"]))
			.attr("x", 40 + text1.length * 16)
			.attr("y", 0)
		}
		updateRadar();
		}).catch(console.error);


       
      }
    );
  }, [year, format]);

  return (
    <Box
      sx={{
        mt: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom sx={{ mb: 2 }}>
        Competitive Pokémon Attribute ({format}, {year})
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>

      <ToggleButtonGroup
          value={format}
          exclusive
          onChange={(_, val) => val && setFormat(val) && setYear(tournaments[val]["years"][0])}
          sx={{
            backgroundColor: "#2f353f",
            borderRadius: 1,
            "& .MuiToggleButton-root": {
              color: "white",
              borderColor: "#999",
              "&.Mui-selected": {
                backgroundColor: "white",
                color: "#2f353f",
                fontWeight: "bold",
              },
            },
          }}
        >
          <ToggleButton value="Smogon">Smogon</ToggleButton>
          <ToggleButton value="Worlds">VGC (Worlds)</ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel sx={{ color: "white" }}>Year</InputLabel>
          <Select
            value={year}
            onChange={(e) => setYear(+e.target.value)}
            label="Year"
            sx={{
              color: "white",
              backgroundColor: "#2f353f",
              borderColor: "#ccc",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#aaa" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#fff",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#fff",
              },
              ".MuiSvgIcon-root": { color: "white" },
            }}
          >
            {tournaments[format]["years"].map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ p: 2 }}>
        <svg ref={svgRef} style={{ width: "100%", height: "600px" }}></svg>
      </Paper>
    </Box>
  );
}
