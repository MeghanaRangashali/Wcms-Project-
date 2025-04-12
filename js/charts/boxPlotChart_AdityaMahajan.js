
//Name- Aditya Mahajan
//Student Id- 8958921

//Below i am showing the data of Covid-19 Interactive 

// THIS renderBoxPlot will be called when rendered 
function renderBoxPlot(continent = "all") {
    // Fetch the data
    return fetchCountries()
        .then((data) => {
            // To filter  the data based on the selected continent
            const filteredData = continent === "all"
                ? data
                : data.filter((d) => d.continent === continent);

            // Over here i am preparing  the data for the box plot
            const continentData = {};
            filteredData.forEach((d) => {
                const continent = d.continent;
                if (!continentData[continent]) {
                    continentData[continent] = [];
                }
                continentData[continent].push(d.cases);
            });

            // Extracting  the continent names and their corresponding case data from the json file that i have
            const continents = Object.keys(continentData);
            const values = Object.values(continentData);

            // Define the margins, width, and height of the box plot
            const margin = { top: 40, right: 30, bottom: 60, left: 60 };
            const width = 800 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;


            d3.select("#boxPlot").selectAll("*").remove();

            // Over here i am creating the SVG container
            const svg = d3
                .select("#boxPlot")
                .append("svg")
                .attr(
                    "viewBox",
                    `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom
                    }`
                )
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Compute the interquartile range (IQR) for each continent
            const iqr = {};
            continents.forEach((continent, i) => {
                const sortedValues = values[i].sort(d3.ascending);
                const q1 = d3.quantile(sortedValues, 0.25);
                const q3 = d3.quantile(sortedValues, 0.75);
                const k = 1.5;
                const iqrValue = (q3 - q1) * k;
                const min = d3.min(sortedValues);
                const max = d3.max(sortedValues);
                const lowerBound = Math.max(min, q1 - iqrValue);
                const upperBound = Math.min(max, q3 + iqrValue);
                const median = d3.median(sortedValues);
                iqr[continent] = {
                    q1: q1,
                    median: median,
                    q3: q3,
                    min: lowerBound,
                    max: upperBound,
                };
            });

            // Create the x-axis scale
            const x = d3
                .scaleBand()
                .domain(continents)
                .range([0, width])
                .padding(0.2);

            // Create the y-axis scale
            const y = d3
                .scaleLinear()
                .domain([
                    d3.min(continents, (continent) => iqr[continent].min),
                    d3.max(continents, (continent) => iqr[continent].max),
                ])
                .range([height, 0])
                .nice();

            // Drawing  the vertical lines over here
            svg
                .selectAll("verticalLines")
                .data(continents)
                .enter()
                .append("line")
                .attr("x1", (continent) => x(continent) + x.bandwidth() / 2)
                .attr("x2", (continent) => x(continent) + x.bandwidth() / 2)
                .attr("y1", (continent) => y(iqr[continent].min))
                .attr("y2", (continent) => y(iqr[continent].max))
                .attr("stroke", "black")
                .style("width", 40);

            // Drawing the boxes over here 
            svg
                .selectAll("boxes")
                .data(continents)
                .enter()
                .append("rect")
                .attr("x", (continent) => x(continent))
                .attr("y", (continent) => y(iqr[continent].q3))
                .attr("height", (continent) => y(iqr[continent].q1) - y(iqr[continent].q3))
                .attr("width", x.bandwidth())
                .attr("stroke", "black")
                .style("fill", "#69b3a2");

            // Drawing the median lines
            svg
                .selectAll("medianLines")
                .data(continents)
                .enter()
                .append("line")
                .attr("x1", (continent) => x(continent))
                .attr("x2", (continent) => x(continent) + x.bandwidth())
                .attr("y1", (continent) => y(iqr[continent].median))
                .attr("y2", (continent) => y(iqr[continent].median))
                .attr("stroke", "black")
                .style("width", 80);

            // Adding  the x-axis
            svg
                .append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("class", "box-plot-axis-label")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-45)");

            // Adding the y-axis over here
            svg.append("g").call(d3.axisLeft(y));

            // Adding the chart title
            svg
                .append("text")
                .attr("x", width / 2)
                .attr("y", -20)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Distribution of Cases by Continent");
        })
        .catch((err) => console.error("Box Plot Error:", err));
}
