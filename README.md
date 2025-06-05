# ECS 163 Final Project
## Overview

This project is a data storytelling website built with React and D3.js that aims to visualize trends in competitive Pokémon battling across Smogon (Singles) and VGC (Doubles) formats from 2022 to 2024. We use the **Martini Glass** structure to guide users through the basic concepts and introduce the metagame to the user. By the end of the exploration of the competitive metas, users will have the opportunity to use an exploratory approach and create their competitive team using the dedicated team builder.

## Objectives
- Provide interactive visualizations to reveal competitive trends, statistical outliers, and type synergies
- Help users discover viable team compositions via a Team Builder and Weaknesses Calculator along with a radar comparison chart
- Support Users at ** all skill levels ** with guided explanations and dynamic comparisons.

## Visualizations
| Component | Description |
|----------|-------------|
| **Type Distribution Bar Chart** | Explore the primary and secondary type frequency of Pokémon. |
| **Type Effectiveness Heatmap** | View how each attacking type interacts with all type combinations for a chosen primary type. |
| **Stat Overview Histogram** | Select from HP, Attack, Speed, etc., and view Pokémon stat distributions. |
| **Streamgraph** | Examine changes in usage of Pokémon types across generations and tournament formats. |
| **Team Builder Assistant** | Add up to 6 Pokémon and see your team’s weaknesses and resistances. |
| **Radar Chart Comparison** | Compare two Pokémon’s base stats side-by-side with dynamic scaling. |
---


## Installation and Setup
1. **Clone the Repository**
    ```bash
    git clone https://github.com/YOUR-TEAM-HERE/pokemon-competitive-visualization.git
    cd pokemon-competitive-visualization
    ```
2. **Install Dependencies**:
    In your terminal, run this to install nvm
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    ```
    or this if your running windows
    ```bash
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    ```
    Now lets download latest release of node:
     ```bash
    nvm install node # "node" is an alias for the latest version
     ```
    To run the code run the following:
    ```bash
    npm install
    ```
    Start the development server with:
    ```bash
    npm run dev
    ```
    

