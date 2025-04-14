function renderLineChart(country = "USA") {
  //fetch historical data for the selected country
  fetchHistorical(country)
    .then((result) => {
      //check if data is available
      if (!result || !result.timeline || !result.timeline.cases) {
        throw new Error(`No historical data available for ${country}`);
      }

      //extract timeline data
      const timeline = result.timeline.cases;
      const dates = Object.keys(timeline);
      const values = Object.values(timeline);

      //calculate daily new cases based on the different from the previous day
      const cases = dates.map((d, i) => ({
        date: new Date(d),
        cases: i === 0 ? 0 : values[i] - values[i - 1],
      }));

      //set margins ,width and height for the chart
      const margin = { top: 20, right: 20, bottom: 50, left: 60 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      //create svg container for the line chart
      const svg = d3
        .select("#lineChart")
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

      //define x and y scales
      const x = d3
        .scaleTime()
        .domain(d3.extent(cases, (d) => d.date))
        .range([0, width]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(cases, (d) => d.cases)])
        .nice()
        .range([height, 0]);

      //define the line generator function
      const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.cases));

      // X Axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(6));

      // Y Axis
      svg.append("g").call(d3.axisLeft(y));

      // Line Path
      svg
        .append("path")
        .datum(cases)
        .attr("fill", "none")
        .attr("stroke", "#ff9900")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Dots and tooltip
      svg
        .selectAll("circle")
        .data(cases)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d.cases))
        .attr("r", 4)
        .attr("fill", "#ff9900")
        .on("mouseover", (event, d) => {
          $("#tooltip")
            .show()
            .html(
              `<strong>${d.date.toDateString()}:</strong> ${d.cases.toLocaleString()} new cases`
            )
            .css({ left: event.pageX + 10, top: event.pageY - 28 });
        })
        .on("mouseout", () => $("#tooltip").hide());
    })
    .catch((err) => {
      console.warn(`Line Chart Warning: ${err.message}`);
      $("#lineChart").html(
        `<p style="color:red; text-align:center; padding:1rem;">${err.message}</p>`
      );
    });
}
