var http = require('http'),
	Bot = require('slackbots'),
	Slack = require('./include/Slack').Slack,
	Helper = require('./include/Helper').Helper,
	DataLayer = require('./include/DataLayer').DataLayer,
	SiteStatus = require('./include/SiteStatus').SiteStatus,
	Slack = require('./include/Slack').Slack,
	Config = require('./include/Config').Config;

var _dl = new DataLayer(),
	_siteStatus = new SiteStatus(_dl),
	_helper = new Helper(),
	_bot = new Bot(Config.slack.settings),
	_slack = new Slack(_dl, _bot);

function getHighscore(callback){
	_slack.getHighscore(function(result){
		console.log(result);
	});
}

/*Run tests*/
getHighscore();