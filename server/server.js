
var http = require('http');
var fs = require('fs');
var DataLayer = require('./include/DataLayer').DataLayer;

OPTV = (function(){
	
	var dl;
	var sites = [
		{id: 0, name: "Panduru", url : "www.pandurohobby.se", history: []},
		{id: 1, name: "Ikano DK", url : "www.ikanobank.dk", history: []}
	];


	function initCollectSiteStatus(){
		var interval = setInterval(function(){
			sites.forEach(function(element, key){
				var start = new Date();
				var request = http.get({host: element.url, path: "", port: 80, method: "GET", agent: false}, function(response){
					//element.history.push({time: new Date(), status: response.statusCode});
					dl.setSiteStatus(element.name, element.url, response.statusCode, new Date() - start, new Date().getTime(), element.id);
				});
				//request.close();
			})
		}, 10000);
	}

	return {
		init: function(){
			initCollectSiteStatus();
			dl = new DataLayer();
		},
		getSiteStatus: function(callback){
			dl.getSiteStatus(function(sitesHistory){
				if(callback !== undefined && typeof(callback) === "function")
					callback(sitesHistory);
			});
		}
	}
})();



OPTV.init();
//http.globalAgent.maxSockets = 25;

http.createServer(function (req, res) {
	switch (req.url){
		case '/':
			var fs = require('fs');
			var index = fs.readFileSync(__dirname+'/web/index.html');
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index);
			break;
		case '/api/siteStatus':
			res.writeHead(200, "OK", {"content-type": "text/json"});
			OPTV.getSiteStatus(function(siteHistory){
				res.end(JSON.stringify(siteHistory))
			})
			break;
		default:
			break;
	}
}).listen(9615);
