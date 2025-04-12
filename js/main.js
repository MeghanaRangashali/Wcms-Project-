$(document).ready(() => {
  const showLoader = () => $("#globalLoader").fadeIn(200);
  const hideLoader = () => $("#globalLoader").fadeOut(300);

  const loadAllCharts = (continent = "all") => {
    showLoader();

    $("#barChart, #bubbleChart, #horizontalBarChart").empty();

    setTimeout(() => {
      Promise.all([
        renderBarChart(continent),
        renderBubbleChart(continent),
        renderHorizontalBarChart(continent),
        renderScatterPlot(continent),
        renderBoxPlot(continent)
      ]).then(() => {
        hideLoader();
      });
    }, 100);
  };

  showLoader();
  setTimeout(() => {
    renderPieChart();
    renderDonutChart();
    renderLineChart("USA");

    loadAllCharts();
  }, 2000);

  $("#continentFilter").on("change", function () {
    const selected = $(this).val();
    loadAllCharts(selected);
  });
});
