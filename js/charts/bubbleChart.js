function renderBubbleChart(continent = "all") {
  return fetchCountries()
    .then((data) => {
      const filtered =
        continent === "all"
          ? data
          : data.filter((d) => d.continent === continent);

      const width = 360;
      const height = 360;
      const padding = 5;

      const svg = d3
        .select("#bubbleChart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      const pack = d3.pack().size([width, height]).padding(padding);

      const root = d3.hierarchy({ children: filtered }).sum((d) => d.cases);

      const nodes = pack(root).leaves();

      svg
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.r)
        .attr("fill", "mediumpurple")
        .attr("opacity", 0.85)
        .on("mouseover", (event, d) => {
          $("#tooltip")
            .show()
            .html(
              `<strong>${
                d.data.country
              }</strong><br/>Cases: ${d.data.cases.toLocaleString()}`
            )
            .css({
              left: event.pageX + 10 + "px",
              top: event.pageY - 28 + "px",
            });
        })
        .on("mouseout", () => $("#tooltip").hide());
    })
    .catch((err) => {
      console.error("Bubble Chart Error:", err.message);
    });
}
