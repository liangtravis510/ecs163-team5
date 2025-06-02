import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box, Typography } from "@mui/material";

// Type colors
const typeColors: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  No_type: "white",
};

interface PokemonType {
  primary: string;
  secondary: string | null;
}

export default function TypeDistribution() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [typeData, setTypeData] = useState<Record<string, PokemonType[]>>({});

  useEffect(() => {
    // Load Pokemon data
    d3.csv("/data/pokmeon_competitive.csv").then((data) => {
      const typeMap: Record<string, PokemonType[]> = {};
      Object.keys(typeColors).forEach((type) => {
        if (type !== "No_type") {
          typeMap[type] = [];
        }
      });

      // Get each Pokemon's types
      data.forEach((d) => {
        const primary = d.type1?.toLowerCase() || "unknown";
        const secondary =
          d.type2?.toLowerCase() === "" ? null : d.type2?.toLowerCase();
        if (typeMap[primary]) {
          typeMap[primary].push({ primary, secondary });
        }
      });

      setTypeData(typeMap);
    });
  }, []);

  useEffect(() => {
    // Clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const types = Object.keys(typeData).filter((t) => t !== "No_type");
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = Math.max(800, types.length * 50) - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const g = svg.select("g");

    // Create scales
    const x = d3.scaleBand().domain(types).range([0, width]).padding(0.2);

    const maxCount = Math.max(...types.map((type) => typeData[type].length));
    const y = d3.scaleLinear().domain([0, maxCount]).range([height, 0]);

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "white");

    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "white");

    // Add X axis label
    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-weight", "bold")
      .style("font-size", "14px")
      .text("Primary Type");

    // Add Y axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-weight", "bold")
      .style("font-size", "14px")
      .text("Number of Pokémon");

    // Create stacked data
    types.forEach((type) => {
      const primaryCount = typeData[type].length;
      const secondaryTypes: Record<string, number> = {};

      // Count secondary types
      typeData[type].forEach((pokemon) => {
        const secondary = pokemon.secondary || "No_type";
        if (secondaryTypes[secondary]) {
          secondaryTypes[secondary] += 1;
        } else {
          secondaryTypes[secondary] = 1;
        }
      });

      // Sort secondary types by count
      const sortedSecondaries = Object.entries(secondaryTypes).sort(
        (a, b) => b[1] - a[1]
      );

      // Draw the main bar
      g.append("rect")
        .attr("x", x(type)!)
        .attr("y", y(primaryCount))
        .attr("width", x.bandwidth())
        .attr("height", height - y(primaryCount))
        .attr("fill", typeColors[type])
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .append("title")
        .text(`${type}: ${primaryCount} Pokémon`);

      // Draw stacks for secondary types
      let currentY = primaryCount;
      sortedSecondaries.forEach(([secondaryType, count]) => {
        const segmentY = currentY - count;

        g.append("rect")
          .attr("x", x(type)!)
          .attr("y", y(currentY))
          .attr("width", x.bandwidth())
          .attr("height", y(segmentY) - y(currentY))
          .attr("fill", typeColors[secondaryType])
          .attr("stroke", "#333")
          .attr("stroke-width", 1)
          .attr("opacity", 0.7)
          .append("title")
          .text(
            `${
              secondaryType === "No_type" ? "No Secondary Type" : secondaryType
            }: ${count} Pokémon`
          );

        currentY = segmentY;
      });

      // Add count label on top of each bar
      g.append("text")
        .attr("x", x(type)! + x.bandwidth() / 2)
        .attr("y", y(primaryCount) - 5)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "12px")
        .text(primaryCount);
    });

    // Add legend in top right corner
    const legendData = Object.entries(typeColors).filter(
      ([type]) => type !== "No_type"
    );
    const legendItemsPerRow = 2;
    const legendItemWidth = 80;
    const legendItemHeight = 20;
    const legendX = width - legendItemWidth * legendItemsPerRow + 30;
    const legendY = 0;
    const legendTitleHeight = 25;

    // Add legend
    g.append("rect")
      .attr("x", legendX - 5)
      .attr("y", legendY - 5)
      .attr("width", legendItemWidth * legendItemsPerRow + 10)
      .attr(
        "height",
        Math.ceil(legendData.length / legendItemsPerRow) * legendItemHeight +
          legendTitleHeight +
          10
      )
      .attr("fill", "#1a1f2c")
      .attr("opacity", 0.8)
      .attr("rx", 5);

    // Add legend title
    g.append("text")
      .attr("x", legendX + (legendItemWidth * legendItemsPerRow) / 2 - 30)
      .attr("y", legendY - 15)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Secondary Type");

    for (let i = 0; i < legendData.length; i++) {
      const [type, color] = legendData[i];
      const row = Math.floor(i / legendItemsPerRow);
      const col = i % legendItemsPerRow;

      const legendGroup = g
        .append("g")
        .attr(
          "transform",
          `translate(${legendX + col * legendItemWidth}, ${
            legendY + row * legendItemHeight
          })`
        );

      legendGroup
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", color);

      legendGroup
        .append("text")
        .attr("x", 16)
        .attr("y", 10)
        .style("fill", "white")
        .style("font-size", "9px")
        .text(type);
    }
  }, [typeData]);

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
        Type Distribution Bar Chart
      </Typography>

      <div style={{ overflowX: "auto", width: "100%" }}>
        <svg ref={svgRef} style={{ display: "block", margin: "0 auto" }}></svg>
      </div>
    </Box>
  );
}
