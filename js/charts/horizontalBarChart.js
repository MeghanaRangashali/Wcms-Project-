function renderHorizontalBarChart(continent = "all") {
  fetchDeaths()
    .then((data) => {
      const filtered =
        continent === "all"
          ? data
          : data.filter((d) => d.continent === continent);
      const top10 = filtered.slice(0, 10);

      const margin = { top: 20, right: 20, bottom: 50, left: 140 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3
        .select("#horizontalBarChart")
        .append("svg")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const y = d3
        .scaleBand()
        .domain(top10.map((d) => d.country))
        .range([0, height])
        .padding(0.2);

      const x = d3
        .scaleLinear()
        .domain([0, d3.max(top10, (d) => d.deaths)])
        .nice()
        .range([0, width]);

      // Y Axis
      svg.append("g").call(d3.axisLeft(y));

      // X Axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

      // Bars
      svg
        .selectAll("rect")
        .data(top10)
        .enter()
        .append("rect")
        .attr("y", (d) => y(d.country))
        .attr("x", 0)
        .attr("width", (d) => x(d.deaths))
        .attr("height", y.bandwidth())
        .attr("fill", "#cc3333")
        .on("mouseover", (event, d) => {
          $("#tooltip")
            .show()
            .html(`${d.country}: ${d.deaths.toLocaleString()} deaths`)
            .css({ left: event.pageX + 10, top: event.pageY - 28 });
        })
        .on("mouseout", () => $("#tooltip").hide());
    })
    .catch((err) => {
      console.error("Horizontal Bar Chart Error:", err.message);
    });
}
