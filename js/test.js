function LoadCurve() {

    //clear the old drawing.
    console.log("The number of SVG is: " + d3.select("svg").size());

    if (d3.select("svg").size() > 0) {
        d3.select("svg").remove();
    }

    //configure the canvas for the drawing
    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    var width = document.getElementById("CanvasWidth").value - margin.left - margin.right;
    var height = document.getElementById("CanvasHeight").value - margin.top - margin.bottom;

    var start = document.getElementById("StartTime").value;
    var end = document.getElementById("EndTime").value;

    var table = document.getElementById("DBTableName").value;

    var x_name = document.getElementById("XAxialFieldName").value;
    var y_name = document.getElementById("YAxialFieldName").value;
    var y_minimum = document.getElementById("YAxialBottomLimit").value;
    var y_maximum = document.getElementById("YAxialTopLimit").value;


    data =[];

    var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

    var x = d3.time.scale()
        .range([0, width]);
    var y = d3.scale.linear()
        .domain([y_minimum, y_maximum])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.xValue);
        })
        .y(function (d) {
            return y(d.yValue);
        });

    var svg = d3.select("#canvas").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json('http://192.168.1.102:8888/select?qs='
        + start + '&js=' + end + '&bm=' + table + '&shijian=' + x_name + '&shuju=' + y_name,
        function (json) {
            var response_data = json.rows;
            console.log("The length of data is: " + response_data.length);
            data_count = response_data.length;
            response_data.forEach(function (d) {
                data.push({
                    'xValue': parseDate(d['packet_time']),
                    'yValue': +d['frequency_001']
                });
            });
            console.log("Data are ready for drawing.");

            x.domain(d3.extent(data, function (d) {
                return d['xValue'];
            }));

            /*
            y.domain(d3.extent(data, function (d) {
                return d['yValue'];
                ;
            }));
            */

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);
        });
}