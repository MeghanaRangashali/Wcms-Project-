function renderDonutChart() {
  fetchContinents()
    .then((data) => {
      const donutData = data.map((d) => ({
        label: d.continent,
        value: d.cases,
      }));

      const width = 400,
        height = 300,
        radius = Math.min(width, height) / 2;

      const svg = d3
        .select("#donutChart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const color = d3
        .scaleOrdinal()
        .domain(donutData.map((d) => d.label))
        .range(d3.schemeCategory10);

      const pie = d3.pie().value((d) => d.value);
      const arc = d3.arc().innerRadius(100).outerRadius(radius);

      svg
        .selectAll("path")
        .data(pie(donutData))
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
              }</strong>: ${d.data.value.toLocaleString()} cases`
            )
            .css({ left: event.pageX + 10, top: event.pageY - 28 });
        })
        .on("mouseout", () => $("#tooltip").hide());
    })
    .catch((err) => {
      console.error("Donut Chart Error:", err.message);
      $("#donutChart").html(
        `<p style="color:red; text-align:center; padding:1rem;">${err.message}</p>`
      );
    });
}
