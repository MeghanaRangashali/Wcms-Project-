//Name- Aditya Mahajan
//Student Id- 8958921

//Below i am showing the data of Covid-19 Interactive 
//It will show intially all and when used filter by then it will filter by specified continent passed on to it
function renderScatterPlot(continent = "all") {

    // To fetch data for countries 
    return fetchCountries()
        .then((data) => {
            const filtered = continent === "all"
                ? data //To show all data 
                : data.filter(d => d.continent === continent);// To filter data  by continent

            //Below i am defining the margins here 
            const margin = { top: 40, right: 30, bottom: 60, left: 60 };
            const width = 800 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            d3.select("#scatterPlot").selectAll("*").remove();

            // Over here i am appending an SVG element to the scatter plot container
            const svg = d3.select("#scatterPlot")
                .append("svg")
                .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Scales
            const x = d3.scaleLinear() // Setting the domain of the x-axis to the range of case counts
                .domain([0, d3.max(filtered, d => d.cases)])
                .range([0, width]); // Setting the range of the x-axis to the chart width

            const y = d3.scaleLinear()
                .domain([0, d3.max(filtered, d => d.deaths)])// over here i am setting the domain of the y-axis to the range of death counts
                .range([height, 0]);// Over here i am setting the range of the y-axis to the chart height (reversed for SVG coordinates)

            // Axes
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(".2s")))
                .append("text")
                .attr("class", "axis-label")
                .attr("x", width / 2)
                .attr("y", 40)
                .text("Total Cases");

            svg.append("g")
                .call(d3.axisLeft(y).ticks(5)) // over here i am creating the y-axis with specified ticks
                .append("text")
                .attr("class", "scatter-axis-label")
                .attr("transform", "rotate(-90)")
                .attr("y", -40)
                .attr("x", -height / 2)
                .text("Total Deaths");


            svg.selectAll("circle")
                .data(filtered)
                .enter()
                .append("circle")
                .attr("class", "scatter-circle")
                .attr("cx", d => x(d.cases))
                .attr("cy", d => y(d.deaths))
                .attr("r", 8)
                .attr("fill", "#ff4444")
                .attr("opacity", 0.7)
                .on("mouseover", (event, d) => {
                    $("#tooltip")
                        .show()
                        .html(`<strong>${d.country}</strong><br>
                     Cases: ${d.cases.toLocaleString()}<br>
                     Deaths: ${d.deaths.toLocaleString()}`)
                        .css({ left: event.pageX + 10, top: event.pageY - 28 });
                })
                .on("mouseout", () => $("#tooltip").hide())
                .on("click", (event, d) => {
                    $("#lineChart").empty();
                    renderLineChart(d.country);
                });

            // Trend line
            const regression = d3.regressionLinear()
                .x(d => d.cases)
                .y(d => d.deaths)
                .domain([x.domain(), y.domain()]);

            const trendData = regression(filtered);

            svg.append("path")
                .datum(trendData)
                .attr("fill", "none")
                .attr("class", "trend-line")
                .attr("stroke", "#333")
                .attr("stroke-width", 2)
                .attr("d", d3.line()
                    .x(d => x(d[0]))
                    .y(d => y(d[1]))
                );

        })
        .catch(err => console.error("Scatter Plot Error:", err));  // Over here i am catching the errors if  any occurs during the process
}
