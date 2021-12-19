function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    let resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    let result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    let sampleNames = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let resultArray = sampleNames.filter((sampleObj) => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    let result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuId = result.otu_ids;
    let otuLabel = result.otu_labels.slice(0, 10).reverse();
    let otuValue = result.sample_values.slice(0, 10).reverse();

    var bubbleLabels = result.otu_labels; // for Del 2
    var bubbleValues = result.sample_values; // for Del 2

    console.log(otuId);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order (done in step 6)
    //  so the otu_ids with the most bacteria are last.

    var yticks = otuId
      .map((sampleObj) => "OTU" + sampleObj + " ")
      .slice(0, 10)
      .reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart.
    // var barData = []; - delete this line???
    var trace = {
      type: "bar",
      orientation: "h",
      x: otuValue,
      y: yticks,
      text: otuLabel,
      marker: {
        color: "#ff7d4d",
        // colorscale: [
        //   [0, "ff4500"],
        //   [40, "#ff581a"],
        //   [60, "#ff6a34"],
        //   [80, "#ff7d4d"],
        //   [0.4, "ff9067"],
        //   [0.5, "ffa280"],
        //   [0.6, "#ecd5fd"],
        //   [0.7, "#e1bdfb"],
        //   [0.8, "#d6a5fa"],
        //   [0.9, "#cb8df9"],
        //   [150, "#c075f7"],
        // ],
        // color[y<100]: "ff4500",
        // color[y>=100]: "#c075f7"
      },
    };

    var barData = [trace]; //   ?? Can/should I change 'trace' on line 80 to 'barData' and then eliminate this line??

    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };

    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);

    // --------------------------------------------------
    // Deliverable 2
    // 1. Create the trace for the bubble chart using custom color scale.

    var bubbleData = [
      {
        x: otuId,
        y: bubbleValues,
        text: bubbleLabels,
        mode: "markers",
        marker: {
          size: bubbleValues,
          color: bubbleValues,
          colorscale: [
            [0, "ff4500"],
            [0.1, "#ff581a"],
            [0.2, "#ff6a34"],
            [0.3, "#ff7d4d"],
            [0.4, "ff9067"],
            [0.5, "ffa280"],
            [0.6, "#ecd5fd"],
            [0.7, "#e1bdfb"],
            [0.8, "#d6a5fa"],
            [0.9, "#cb8df9"],
            [1, "#c075f7"],
          ],
        },
      },
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
    };
    hovermode: "closest",
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // ------------------------------------------------------
    // Deliverable 3
    // Create a variable that holds the samples array.

    let metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    let gaugeResultArray = metadata.filter(
      (sampleObj) => sampleObj.id == sample
    );
    let gaugeResult = gaugeResultArray[0];

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // https://plotly.com/python/gauge-charts/
    var gaugeValue = parseFloat(gaugeResult.wfreq);
    console.log(gaugeValue);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: gaugeValue,
        mode: "gauge+number",
        type: "indicator",
        title: {
          text: "Belly Button Washing Frequency <br> Scrubs per Week",
        },
        gauge: {
          axis: { range: [null, 10], dtick: 2 },
          bar: {
            color: "#ff7d4d",
          },
          steps: [
            { range: [0, 2], color: "#ecd5fd" },
            { range: [2, 4], color: "#e1bdfb" },
            { range: [4, 6], color: "#d6a5fa" },
            { range: [6, 8], color: "#cb8df9" },
            { range: [8, 10], color: "#c075f7" },
          ],
        },
      },
    ];

    // 5. Create the layout for the gauge chart.       //  change colors and fonts AFTER you get it to work!!
    var gaugeLayout = {
      plot_bgcolor: "#e4e6e7",
      paper_bgcolor: "#e4e6e7",
      font: {
        family: "Goudy Old Style Bold",
      },
      automargin: true,
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
