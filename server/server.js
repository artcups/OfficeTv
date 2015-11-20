
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
					dl.setSiteStatus(element.name, element.url, response.statusCode, new Date() - start, new Date().getTime(), element.id);
				});
			})
		}, 1000);
	}
	
	function setShoutOut(){
		dl.setShoutOut("user", "text", "date");
	}

	return {
		init: function(){
			dl = new DataLayer();
			initCollectSiteStatus();
		},
		getSiteStatus: function(callback){
			dl.getSiteStatus(function(sitesHistory){
				if(callback !== undefined && typeof(callback) === "function")
					callback(sitesHistory);
			});
		},
		getShoutOuts: function(callback){
			dl.getShoutOuts(function(shoutOuts){
				if(callback !== undefined && typeof(callback) === "function")
					callback(shoutOuts);
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
			//Origin only for debugging purpous
			res.writeHead(200, "OK", {
				"content-type": "text/json"
				
			});
			
			OPTV.getSiteStatus(function(siteHistory){
				res.end(JSON.stringify(siteHistory))
			})
			break;
		case '/api/shoutOuts':
			res.writeHead(200, "OK", {"content-type": "text/json"});
			OPTV.getShoutOuts(function(shoutOuts){
				res.end(JSON.stringify(shoutOuts))
			})
			break;
		case '/api/slack/putShoutOut':
			var token = "a9TGmTDMitaAKCmWr83nzqnT";
			req.on('data', function (chunk) {
				body += chunk;
			});
			req.on('end', function () {
				console.log('POSTed: ' + body);
				//res.writeHead(200);
				//res.end(postHTML);
			});
			break;
		default:
			var fs = require('fs');
			if (fs.existsSync(__dirname+'/web/'+req.url)) {
        		var index = fs.readFileSync(__dirname+'/web/'+req.url);
				res.writeHead(200);
				res.end(index);
    			}
			else	{
				res.writeHead(404);
				res.end();
			}
			break;
	}
}).listen(9615);
