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


import { tournaments, typeColors, generations } from "../utils/typeChart";
import type { TournamentType } from "../utils/typeChart";


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
    "fairy",
  ];

  // Fixed container size, trying to fix the issues with the stream chart UI
  const containerWidth = 1000;
  const containerHeight = 400;
  const streamMargin = { top: 10, right: 0, bottom: 60, left: 60 };
  const gapBetweenChartLegend = 8;

  // Legend width measured dynamically
  const [legendWidth, setLegendWidth] = useState(150); // initial guess

  // Fixing the issues with the legend and the white space on the right of it
  const streamWidth = containerWidth - streamMargin.left - gapBetweenChartLegend - legendWidth;
  const streamHeight = containerHeight - streamMargin.top - streamMargin.bottom;

  // Using this ref to hold legend group for measurement because we have to calculate the paper width
  const legendRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const currentTournament = tournaments[format];
    if (currentTournament && !currentTournament.years.includes(year)) {
      setYear(currentTournament.years[0]);
    }
  }, [format, year]);

  useEffect(() => { // Putting the entire thing in a useEffect
    d3.csv("/data/pokmeon_competitive.csv", d3.autoType).then((rawData) => {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // Prepare data grouped by generation and type
      let processedData: Record<string, Record<string, any[]>> = {};
      generations.forEach((gen) => {
        processedData[gen] = {};
        types.forEach((type) => {
          processedData[gen][type] = [];
        });
      });
      rawData.forEach((pokemon) => {
        processedData[pokemon.generation][pokemon.type1].push(pokemon);
        if (pokemon.type2 !== "No_type") {
          processedData[pokemon.generation][pokemon.type2].push(pokemon);
        }
      });

      const yearKey = format + "_" + usagePrefix + "_" + year;

      function updateStream() {
        svg.selectAll("*").remove();

        // Build data array for stacking
        const streamData = [];
        generations.forEach((gen) => {
          let data: Record<string, number | string> = {};
          types.forEach((type) => {
            let usage = 0;
            processedData[gen][type].forEach((pokeman) => {
              if (pokeman[yearKey] !== "NoUsage") {
                usage += pokeman[yearKey];
              }
            });
            data[type] = usage;
          });
          data["generation"] = gen;
          streamData.push(data);
        });

        const stack = d3
          .stack()
          .keys(types)
          .offset(d3.stackOffsetNone)
          .order(d3.stackOrderNone);

        const stackedData = stack(streamData);

        const x = d3
          .scalePoint()
          .domain(generations)
          .range([streamMargin.left, streamMargin.left + streamWidth])
          .padding(0);

        let maxUsage = 0;
        stackedData.forEach((layer) => {
          layer.forEach((point) => {
            maxUsage = Math.max(maxUsage, point[0], point[1]);
          });
        });

        const y = d3
          .scaleLinear()
          .domain([0, maxUsage * 1.1])
          .range([streamMargin.top + streamHeight, streamMargin.top]);

        const area = d3
          .area()
          .x((d) => x(d.data.generation)!)
          .y0((d) => y(d[0]))
          .y1((d) => y(d[1]))
          .curve(d3.curveMonotoneX);

        // Draw stacked areas
        const layers = svg
          .selectAll(".layer")
          .data(stackedData)
          .enter()
          .append("g")
          .attr("class", "layer")
          .attr("data-type", (d) => d.key);

        layers
          .append("path")
          .attr("class", "stream-area")
          .attr("d", area)
          .style("fill", (d) => typeColors[d.key])
          .style("opacity", 0.8)
          .style("stroke", "#fff")
          .style("stroke-width", 0.5);

        // Axes
        const xAxis = d3
          .axisBottom(x)
          .tickFormat((gen) => {
            const genMap: Record<string, string> = {
              "generation-i": "I",
              "generation-ii": "II",
              "generation-iii": "III",
              "generation-iv": "IV",
              "generation-v": "V",
              "generation-vi": "VI",
              "generation-vii": "VII",
              "generation-viii": "VIII",
              "generation-ix": "IX",
            };
            return genMap[gen] || gen;
          });

        svg
          .append("g")
          .attr("transform", `translate(0,${streamMargin.top + streamHeight})`)
          .call(xAxis);

        const yAxis = d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${d3.format(".1f")(d)}%`);

        svg
          .append("g")
          .attr("transform", `translate(${streamMargin.left},0)`)
          .call(yAxis);

        // Chart bounding box
        svg
          .append("rect")
          .attr("x", streamMargin.left)
          .attr("y", streamMargin.top)
          .attr("width", streamWidth)
          .attr("height", streamHeight)
          .style("fill", "none")
          .style("stroke", "#ccc")
          .style("stroke-dasharray", "5,5");

        // Axis labels
        svg
          .append("text")
          .attr("font-size", "18px")
          .attr("x", streamMargin.left + streamWidth / 2)
          .attr("y", streamMargin.top + streamHeight + 50)
          .attr("text-anchor", "middle")
          .text("Generation");

        svg
          .append("text")
          .attr("font-size", "18px")
          .attr("x", -streamMargin.top - streamHeight / 2)
          .attr("y", 14)
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("Usage");

        // Create legend group at correct position:
        const legendX = streamMargin.left + streamWidth + gapBetweenChartLegend;
        const legend = svg.append("g").attr("transform", `translate(${legendX},${streamMargin.top})`);
        legendRef.current = legend.node();

        types.forEach((c, i) => {
          const g = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
          g.append("rect").attr("width", 12).attr("height", 12).attr("fill", typeColors[c]);
          g.append("text").attr("x", 16).attr("y", 10).text(c);
        });
      }

      updateStream();

      // Measure legend width and update state
      setTimeout(() => {
        if (!svgRef.current) return;
        const legendNode = legendRef.current;
        if (legendNode) {
          const bbox = legendNode.getBBox();
          if (bbox.width && bbox.width !== legendWidth) {
            setLegendWidth(bbox.width);
          }
        }
      }, 0);
    }).catch(console.error);
  }, [year, format, legendWidth]);

return (
	<Box
		sx={{
		display: "flex",
		justifyContent: "center",
		width: "100%",
		px: 2,
		}}
	>
		<Box
		sx={{
			width: "100%",
			maxWidth: "1200px",
			mt: 6,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
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

		<Paper
			sx={{
			p: 0,
			m: 0,
			width: containerWidth,
			height: containerHeight,
			overflow: "visible",
			}}
		>
			<svg
			ref={svgRef}
			style={{
				width: containerWidth,
				height: containerHeight,
				display: "block",
			}}
			></svg>
		</Paper>

		{/* Dynamic Text Box Below Chart */}
		<Box sx={{ mt: 4, width: containerWidth, mx: "auto" }}>
			<Paper sx={{ p: 2, backgroundColor: "#2a2a2a", color: "white" }}>
			<Typography variant="subtitle1" gutterBottom>
				<strong>Format Insights ({format}, {year})</strong>
			</Typography>
			<Typography>
				{format === "Smogon" ? (
				<>
					{year === 2014 && "In 2014, Smogon’s meta was dominated by Mega Evolutions with Pokémon like Mega Kangaskhan and Mega Gengar shaping the gameplay."}
					{year === 2015 && "The 2015 metagame saw the rise of bulky stall teams and strong weather strategies using Pokémon like Tyranitar and Politoed."}
					{year === 2016 && "By 2016, the metagame balanced offensive and defensive cores, with threats such as Talonflame and Mega Manectric being prominent."}
					{year === 2017 && "2017 introduced new formats and bans that influenced team building, focusing on synergy and status conditions."}
					{year === 2018 && "In 2018, Trick Room teams and bulky Waters like Toxapex gained popularity as defensive pillars."}
					{year === 2019 && "2019’s meta featured a wider variety of threats, with Landorus-Therian and Mega Mawile being key players."}
					{year === 2020 && "Dynamax mechanics were banned in Smogon 2020, shifting focus back to traditional battling and new Pokémon like Dragapult emerging."}
					{year === 2021 && "In 2021, the meta adapted to new Galar Pokémon and strategies involving priority moves and Trick Room continued to be relevant."}
					{year === 2022 && "2022 saw the rise of terrain setters and bulky offense, with Pokémon such as Urshifu and Rillaboom taking center stage."}
					{year === 2023 && "By 2023, Smogon players refined strategies around Dynamax-ban metagames, emphasizing speed control and hazard stacking."}
					{year === 2024 && (
					<>	{/* Default view, using it to put explanation */}
						The 2024 metagame continues evolving with new additions and a balance between offensive pressure and defensive reliability.
						<br />
						<br />
						Note! Pokémon usage data calculates the chance that a given Pokémon <em>appears in a battle on either team</em>.
						It does not calculate what percent that Pokémon is out of the total Pokemon ever used in a year/format.
						This means that percentages are <em>not out of 100%</em>. This is why the usage streams stack to so far over 100%.
					</>
					)}
				</>
				) : (
				<>
					{year === 2022 && "The VGC 2022 format was defined by the restricted legendaries and Dynamax. Common team cores included Kyogre + Tornadus and Zacian + Incineroar."}
					{year === 2023 && "VGC 2023 shifted to a more balanced metagame with Paradox Pokémon and Terastallization. Flutter Mane and Iron Bundle dominated early usage trends."}
					{year === 2024 && "The current VGC format continues evolving with regulation sets. Terastallization has enabled a wide range of creative strategies and counterplay."}
				</>
				)}
			</Typography>
			</Paper>
		</Box>
		</Box>
	</Box>
	);
}
=======
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

