/* 불러온 데이터로 차트 표시 */
var loadChart = function(chartDiv, inpData) {
    console.log("chart name : " + chartDiv);
    if(chartDiv == "chart-area-visit") {
        var container = document.getElementById(chartDiv);
        container.innerHTML = "";
        //inpData를 chart에 맞게 변환
        
        var categoriesData = [];
        var seriesData = [];
        for(var i = 0; i < inpData.length; ++i) {
            categoriesData.push(inpData[i]["dt"]);
            seriesData.push(Number(inpData[i]["cnt"]));
        }
        var data = {
            categories: categoriesData,
            series: [
                {
                    name: 'visitors',
                    data: seriesData
                }
            ]
        };
        var options = {
            chart: {
                width: document.getElementById(chartDiv).offsetWidth,
                height: 540,
                title: '일일 방문자 수'
            },
            yAxis: {
                title: '방문자 수',
            },
            xAxis: {
                title: 'Date',
                pointOnColumn: true,
                dateFormat: 'MMM',
                tickInterval: 'auto'
            },
            series: {
                showDot: false,
                zoomable: true
            },
            tooltip: {
                suffix: '명'
            }
        };
        var theme = {
            series: {
                colors: [
                    '#83b14e', '#458a3f', '#295ba0', '#2a4175', '#289399',
                    '#289399', '#617178', '#8a9a9a', '#516f7d', '#dddddd'
                ]
            }
        };
        // For apply theme
        // tui.chart.registerTheme('myTheme', theme);
        // options.theme = 'myTheme';
        var chart = tui.chart.lineChart(container, data, options);
    } else if (chartDiv == "chart-area-postviewcount") {//포스트별 조회수 순위
        
        var container = document.getElementById(chartDiv);
        container.innerHTML = "";
        
        var table = document.createElement("table");
        table.classList.add("table");
        //var header = document.createElement("thead");
        var thead = document.createElement("thead");
        var thead_tr = document.createElement("tr");

        var thead_th0 = document.createElement("th");
        thead_th0.innerText = "순위";
        thead_tr.appendChild(thead_th0);

        var thead_th1 = document.createElement("th");
        thead_th1.innerText = "회사명";
        thead_tr.appendChild(thead_th1);

        var thead_th2 = document.createElement("th");
        thead_th2.innerText = "제목";
        
        thead_tr.appendChild(thead_th2);
        var thead_th3 = document.createElement("th");
        thead_th3.innerText = "조회수";
        thead_tr.appendChild(thead_th3);
        thead.appendChild(thead_tr);

        var tbody = document.createElement("tbody");
        for(var i = 0; i < inpData.length; ++i) {
            var tr = document.createElement("tr");
            var td0 = document.createElement("td");
            td0.innerText = inpData[i]["rownum"];
            tr.appendChild(td0);
            var td1 = document.createElement("td");
            td1.innerText = inpData[i]["blog_name"];
            tr.appendChild(td1);
            var td2 = document.createElement("td");
            td2.innerText = inpData[i]["title"];
            td2.setAttribute("onclick","moveTo('" + inpData[i]["post_url"] + "');");
            tr.appendChild(td2);
            var td3 = document.createElement("td");
            td3.innerText = inpData[i]["cnt"];
            tr.appendChild(td3);
            tbody.appendChild(tr);
        }
        table.appendChild(thead);
        table.appendChild(tbody);

        container.appendChild(table);
        
    } else {
        console.log("there is no chartDiv like " + chartDiv);
    }
    
};
//포스트별 조회수 request
var requestViewCount = function() {
    $.ajax({
        type: "post",
        url: "/statistics/viewcount",
        data: {},
        success: function(result) {
            console.log(result.data);
            loadChart("chart-area-postviewcount", result.data);
        },
        error: function(xhr, textStatus, errorThrown) {
            alert("request failed. \n" + xhr.status + " " + xhr.statusText);
        }
    });
}
//홈페이지 방문자수 request
var requestVisitors = function() {
    $.ajax({
        type: "post",
        url: "/statistics/visit",
        data: {},
        success: function(result) {
            console.log(result.data);
            loadChart("chart-area-visit", result.data);
            //chartTest();
        },
        error: function(xhr, textStatus, errorThrown) {
            alert("request failed.\n" + xhr.status + " " + xhr.statusText);
        }
    });
};