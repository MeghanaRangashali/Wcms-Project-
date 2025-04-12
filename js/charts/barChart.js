function renderBarChart(continent = "all") {
  return fetchCountries()
    .then((data) => {
      const filtered =
        continent === "all"
          ? data
          : data.filter((d) => d.continent === continent);
      const top10 = filtered.slice(0, 10);

      const margin = { top: 20, right: 20, bottom: 70, left: 60 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3
        .select("#barChart")
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

      const x = d3
        .scaleBand()
        .domain(top10.map((d) => d.country))
        .range([0, width])
        .padding(0.2);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(top10, (d) => d.cases)])
        .nice()
        .range([height, 0]);

      // X Axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("text-anchor", "end");

      // Y Axis
      svg.append("g").call(d3.axisLeft(y));

      // Bars
      svg
        .selectAll("rect")
        .data(top10)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.country))
        .attr("y", (d) => y(d.cases))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.cases))
        .attr("fill", "#3399ff")
        .on("mouseover", (event, d) => {
          $("#tooltip")
            .show()
            .html(
              `<strong>${
                d.country
              }</strong><br/>Total Cases: ${d.cases.toLocaleString()}`
            )
            .css({
              left: event.pageX + 10 + "px",
              top: event.pageY - 28 + "px",
            });
        })
        .on("mouseout", () => $("#tooltip").hide())
        .on("click", (event, d) => {
          $("#lineChart").empty();
          renderLineChart(d.country);
        });
    })
    .catch((err) => {
      console.error("Bar Chart Error:", err.message);
    });
}
