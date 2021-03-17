// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", LF_PopulateDashboard);

// This function is called when a dropdown menu item is selected
function LF_PopulateDashboard() {

  Plotly.d3.json("data/samples.json", function(data) {
    console.log(data);
    
    var names = data["names"];
    console.log(names);
    
    var samples = data["samples"];
    
    // @TODO only populate names first time
    LF_PopulateNameSelector(names);
        
    // Use D3 to select the dropdown menu
    var selector = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var selectedNameId = selector.property("value");
    
    console.log(selectedNameId);
     
    // Create a custom filtering function
    function selectName(samples) {
      return samples.id === selectedNameId;
    }

    // filter() uses the custom function as its argument
    var selectedName = samples.filter(selectName);

    // selected name from samples
    console.log(selectedName);

    // Sort the data by Greek search results
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
    Plotly.restyle("plot", "x", [x]);
    Plotly.restyle("plot", "y", [y]);

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





// function LF_PopulateTitledPlayersPlot() {
//   var selectorValue = d3.select("#selDataset").property("value");

//   console.log("selectorValue " + selectorValue);

//   Plotly.d3.csv('../output_data/players_Titled.csv', function(err, rows){
//     function unpack(rows, key) {
//       var row = rows.map(function(row) {return row[key]; })
//       return row;
//     };

//     countries = unpack(rows, 'country');        
//     var uniqueCountries = [];
//     var uniqueCountryCounts = [];
  
//     var countryCountsDict = {};

//     for (var i = 0; i < countries.length; i++) {
//         var num = countries[i];
//         countryCountsDict[num] = countryCountsDict[num] ? countryCountsDict[num] + 1 : 1;
//     }
//     for (const [key, value] of Object.entries(countryCountsDict)) {
//         //     countryCounts.push({
//         //         "country":  key,                        
//         //         "count": value
//         // });
      
//         uniqueCountries.push(key);
//         uniqueCountryCounts.push(value);

//         //console.log(`${key}: ${value}`);
//         };
        
//     titles = unpack(rows, 'title');
//     followers = unpack(rows, 'followers');
          
//     // Trace 1
//     var trace1 = {
//         x: uniqueCountries,
//         y: uniqueCountryCounts,
//         name: "Titled Players Count by Country",
//         type: "bar"
//     };

//     var data = [trace1];

//     var layout = {
//       title: "Titled Players Count by Country",
//       xaxis: { title: "Country Code" },
//       yaxis: { title: "Titled Player Count"}
//     };

//     Plotly.newPlot('plot', data, layout);

//   });    
// };

//   // Case statement
// function filterTitle(title) {
//   // Initialize x and y arrays
//   var x = [];
//   var y = [];
//       console.log("Filter by " + title);
//       if (title === 'GM') {
//         x = [1, 2, 3, 4, 5];
//         y = [1, 2, 4, 8, 16];
//       } else if (title === 'IM') {
//         x = [10, 20, 30, 40, 50];
//         y = [1, 10, 100, 1000, 10000];
//       } else if (title === "") {
//         LF_PopulateTitledPlayersPlot();
//         return xy;
//       } else {
//         x = [10, 20, 30, 40, 50];
//         y = [2333,245,2485,82412,21]
//       };

//       xy = [x,y];
//     return xy;
//   };



function init() {
  LF_PopulateDashboard();

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
    
    Plotly.newPlot("plot", data, layout);
    
};


init();