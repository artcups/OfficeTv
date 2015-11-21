TV.generalAttributes = {
    chartOptions : {
        xaxis:{
        mode: "number",
        show: false,

    },
    yaxis: {
        mode: "number",
        show: false,
    },
    grid: {
        //backgroundColor: { colors: [ "transparent", "#eee" ] },
        borderWidth: 0,
        margin: {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        axisMargin: 0,
        minBorderMargin: 0
    },
    series: {
        lines: { show: true, fill: true, fillColor:  "rgba(122, 125, 136, 0.30)" },
        points: { show: false }
    },
        colors: [ "rgba(122, 125, 136, 0.4)"]
    }
};
function initCountdown(){
    var eta = new Date(2016, 06, 03, 22, 20, 0);
    var now = new Date();
    var mlmDiff = parseInt((eta-now)/1000);
    $("#mlm-op").html(mlmDiff);
    var interval = setInterval(function(){
        mlmDiff--;
        $("#mlm-op").html(mlmDiff);
    }, 1000);
}
function renderCharts(){
    OP.apiGetData("siteStatus", function(res){
        var sites = $("#sites").find(".site");
        $.each(res, function(){
            var newSite = this;
            var exists = false;
            $.each(sites, function(){
                if($(this).data("siteId") == newSite.siteId)
                    exists = true;
            });

            var maxResponseTime = 0;
            var minResponseTime = 0;
            var lastStatus = false;
            var data = [];

            $.each(newSite.history, function(key, history){
                maxResponseTime = history.responseTime > maxResponseTime ? history.responseTime : maxResponseTime
                minResponseTime = history.responseTime < minResponseTime || minResponseTime == 0 ? history.responseTime : minResponseTime;
                lastStatus = history.statusCode;
                data.push([key, history.responseTime])
            })

            if(exists)
                var chart = $("chart"-newSite.SiteId);
            else{
                var li = $("<li/>", {class: "site"}).data("siteId", newSite.siteId);
                $("<span/>").text(newSite.name).appendTo(li);
                $("<span/>", {class: "pull-right status"}).append(
                    $("<span/>").text(minResponseTime),
                    $("<span/>").text(maxResponseTime),
                    $("<span/>").text(lastStatus)
                ).appendTo(li)

                var chart = $("<div/>", {class: "chart", id:"chart-" + newSite.siteId}).appendTo(li);;

                $("#sites").append(li);
            }
            chart.plot([data], TV.generalAttributes.chartOptions).data("plot");
            if($(".site").length > 0)
                $(".loading").remove()
        });
    })
}
function init(){
    initCountdown();
    renderCharts();
    var interval = setInterval(function(){
        renderCharts();
    }, 10000);
}
$(document).ready(function(){
    init();
});
