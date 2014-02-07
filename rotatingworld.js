var width = 960,
    height = 960;

var projection = d3.geo.orthographic()
                       .scale(350)
                       .translate([width/2, height/2])
                       .clipAngle(90);

var path = d3.geo.path().projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

svg.append("path")
   .datum({type: "Sphere"})
   .attr("id", "sphere")
   .attr("d", path);

svg.append("path")
   .datum(graticule)
   .attr("class", "graticule")
   .attr("d", path);

d3.json("world.json", function(error, data) {
  svg.insert("path", ".graticule")
     .datum(topojson.feature(data, data.objects.land))
     .attr("class", "land")
     .attr("d", path);

  svg.insert("path", ".graticule")
     .datum(topojson.mesh(data, data.objects.countries, function(a, b) { return a !== b; }))
     .attr("class", "boundary")
     .attr("d", path);

  svg.call(drag);
});


var drag = d3.behavior.drag().on('drag', function() {
  var start = { 
    lon: projection.rotate()[0], 
    lat: projection.rotate()[1]
  },

  delta = { 
    x: d3.event.dx,
    y: d3.event.dy  
  },
    
  scale = 0.25,

  end = { 
    lon: start.lon + delta.x * scale, 
    lat: start.lat - delta.y * scale 
  };

  end.lat = end.lat >  30 ?  30 :
            end.lat < -30 ? -30 :
            end.lat;
  
  projection.rotate([end.lon,end.lat]);

  svg.selectAll("path").attr("d", path);
})

// var clicked, r;

// svg.on("mousedown", function() {
//   clicked = d3.mouse(this);
//   r = projection.rotate();
//   d3.event.preventDefault();
// })

// svg.on("mousemove", mousemove);

// function mousemove() {
//   if (clicked) {
//     var newPosition = d3.mouse(this);
//     projection.rotate([horizontal(newPosition[0]), vertical(newPosition[1]), r[2]]);
//     svg.selectAll("path").attr("d", path);
//   }
// }

// svg.on("mouseup", function() {
//   if (clicked) {
//     // mousemove();
//     clicked = null;
//   }
// });