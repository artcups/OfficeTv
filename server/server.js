OPTV = (function(){
	var sites = [
		{name: "Panduru", url : "www.pandurohobby.se", history: []},
		{name: "Ikano DK", url : "www.ikanobank.dk", history: []}
	];

	function collectSiteStatus(){
		var interval = setInterval(function(){
			sites.forEach(function(element, key){
				var request = http.get({host: element.url, path: "", port: 80, method: "GET", agent: false}, function(response){
					element.history.push({time: new Date(), status: response.statusCode});
				});
				//request.close();
			})
		}, 10000);
	}

	return {
		init: function(){
			collectSiteStatus();
		},
		getSiteStatus: function(){
			return sites;
		}
	}
})()

var http = require('http');
var fs = require('fs');
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
			res.end(JSON.stringify(OPTV.getSiteStatus()));
			break;
		default:
			break;
	}
}).listen(9615);
