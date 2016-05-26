/**
 * Created by zhiweiyan on 14-9-16.
 */
function LoadSisPie() {

    var ip_addr = document.getElementById("DBIPAddress").value;
    var x_axis_name = "";
    var radios = document.getElementsByName('X_Axis_Name');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].type === 'radio' && radios[i].checked) {
            // get value, set checked flag or do whatever you need to
            x_axis_name = radios[i].value;
        }
    }
    var response_data = [];
    //for SQL clause
    //var json_request = "select warn_type as data_type, count(id) from warning_log group by warn_type;"
    //json_request = "select en_name as data_type, count(id) from warning_log group by en_name;"

    var json_request = " SELECT "
        + x_axis_name + " as data_type, "
        + " count(id) "
        + " FROM " + " warning_log "
        + " group BY " + x_axis_name
        + " ORDER by count" + ";";

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
            json_type_name.push(d["data_type"]);
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
                'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('main'));

                var option = {
                    title: {
                        'text': '电厂SIS报警',
                        'subtext': '数据来源于新密电厂',
                        x: 'left'
                    },
                    toolbox: {
                        'show': true,
                        'feature': {
                            'saveAsImage': {'show': true}
                        }
                    },
                    tooltip: {
                        show: true,
//                        trigger: 'item',
//                        formatter: "{a} {b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'bottom',
                        data: json_type_name
                    },
                    calculable: true,
                    series: [
                        {
                            name: '报警次数',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: (function () {
                                var d = [];
                                var len = json_type_value.length;
                                while (len--) {
                                    d.push(
                                        {'name': json_type_name[len],
                                            'value': json_type_value[len]}
                                    );
                                }
                                console.log(d);
                                return d;
                            })()
                        }
                    ]
                };
                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        );
    });
}


