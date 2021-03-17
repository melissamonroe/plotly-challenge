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
    marker = {
      size: sliceValues,
      color: sortedSampleValues[0]["otu_ids"].slice(0,10)
    };

    // // Note the extra brackets around 'x' and 'y'
    Plotly.restyle("bar-plot", "x", [x]);
    Plotly.restyle("bar-plot", "y", [y]);


    // // Note the extra brackets around 'x' and 'y'
    Plotly.restyle("bubble-plot", "x", [x]);
    Plotly.restyle("bubble-plot", "y", [y]);
    Plotly.restyle("bubble-plot", "marker", [marker]);
    
    // marker: {
    //   size: 18,
    //   line: {
    //     color: ['rgb(120,120,120)', 'rgb(120,120,120)', 'red', 'rgb(120,120,120)'],
    //     width: [2, 2, 6, 2]}

  });

}

function LF_PopulateNameSelector(names) {
  var selector = d3.select("#selDataset");    
  names.forEach((n) => {
      selector
          .append("option")
          .text(n)
          .property("value", n);
  });  
}

function LF_PopulateMetadata(selectedMetadata) {
 
  var table = d3.select("#metadata");
  //Add each key value pair to the metadata panel
  Object.entries(selectedMetadata).forEach(([key, value]) => {
    console.log(`${key}:${value}`);
    
    var tr = table.selectAll('tr')
    .data(key)
    .enter()
    .append('tr');

    tr.append('td').html(`${key}`);
    tr.append('td').html(`${value}`);

    
    table.append('tr')      
      .data(value)
      .enter()
  });
     

  

}
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
      title: 'Marker Size',
      showlegend: false,      
    };
    
    Plotly.newPlot('bubble-plot', data, layout);
    
}
function LF_InitBar() {
  var trace1 = {
    x: [],
    y: [],
    type: "bar",
    orientation: 'h'
    };
    
    var data = [trace1];
    
    var layout = {
    title: "OTU Volumes by OTU ID",
    xaxis: { title: "Sample Value"},
    yaxis: { title: "OTU ID"}
    };
    
    Plotly.newPlot("bar-plot", data, layout);
    
  }


function init() {
  
  LF_InitBubble();
  LF_InitBar();
  LF_PopulateDashboard();

};


init();