
var Bot = require('slackbots'),
	Slack = require('./include/Slack').Slack,
	Config = require('./include/Config').Config;
console.log(Config.slack.settings);
var bot = new Bot(Config.slack.settings);
var slack = new Slack();

bot.on('start', function() {
    bot.postMessageToChannel('tv', 'Jag är tillbaka :)');
});

bot.on('message', function(message) {
	console.log(message);
	if (message.type == 'user_typing')
	{
		slack.getSlackUserFromId(bot, message.user, function(user){
			if (user)
				bot.postMessage(message.channel, 'Jag ser minsann att du skriver ' + user.real_name);
		});
	}
	if (message.type == 'message' && message.text)
	{
		slack.getSlackAction(message, function handleSlackActionResponse(response){
			bot.postMessage(message.channel ? message.channel : message.user, response);
		});
	}
});