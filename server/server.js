console.log('hej');
var http = require('http');
var fs = require('fs');
/*var DataLayer = require('./include/DataLayer').DataLayer;
var SiteStatus = require('./include/SiteStatus').SiteStatus;
var Slack = require('./include/Slack').Slack;

OPTV = (function(){
	
	var _dl;
	var _siteStatus;
	var _slack;
	
	
	function setShoutOut(){
		_slack.setShoutOut("user", "text", "date");
	}

	return {
		init: function(){
			_dl = new DataLayer();
            _siteStatus = new SiteStatus(_dl);
            _slack = new Slack(_dl);
		},
		getSiteStatus: function(callback){
			_siteStatus.getSiteStatus(function(sitesHistory){
				if(callback !== undefined && typeof(callback) === "function")
					callback(sitesHistory);
			});
		},
		getShoutOuts: function(callback){
			_slack.getShoutOuts(function(shoutOuts){
				if(callback !== undefined && typeof(callback) === "function")
					callback(shoutOuts);
			});
		}
	}
})();

OPTV.init();*/
//http.globalAgent.maxSockets = 25;
console.log('på dig');
http.createServer(function (req, res) {
    console.log('Listening on port 9615');
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
}).listen(9615, '127.0.0.1');
