// This is a javascript to see how to nest and call csv files within a geojson file
// This is a test so that we can see how it works before calling the csv files through flask.

// Just adding map stuff 
// var map = L.map("map", {
//     center: [0, 0],
//     zoom: 3,
//     layers: [base2000, map2008, map2017]
// });
  // Adding tile layer
//   L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.streets",
//     accessToken: API_KEY
//   }).addTo(map);


// -- new stuff from 10.8
var base2000 = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});

// Second Layer - 2008 data
var map2008 = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});

// Third Layer - 2017 data
var map2017 = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});


// -- new stuff from 10.8 end

// Choose Color
// function chooseColor(country) {
//   switch(country) {
//     case "Afghanistan":
//       return "yellow";
//     default:
//       // what the default color will be 
//       return "aqua";
//   }
// };


// Link to geojson file
var link = "../static/countries";

// Try to get csv data to print within the d3.geojson

d3.json(link, function(geoData) {
    console.log(geoData);
    // This csv will just be replaced by the flask link to the csv
    // d3.json("http://localhost:5000/api", function(error, data2000) {  // this pull to the flask endpoint isnt working
    d3.csv('../data/merged_cleaned', function(error, data2000) {  // try this pull to flask endpoint
    // d3.csv("data2000.csv", function(error, data2000) { // this is the test with csv stuff
        console.log(data2000); 

        // Here filter the data into three different year variables. ***** -- works like a charm
        // testing stuff 10.8
        var year2000 = [];
        var year2008 = [];
        var year2017 = [];

        for (yearsIndex = 0; yearsIndex < data2000.length; yearsIndex++) {
            if (data2000[yearsIndex]["year"] == "2000") {
                year2000.push(data2000[yearsIndex]);
            }
            else if (data2000[yearsIndex]["year"] == "2008") {
                year2008.push(data2000[yearsIndex]);
            }
            else {
                year2017.push(data2000[yearsIndex]);
            }
        };

        console.log(year2000);
        console.log(year2008);
        console.log(year2017);

    
        // Trying to make a function that will grab csv/flask data based on a name
        // Testing Functions with another parameter -- START 
        function matchedNames(data, country) {
            var csvCountries = []
            for (var csvIndex = 0; csvIndex < data.length; csvIndex++) {
                var csvCountryNames = data[csvIndex];
                csvCountries.push(csvCountryNames);
                if (csvCountries[csvIndex]["country"] == country) {
                    return( `<h1><p style="text-align:center;">${csvCountries[csvIndex]["country"]}: ${csvCountries[csvIndex]["year"]}</p></h1>\n
                             <h2>GDP: ${csvCountries[csvIndex]["gdp_per_capita"]}</h2> <hr>\n
                             <h2>Total Deaths: ${csvCountries[csvIndex]["total_deaths"]}</h2> <hr>\n
                             <h2>Deaths Under 5: ${csvCountries[csvIndex]["under_5"]}</h2>\n
                             <h2>Deaths 5-14: ${csvCountries[csvIndex]["age_5_14"]}</h2>\n
                             <h2>Deaths 15-49: ${csvCountries[csvIndex]["age_15_49"]}</h2>\n
                             <h2>Deaths 50-69: ${csvCountries[csvIndex]["age_50_69"]}</h2>\n
                             <h2>Deaths Over 70: ${csvCountries[csvIndex]["over_70"]}</h2>\n`);
                }; 
            };
        };

        function gdpColor(data, country) {
            var csvGDP = [];
            for (var csvIndex = 0; csvIndex < data.length; csvIndex++) {
                var csvCountryData = data[csvIndex];
                csvGDP.push(csvCountryData);
                if (csvGDP[csvIndex]["country"] == country) {
                    // return(`${csvCountries[csvIndex]["gdp_per_capita"]}`)
                    return(`${csvGDP[csvIndex]["gdp_per_capita"]}`)

                };
            };
        };

        function getColor(d) {
            return d > 50000 ? '#66ff00' :
                   d > 25000 ? '#7FFF00' :
                   d > 20000  ? '#99ff00' :
                   d > 10000  ? '#ccff00' :
                   d > 8000   ? '#FFCC00' :
                   d > 5000   ? '#ff9900' :
                   d > 2500   ? '#ff6600' :
                   d > 1000   ? '#FF3300' :
                   d > 500   ? '#FF0000' :
                              '#FFFFFF'; // put countries that don't appear as white

        };

        // this is a color function specifically for deaths
        function deathsColor(d) {
            return d > 20000  ? '#FF0000' :
                   d > 10000  ? '#ff4400' :
                   d > 5000   ? '#ff6a00' :
                   d > 2500   ? '#ff9900' :
                   d > 500   ? '#ffdd00' :
                   d > 100   ? '#f2ff00' :
                   d > 50   ?   '#7bff00':
                              '#FFFFFF'; // put countries that don't appear as white

        };
        // Testing Functions with another parameter -- END 

        // Testing Circle Function with Deaths -- START     
        // function circles(data, country) {
        //     circleList = [];
        //     for (var csvIndex = 0; csvIndex < data.length; csvIndex++) {
        //         var countryDeaths = data[csvIndex];
        //         circleList.push(countryDeaths);
        //         if (circleList[csvIndex]["country"] == country) {
        //             return(`${circleList[csvIndex]["total_deaths"]}`)
        //         }
        //     }
        // }
        function totalDeaths(data, country) {
            var csvCountries = []
            for (var csvIndex = 0; csvIndex < data.length; csvIndex++) {
                var csvCountryNames = data[csvIndex];
                csvCountries.push(csvCountryNames);
                if (csvCountries[csvIndex]["country"] == country) {
                    return( `${csvCountries[csvIndex]["total_deaths"]}`);
                }; 
            };
        };
        function giveName(data, country) {
            var csvCountries = []
            for (var csvIndex = 0; csvIndex < data.length; csvIndex++) {
                var csvCountryNames = data[csvIndex];
                csvCountries.push(csvCountryNames);
                if (csvCountries[csvIndex]["country"] == country) {
                    return( `${csvCountries[csvIndex]["country"]}`);
                }; 
            };
        };
        // Testing Circle Function with Deaths -- END 

        // Grabbing Country Names from GeoJson --success
        var countriesGeoJson = []
        for (var index = 0; index < geoData.features.length; index++) {
            // if (geoData.features.ADMIN ==
            // var countryNames = geoData.features.ADMIN;
            var countryNames = geoData.features[index].properties.ADMIN;
            countriesGeoJson.push(countryNames);
        };
        console.log(countriesGeoJson);
        // -------------------------------------------------------

        // Trying to Grab Info from CSV --success
        var csvCountries = []
        for (var csvIndex = 0; csvIndex < data2000.length; csvIndex++) {
            var csvCountryNames = data2000[csvIndex];
            csvCountries.push(csvCountryNames);
            var countryName = csvCountries[csvIndex]["country"];
            var countryDeaths = csvCountries[csvIndex]["deaths"];
            // console.log(`${countryName},${countryDeaths}`);
            if (csvCountries[csvIndex]["country"] == "Brazil") {
                // change the == Brazil to whatever the argument will be in the function
                console.log(`${csvCountries[csvIndex]["country"]}, ${csvCountries[csvIndex]["deaths"]}`)
            }
            // console.log(csvCountries[csvIndex]["country"]);
        };
        // console.log(csvCountries[0])
        // -------------------------------------------------------

       
        var d2000 = L.layerGroup();
        L.geoJson(geoData, {
            style: function(feature) {
                return{
                    color: "white",
                    // fillColor: chooseColor(feature.properties.ADMIN),
                    fillColor: getColor(gdpColor(year2000, feature.properties.ADMIN)),
                    fillOpacity: 0.5,
                    weight: 1.5
                };
            },
            // pointToLayer: function(feature, [lat,lon]) {
            //     if ((feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') && matchedNames(year2000, feature.properties.ADMIN)) {
            //         console.log('Polygon detected');
            //         var centroid = turf.centroid(feature);
            //         var lon = centroid.geometry.coordinates[0];
            //         var lat = centroid.geometry.coordinates[1];
            //         // L.circleMarker([lat,lon]).bindTooltip(`${matchedNames(year2000, feature.properties.ADMIN)}`).addTo(d2000);
            //         L.circleMarker([lat,lon], {
            //             color: 'black'
            //         }).addTo(d2000);
            //     };
            // },
            onEachFeature: function(feature, layer) {
                if ((feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') && matchedNames(year2000, feature.properties.ADMIN)) {
                    console.log('Polygon detected');
                    var centroid = turf.centroid(feature);
                    var lon = centroid.geometry.coordinates[0];
                    var lat = centroid.geometry.coordinates[1];
                    L.circleMarker([lat,lon], {
                        // color: 'white',
                        // color: getColor(totalDeaths(data2000, feature.properties.ADMIN)),
                        color: deathsColor(totalDeaths(year2000, feature.properties.ADMIN)),
                        fillOpacity: .5
                    }).bindTooltip(`Country: ${giveName(year2000, feature.properties.ADMIN)} \n
                                                           Deaths:${totalDeaths(year2000, feature.properties.ADMIN)}`).addTo(d2000);
                    // L.circleMarker([lat,lon], {
                    //     color: 'black',
                    //     // radius: `${(totalDeaths(year2000, feature.properties.ADMIN)/200)}`
                    //     // radius: `${Math.pow(totalDeaths(year2000, feature.properties.ADMIN, 2))}`
                    // }).addTo(d2000);
                };
                layer.on({
                    mouseover: function(event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.9
                        });
                    },
                    mouseout: function(event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.5
                        });
                    },
                    click: function(event) {
                        map.fitBounds(event.target.getBounds());
                    }
                });

                layer.bindPopup(matchedNames(year2000, feature.properties.ADMIN));
                // L.circle([50.5, 30.5], {
                //     radius: 500,
                //     color: 'blue',
                //     fillColor: 'blue'
                // });
            }
        }).addTo(d2000);

        // put l.geo in here and add to d2008
        var d2008 = L.layerGroup();
        L.geoJson(geoData, {
            style: function(feature) {
                return{
                    color: "white",
                    // fillColor: chooseColor(feature.properties.ADMIN),
                    fillColor: getColor(gdpColor(year2008, feature.properties.ADMIN)),
                    fillOpacity: 0.5,
                    weight: 1.5
                };
            },
            onEachFeature: function(feature, layer) {
                if ((feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') && matchedNames(year2008, feature.properties.ADMIN)) {
                    console.log('Polygon detected');
                    var centroid = turf.centroid(feature);
                    var lon = centroid.geometry.coordinates[0];
                    var lat = centroid.geometry.coordinates[1];
                    L.circleMarker([lat,lon], {
                        // color: 'white',
                        // color: getColor(totalDeaths(data2000, feature.properties.ADMIN)),
                        color: deathsColor(totalDeaths(year2008, feature.properties.ADMIN)),
                        fillOpacity: .5
                    }).bindTooltip(`Country: ${giveName(year2008, feature.properties.ADMIN)} \n
                                                           Deaths:${totalDeaths(year2008, feature.properties.ADMIN)}`).addTo(d2008);
                }
                layer.on({
                    mouseover: function(event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.9
                        });
                    },
                    mouseout: function(event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.5
                        });
                    },
                    click: function(event) {
                        map.fitBounds(event.target.getBounds());
                    }
                });
                // layer.bindPopup("<h1>" + feature.properties.ISO_A3 + "</h1> <hr> <h2>" + feature.properties.ADMIN + "</h2>");
                layer.bindPopup(matchedNames(year2008, feature.properties.ADMIN));
                // This above is trying to do the function that will return data based on 
                // function in here for bindpop that will take in the
                // create a function in here that pulls a name of a country
                // that function
                // im on argentina, now send that country name to the function that loops through csv/flask data and constructs
                // html based on data that wants to be displayed 
            }
        }).addTo(d2008);

        // put l.get in here and add to d2017
        var d2017 = L.layerGroup();
        L.geoJson(geoData, {
            style: function(feature) {
                return{
                    color: "white",
                    // fillColor: chooseColor(feature.properties.ADMIN),
                    fillColor: getColor(gdpColor(year2017, feature.properties.ADMIN)),
                    fillOpacity: 0.5,
                    weight: 1.5
                };
            },
            onEachFeature: function(feature, layer) {
                if ((feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') && matchedNames(year2017, feature.properties.ADMIN)) {
                    console.log('Polygon detected');
                    var centroid = turf.centroid(feature);
                    var lon = centroid.geometry.coordinates[0];
                    var lat = centroid.geometry.coordinates[1];
                    L.circleMarker([lat,lon], {
                        // color: 'white',
                        // color: getColor(totalDeaths(data2000, feature.properties.ADMIN)),
                        color: deathsColor(totalDeaths(year2017, feature.properties.ADMIN)),
                        fillOpacity: .5
                    }).bindTooltip(`Country: ${giveName(year2017, feature.properties.ADMIN)} \n
                                                           Deaths:${totalDeaths(year2017, feature.properties.ADMIN)}`).addTo(d2017);
                }
                layer.on({
                    mouseover: function(event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.9
                        });
                    },
                    mouseout: function(event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.5
                        });
                    },
                    click: function(event) {
                        map.fitBounds(event.target.getBounds());
                    }
                });
                // layer.bindPopup("<h1>" + feature.properties.ISO_A3 + "</h1> <hr> <h2>" + feature.properties.ADMIN + "</h2>");
                layer.bindPopup(matchedNames(year2017, feature.properties.ADMIN));
                // This above is trying to do the function that will return data based on 
                // function in here for bindpop that will take in the
                // create a function in here that pulls a name of a country
                // that function
                // im on argentina, now send that country name to the function that loops through csv/flask data and constructs
                // html based on data that wants to be displayed 
            }
        }).addTo(d2017);


        var map = L.map("map", {
            center: [0, 0],
            zoom: 3,
            // layers: [base2000, map2008, map2017]
            layers: [base2000]
        });
        // put l.get in here and add to d2017
        var overlays = {
            "Data From 2000": d2000,
            "Data From 2008": d2008,
            "Data From 2017": d2017
        };
        L.control.layers(null, overlays).addTo(map);
        
        // Just a test circle
        // L.circle([50.5, 30.5], {
        //     radius: 100000,
        //     color: 'blue',
        //     fillColor: 'blue'
        // }).addTo(map);

        // Add Legend -- start
        var legend = L.control({position: 'topleft'});
        legend.onAdd = function (map) {
      
          var div = L.DomUtil.create('div', 'info legend'),
            categories = [0, 500, 1000, 2500, 5000, 8000, 10000, 20000, 25000, 50000],
            labels = ['<strong>GDP</strong>'],
            from, 
            to; 
              
          for (var i = 0; i < categories.length; i++) {
            from = categories [i];
            to = categories[i+1];
      
          labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
              from + (to ? '&ndash;' + to : '+'));
              }
              div.innerHTML = labels.join('<br>');
              return div;
          };
          legend.addTo(map);
        // Add Legend -- end  

        // Add Second Legend Start 
        var legend2 = L.control({position: 'bottomleft'});
        legend2.onAdd = function (map) {
      
          var div = L.DomUtil.create('div', 'info legend'),
            categories = [0, 50, 100, 500, 2500, 5000, 10000, 20000],
            labels = ['<strong>Total Deaths as Circles</strong>'],
            from, 
            to; 
              
          for (var i = 0; i < categories.length; i++) {
            from = categories [i];
            to = categories[i+1];
      
          labels.push(
            '<i style="background:' + deathsColor(from + 1) + '"></i> ' +
              from + (to ? '&ndash;' + to : '+'));
              }
              div.innerHTML = labels.join('<br>');
              return div;
          };
          legend2.addTo(map);
        // Add Second Legend End 
        
    });
});



