function LoadSisCurve() {

    var ip_addr = document.getElementById("DBIPAddress").value;
    var response_data = [];
    //for SQL clause
    var json_request = "select warn_type, count(id) from warning_log group by warn_type;"
    /*
     json_request = " SELECT * "
     + " FROM " + table
     + " WHERE "
     + "start_time " + ">" + "'" + start + "'"
     + " AND "
     + "start_time" + "<" + "'" + end + "'"
     + " ORDER BY id";
     */
    //BASE64 encoding
    var http_req = 'http://' + ip_addr + '/select?' + encode(json_request);

    //Send the request.
    var json_type_name = [];
    var json_type_value = [];
    d3.json(http_req, function (json) {

        if ('string' == typeof json) {
            alert("返回结果不正确！\n输入参数可能有误，请修正后重试。\n" + json);
            return;
        }
        var json_data = [];
        response_data = json.rows;
        console.log("The row number of data is: " + response_data.length);
        //console.log("The row number of data is: " + response_data);

        response_data.forEach(function (d) {
            json_type_name.push(d["warn_type"]);
            json_type_value.push(d["count"]);
        });
        console.log(json_type_value);
        console.log(json_type_name);


        require.config({
            paths: {
                'echarts': 'http://echarts.baidu.com/build/echarts',
                'echarts/chart/bar': 'http://echarts.baidu.com/build/echarts'
            }
        });
        // 使用
        require(
            [
                'echarts',
                'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('main'));

                var option = {
                    tooltip: {
                        show: true
                    },
                    legend: {
                        data: ['报警数量']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: json_type_name
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: "报警数量",
                            type: "bar",
                            data: json_type_value

                        }
                    ]
                };
                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        )
    });
}
