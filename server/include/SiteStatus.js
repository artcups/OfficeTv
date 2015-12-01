var http = require('http');

var SiteStatus = (function(){
    var _dataLayer;
    var _sites = [
		{id: 0, name: "Panduru", url : "www.pandurohobby.se", history: []},
		{id: 1, name: "Ikano DK", url : "ikanobank.dk", history: []},
		{id: 2, name: "Gleerupsportal", url : "gleerupsportal.se/login/", history: []}
	];
    
    function SiteStatus(dataLayer){
        _dataLayer = dataLayer;
        collectSiteStatus();
    }
    
    function setSiteStatus(name, url, statusCode, responseTime, date, siteId, callback){
        var currTime = new Date().getTime();
        var deleteQuery = "DELETE FROM tSiteStatus WHERE $currTime - Date > 609600000 AND SiteId = $siteId";
        var deleteParams = { $siteId: siteId, $currTime: currTime };
        _dataLayer.dbDelete(deleteQuery, function(){
            var query = "INSERT INTO tSiteStatus (Name, Url, StatusCode, ResponseTime, Date, SiteId) VALUES ($name, $url, $statusCode, $responseTime, $date, $siteId)";
            var params = { $name: name, $url: url, $statusCode: statusCode, $responseTime: responseTime, $date: date, $siteId: siteId};
            _dataLayer.dbPut(query, function(){
                if(callback !== undefined)
                    callback();
            },params);
        }, deleteParams);
    }
    
    function collectSiteStatus(){
        var interval = setInterval(function(){
			_sites.forEach(function(element, key){
				var start = new Date();
				var request = http.get({host: element.url, path: "", port: 80, method: "GET", agent: false}, function(response){
					setSiteStatus(element.name, element.url, response.statusCode, new Date() - start, new Date().getTime(), element.id);
				});
			})
		}, 60000);
    }
    SiteStatus.prototype = {
        getSiteStatus : function(callback) {
			var query = "SELECT Name, Url, StatusCode, ResponseTime, Date, SiteId, (CURRENT_TIMESTAMP - Date) as Age FROM tSiteStatus";
			_dataLayer.dbGetAll(query, function(rows){
				var sites = [];
				rows.forEach(function(site){
					if(sites[site.SiteId] === undefined){
						sites[site.SiteId] = {name: site.Name, url : site.Url, siteId: site.SiteId, history: [{date: site.Date, statusCode: site.StatusCode, responseTime: site.ResponseTime}]}
					}else{
						sites[site.SiteId].history.push({date: site.Date, statusCode: site.StatusCode, responseTime: site.ResponseTime})
					}
				})
				callback(sites);
			});
		}
    }
    
    return SiteStatus;
})()

exports.SiteStatus = SiteStatus;



function initCollectSiteStatus(){
		
	}