// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", LF_PopulateDashboard);

// This function is called when a dropdown menu item is selected
function LF_PopulateDashboard() {

  Plotly.d3.json("data/samples.json", function(data) {
    
    console.log(data);
    
    var names = data["names"];
    var samples = data["samples"];
    var metadata = data["metadata"];

    // Use D3 to select the dropdown menu
    var selector = d3.select("#selDataset");

    if (selector.property("value") === "") {
      // only populate names first time
      LF_PopulateNameSelector(names);
    }

    // Assign the value of the dropdown menu option to a variable
    var selectedNameId = selector.property("value");
     
    // filter() uses the custom function as its argument
    var selectedName = samples.filter(n => n.id === selectedNameId);
    var selectedMetadata = metadata.filter(m => m.id === parseInt(selectedNameId));

    LF_PopulateMetadata(selectedMetadata[0]);  

    // selected name from samples
    console.log(selectedName);
    console.log(selectedMetadata);

    // Sort the data by sample volume
    var sortedSampleValues = selectedName.sort((a, b) => b["sample_values"] - a["sample_values"]);

    var sliceLabels = sortedSampleValues[0]["otu_ids"].slice(0,10).map(l => `OTU ${l}`);
    var sliceValues = sortedSampleValues[0]["sample_values"].slice(0,10);
    
    // Reverse the array to accommodate Plotly's defaults
    var reversedLabels = sliceLabels.reverse();
    var reversedValues = sliceValues.reverse();
    
    console.log(reversedLabels,reversedValues);

    x = sliceValues;
    y = sliceLabels;

    // // Note the extra brackets around 'x' and 'y'
    Plotly.restyle("bar-plot", "x", [x]);
    Plotly.restyle("bar-plot", "y", [y]);

    var x_bubble = sortedSampleValues[0]["otu_ids"];
    var y_bubble = sliceValues;
    marker = {
      size: sliceValues,
      color: sortedSampleValues[0]["otu_ids"]
    };

    // // Note the extra brackets around 'x' and 'y'
    Plotly.restyle("bubble-plot", "x", [x_bubble]);
    Plotly.restyle("bubble-plot", "y", [y_bubble]);
    Plotly.restyle("bubble-plot", "marker", [marker]);
  });

};

function LF_PopulateNameSelector(names) {
  var selector = d3.select("#selDataset");    
  names.forEach((n) => {
      selector
          .append("option")
          .text(n)
          .property("value", n);
  });  
};

function LF_PopulateMetadata(selectedMetadata) {
    console.log("metadata");
    console.log(selectedMetadata);
    d3.select("tbody").html("");

    var metadataArr = []

    // //Add each key value pair to the metadata panel
    Object.entries(selectedMetadata).forEach(([key, value]) => {
       console.log(`${key}:${value}`);
       metadataArr.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`);
 
    });
    console.log(metadataArr);

    d3.select("tbody")
      .selectAll("tr")
      .data(metadataArr)
      .enter()
      .append("tr")
      .html(function(d) {
        return `<td>${d}</td>`;
      });   

      // Plotly restyle gauge plot
      Plotly.restyle("gauge-plot", "value", [parseFloat(selectedMetadata["wfreq"])]);
  };
function LF_InitBubble() {

    //bubble chart
    var trace1 = {
      x: [],
      y: [],
      mode: 'markers',
      marker: {
        size: []
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: 'OTU Samples Bubble Plot',
      xaxis: { title: "OTU ID"},
      yaxis: { title: "Sample Value"},
      showlegend: false,      
    };
    
    Plotly.newPlot('bubble-plot', data, layout);
    
};
function LF_InitBar() {
  var trace1 = {
    x: [],
    y: [],
    type: "bar",
    orientation: 'h'
    };
    
    var data = [trace1];
    
    var layout = {
    title: "Top 10 OTUs present in individual",
    xaxis: { title: "Sample Value"},
    yaxis: { title: "OTU ID"}
    };
    
    Plotly.newPlot("bar-plot", data, layout);
    
  };

function LF_InitGauge() {

  var data = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: 0,
      title: { text: "Belly Button Washing Frequency<br>Scrubs per Week", font: { size: 16 } },
      
      gauge: {
        axis: { range: [null, 9] },   

        bar: { color: "#4051BB" },
        steps: [
          // #ec6859 //red
          // #ecb259 //orange
          // #ddec59 //yellow
          // #94ec59 //light green
          // #59ec68 //green

          { range: [0, 1], color: "#ec6859" },
          { range: [1, 2], color: "#ec6859" },
          { range: [2, 3], color: "#ecb259" },
          { range: [3, 4], color: "#ecb259" },
          { range: [4, 5], color: "#ddec59" },
          { range: [5, 6], color: "#94ec59" },
          { range: [6, 7], color: "#94ec59" },
          { range: [7, 8], color: "#94ec59" },
          { range: [8, 9], color: "#59ec68" },
        ],
      }
    }
  ];

  
  
  var layout = { margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge-plot', data, layout);
};

function init() {
  
  LF_InitBubble();
  LF_InitBar();
  LF_InitGauge();
  LF_PopulateDashboard();

};


init();