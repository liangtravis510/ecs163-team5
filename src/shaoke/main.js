const width = window.innerWidth;
const height = window.innerHeight;
let radarMargin = { top: 10, right: 30, bottom: 60, left: 60 },
    radarWidth = width - 100,
    radarHeight = 400;
d3.csv("/data/pokmeon_competitive.csv").then(rawData =>{
    console.log("rawData", rawData);

    rawData.forEach(function(d){
        d.HP = Number(d.hp);
        d.Attack = Number(d.attack);
        d.Sp_Atk = Number(d.sp_atk);
        d.Defense = Number(d.defense);
        d.Sp_Def = Number(d.sp_def);
        d.Speed = Number(d.speed);
    });
    
    
    const processedData = rawData.map(d=>{
        return {
            "Name": d.name,
            "Type_1" : d.type1,
            "Type_2" : d.typ2,
            "HP": d.HP,
            "Attack": d.Attack,
            "Sp_Atk": d.Sp_Atk,
            "Defense": d.Defense,
            "Sp_Def": d.Sp_Def,
            "Speed": d.Speed,
        };
    });


    const attributes = ["HP", "Attack", "Defense", "Sp_Atk", "Sp_Def", "Speed"];
    // Radar Chart for select pokeman
    const svg1 = d3.select("#radar").append("svg")
        .attr("width", radarWidth + radarMargin.left + radarMargin.right)
        .attr("height", radarHeight + radarMargin.top + radarMargin.bottom);
    const g1 = svg1.append("g")
        .attr("transform", `translate(${radarMargin.left}, ${radarMargin.top})`);
    const radarGroup = svg1.append("g")
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

        const data1 = attributes.map(attr => ({ axis: attr, value: poke1[attr] }));
        console.log(data1)
        radarPath1
            .datum(data1)
            .attr("d", radarLine);

        const data2 = attributes.map(attr => ({ axis: attr, value: poke2[attr] }));
        radarPath2
            .datum(data2)
            .attr("d", radarLine);

        g1.append("text")
        .attr("x", 200)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("class", "title")
        .text(poke1["Name"] + "(Blue)\n VS " + poke2["Name"] + "(Yellow)");
        g1.append("text")
        .attr("x", 200)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("class", "title")
        .text(poke1["Name"] + "(Blue) VS " + poke2["Name"] + "(Yellow)");
        g1.append("text")
        .attr("x", 200)
        .attr("y",60)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("class", "title")
        .text(poke1["Name"] + "(Blue) VS " + poke2["Name"] + "(Yellow)");
    }
    updateRadar();
}).catch(console.error);
