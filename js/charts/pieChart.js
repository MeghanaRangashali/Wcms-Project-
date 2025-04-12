function renderPieChart() {
  fetchGlobal()
    .then((data) => {
      const pieData = [
        { label: "Active", value: data.active },
        { label: "Recovered", value: data.recovered },
        { label: "Deaths", value: data.deaths },
      ];

      const width = 400,
        height = 200,
        radius = Math.min(width, height) / 2;

      const color = d3
        .scaleOrdinal()
        .domain(pieData.map((d) => d.label))
        .range(["#ffcc00", "#66cc66", "#ff6666"]);

      const svg = d3
        .select("#pieChart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const pie = d3.pie().value((d) => d.value);
      const arc = d3.arc().innerRadius(0).outerRadius(radius);

      svg
        .selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data.label))
        .on("mouseover", (event, d) => {
          $("#tooltip")
            .show()
            .html(
              `<strong>${
                d.data.label
              }:</strong> ${d.data.value.toLocaleString()}`
            )
            .css({ left: event.pageX + 10, top: event.pageY - 28 });
        })
        .on("mouseout", () => $("#tooltip").hide());
    })
    .catch((err) => {
      console.error("Pie Chart Error:", err.message);
    });
}
