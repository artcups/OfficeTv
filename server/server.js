var http = require('http'),
	fs = require('fs'),
	Bot = require('slackbots'),
	Slack = require('./include/Slack').Slack,
	Helper = require('./include/Helper').Helper,
	DataLayer = require('./include/DataLayer').DataLayer,
	SiteStatus = require('./include/SiteStatus').SiteStatus,
	Slack = require('./include/Slack').Slack,
	Config = require('./include/Config').Config;


OPTV = (function(){
	
	var _dl;
	var _siteStatus;
	var _slack;
	var _helper;
	var _bot;
	
	function setShoutOut(){
		_slack.setShoutOut("user", "text", "date");
	}

	return {
		init: function(){
			_dl = new DataLayer();
            _siteStatus = new SiteStatus(_dl);
			_helper = new Helper();
			_bot = new Bot(Config.slack.settings);
			_slack = new Slack(_dl, _bot);
			
			_bot.on('start', function() {
				_bot.postMessageToChannel('tv', 'Jag är tillbaka :)');
			});

			_bot.on('message', function(message) {
				console.log(message);
				if (message.type == 'user_typing')
				{
					/*slack.getSlackUser(_bot, message.user, function(user){
						if (user)
							bot.postMessage(message.channel, 'Jag ser minsann att du skriver ' + user.real_name);
					});*/
				}
				else if (message.type == 'message' && message.text)
				{
					_slack.getSlackAction(message, function handleSlackActionResponse(response){
						_bot.postMessage(message.channel ? message.channel : message.user, response);
					});
				}
			});
		},
		getSiteStatus: function(callback){
			_siteStatus.getSiteStatus(function(sitesHistory){
				if(callback !== undefined && typeof(callback) === "function")
					callback(sitesHistory);
			});
		},
		getShoutOuts: function(callback){
			_slack.getNrShoutOuts(11, function(shoutOuts){
				if(callback !== undefined && typeof(callback) === "function")
					callback(shoutOuts);
			});
		},
        slackAction: function(post, callback){
            _slack.getSlackAction(post, callback);
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
		case '/api/slack/getShoutOuts':
			res.writeHead(200, "OK", {"content-type": "text/json"});
			OPTV.getShoutOuts(function(shoutOuts){
				res.end(JSON.stringify(shoutOuts))
			})
			break;
        case '/api/slack/handleAction':
            var token = "a9TGmTDMitaAKCmWr83nzqnT";
            req.on('data', function(chunk) {
				postData = chunk;
			});
			
			req.on('end', function() {
                var post = _helper.parsePostData(postData);
                if(post.token == token){
                    console.log("Token correct");
                    OPTV.slackAction(post, function(actionRes){
						res.writeHead(200);
						res.end(JSON.stringify({"text": actionRes}));
					});
                }
			});
            break;
		case '/api/slack/putShoutOut':
			
			//console.log(res.body);
			var postData;
			
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
}).listen(5190, "0.0.0.0");
