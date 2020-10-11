// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var cities = []
//Adding each earthquake to cities array as an array of objects
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(link, function(data){
  var features_array = data.features
  for(i = 0; i < features_array.length; i++){
    mag= features_array[i].properties.mag
    loc = features_array[i].properties.place
    lat = features_array[i].geometry.coordinates[1]
    long = features_array[i].geometry.coordinates[0]
    dep= features_array[i].geometry.coordinates[2]
    coord = [lat, long]
    var city = {
      location: loc,
      coordinates: coord,
      magnitude: mag,
      depth: dep
    }
    cities.push(city)
    
  }

  for (var i = 0; i < cities.length; i++) {
    // Conditionals for depth points
    var current_depth = cities[i].depth
    var color = "";
    if (current_depth <= 10) {
      color = "#ADFF2F";
    }
    else if (current_depth <= 30) {
      color = "#8FBC8F";
    }
    else if (current_depth <= 50) {
      color = "#BDB76B";
    }
    else if (current_depth <= 70) {
      color = "#FFA500";
    }
    else if (current_depth <= 90) {
      color = "#DC143C";
    }
    else {
      color = "#8B0000";
    }
    // Add circles to map
    L.circle(cities[i].coordinates, {
      fillOpacity: 0.75,
      color: "black",
      fillColor: color,
      weight: .5,
      // Adjust radius
      radius: 25000 * cities[i].magnitude
    }).bindPopup("<h1>Location: " + cities[i].location + "</h1> <hr> <h3>Magnitude: " + cities[i].magnitude + "</h3> <hr> <h3>Depth: "+
                                                                                                          cities[i].depth).addTo(myMap);
    

      //Code to get legend found at https://codepen.io/haakseth/pen/KQbjdO Includes some css as well                                                                                                 
      var legend = L.control({ position: "bottomright" });

      legend.onAdd = function(map) {
       var div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Depth</h4>";
       div.innerHTML += '<i style="background: #ADFF2F"></i><span> - 10</span><br>';
       div.innerHTML += '<i style="background: #8FBC8F"></i><span>10-30</span><br>';
       div.innerHTML += '<i style="background: #BDB76B"></i><span>30-50</span><br>';
       div.innerHTML += '<i style="background: #FFA500"></i><span>50-70</span><br>';
       div.innerHTML += '<i style="background: #DC143C"></i><span>70-90</span><br>';
       div.innerHTML += '<i style="background: #8B0000"></i><span>90+</span><br>';
       
       return div;
      };
  }                                                                                                     
     legend.addTo(myMap);                                                                                                     
  
  
})