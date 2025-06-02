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

import {formatName,  tournaments, typeColors, generations} from "../utils/typeChart";
import type {TournamentType} from "../utils/typeChart";

export default function StreamChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [year, setYear] = useState<number>(2024);
  const [format, setFormat] = useState<TournamentType>("Smogon");
  const usagePrefix = "VGC_Usage";

  const types = [
	"normal",
	"fire",
	"water",
	"electric",
	"grass",
	"ice",
	"fighting",
	"poison",
	"ground",
	"flying",
	"psychic",
	"bug",
	"rock",
	"ghost",
	"dragon",
	"dark",
	"steel",
	"fairy"
  ];

  useEffect(() => {
	const currentTournament = tournaments[format];
	if (currentTournament) {
    	if (!currentTournament.years.includes(year)) {
    		setYear(currentTournament.years[0]);
		}
	}
    
	d3.csv("/data/pokmeon_competitive.csv", d3.autoType).then(rawData =>{
		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();
		const container = svgRef.current?.parentElement;
		const width = container ? container.clientWidth : 600;
		const height = container ? container.clientHeight : 600;
		let streamMargin = { top: 10, right: 30, bottom: 60, left: 60 },
			streamWidth = width - streamMargin.left - streamMargin.right,
			streamHeight = height - streamMargin.top - streamMargin.bottom;
		let processedData: Record<string, Record<string, any[]>> = {}; 
		generations.forEach(gen => {
			processedData[gen] = {};
			types.forEach(type => {
				processedData[gen][type] = [];
			});
			
		});
		rawData.forEach(pokemon => {
			processedData[pokemon.generation][pokemon.type1].push(pokemon);
			if (pokemon.type2 != "No_type") {
				processedData[pokemon.generation][pokemon.type2].push(pokemon);
			}
		});

    	console.log("processedData", processedData)
		const yearKey = format + "_" + usagePrefix + "_" + year;
		function updateStream() {
			svg.selectAll("*").remove();
			const streamData = [];
			generations.forEach(gen => {
				let data = {};
				types.forEach(type => {
					let usage = 0;
					processedData[gen][type].forEach(pokeman => {
						if (pokeman[yearKey] != "NoUsage") {
							usage += pokeman[yearKey];
						}
					});
					data[type] = usage;
				});
				data["generation"] = gen;
				streamData.push(data);
			});
			console.log(streamData);

			const stack = d3.stack()
			.keys(types)
			.offset(d3.stackOffsetNone)
			.order(d3.stackOrderNone);

			const stackedData = stack(streamData);

			const x = d3.scalePoint()
                .domain(generations)
                .range([streamMargin.left, streamWidth * 4 / 5 + streamMargin.left])
                .padding(0.5);
			
			

			const layers = svg.selectAll(".layer")
			.data(stackedData)
			.enter().append("g")
			.attr("class", "layer")
			.attr("data-type", d => d.key);

			let maxUsage = 0;

			stackedData.forEach(layer => {
				layer.forEach(point => {
					maxUsage = Math.max(maxUsage, point[0], point[1]);
				});
			});
		
			console.log(maxUsage);
			const y = d3.scaleLinear()
				.domain([0, maxUsage * 1.1])
				.range([streamHeight * 4 / 5, 0]);

			const area = d3.area()
				.x(d => x(d.data.generation))
				.y0(d => y(d[0]))
				.y1(d => y(d[1]))
				.curve(d3.curveMonotoneX);

			layers.append("path")
				.attr("class", "stream-area")
				.attr("d", area)
				.style("fill", d => typeColors[d.key])
				.style("opacity", 0.8)
				.style("stroke", "#fff")
				.style("stroke-width", 0.5);
			
			const xAxis = d3.axisBottom(x)
			.tickFormat(gen => {
				const genMap: Record<string, string> = {
					"generation-i": "I",
					"generation-ii": "II",
					"generation-iii": "III",
					"generation-iv": "IV",
					"generation-v": "V",
					"generation-vi": "VI",
					"generation-vii": "VII",
					"generation-viii": "VIII",
					"generation-ix": "IX"
				};
				return genMap[gen] || gen;
			});
			  
			svg.append("g")
			.attr("transform", `translate(${0},${streamHeight * 4 / 5})`)
			.call(xAxis);

			const yAxis = d3.axisLeft(y)
			.ticks(5)
			.tickFormat(d => `${d3.format(".1f")(d)}%`);
			
			svg.append("g")
				.call(yAxis)
				.attr("transform", `translate(${streamMargin.left},0)`);

			svg.append("rect")
			.attr("x", streamMargin.left)
			.attr("y", 0)
			.attr("width", streamWidth * 4 / 5)
			.attr("height", streamHeight * 4 / 5)
			.style("fill", "none")
			.style("stroke", "#ccc")
			.style("stroke-dasharray", "5,5");

			svg.append("text")
			.attr("font-size", "18px")
			.attr("x", streamWidth * 2 / 5)
			.attr("y", streamHeight * 4 / 5 + 50)
			.text("Generation");

			svg.append("text")
			.attr("font-size", "18px")
			.attr("x", -streamHeight * 2 / 5)
			.attr("y", 14)
			.attr("text-anchor", "middle") 
			.attr("transform", "rotate(-90)")
			.text("Usage");

			// add legend
			const legend = svg.append("g")
    		.attr("transform", `translate(${streamWidth * 4 / 5 + 80},${streamMargin.top})`);

			types.forEach((c, i) => {
				const g = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
			
				g.append("rect")
				  .attr("width", 12)
				  .attr("height", 12)
				  .attr("fill", typeColors[c]);
				
				g.append("text")
				  .attr("x", 16)
				  .attr("y", 10)
				  .text(c);
			});

			svg.append("foreignObject")
			.attr("x", streamWidth * 1 / 10)
			.attr("y", streamHeight * 4 / 5 + 60)
			.attr("width", streamWidth * 4 / 5)
			.attr("height", 100)
			.append("xhtml:textarea")
			.attr("rows", 4)
			.attr("cols", 30)
			.style("width", "100%")
			.style("height", "100%")
			.text("input text");

		}

		updateStream();
		}).catch(console.error);  
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
        Usage of Pokémon Generation ({format}, {year})
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
