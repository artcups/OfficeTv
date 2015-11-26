var config = require('./Config').Config,
	Helper = require('./Helper').Helper;

var Slack = (function(){
    var _dataLayer;
	var _bot;
	var _helper;
    
    function Slack(dataLayer, bot){
        _dataLayer = dataLayer;
		_bot = bot;
		_helper = new Helper();
    }
    function setShoutOut(user, text, date, callback){
        var query = "INSERT INTO tShoutOut (User, Text, Date) VALUES ($user, $text, $date)";
        var params = { $user: user, $text: text, $date: date};
        _dataLayer.dbPut(query, function(){
            if(callback !== undefined)
                callback();
        },params);
    }
	function getSlackUserFromUserId(id, callback){
		var users = _bot.getUsers();
			users._value.members.forEach(function(user){
				if (user.id == id)
					callback(user);
			});
		callback();
	}
	function randomInt (low, high) {
    	return Math.floor(Math.random() * (high - low) + low);
	}
    
	var actions = {
		shout: function(message, callback){
			getSlackUserFromUserId(message.user, function(user){
				if (!user)
				{
					console.log('User was not found?');
					return;
				}
				setShoutOut(user.real_name, message.text, new Date().getTime(), function(){
					var randomNbr = randomInt(0,5);
					var replyText = "";
					console.log(randomNbr);
					switch (randomNbr){
						case 0:
							replyText = _helper.bold(user.real_name) + " fullständigt skrek ut " + _helper.italic(message.text) + ".";
							break;
						case 1:
							replyText = _helper.bold(user.real_name) + " hade inget annat för sig utan bestämde sig för att ropa " + _helper.italic(message.text) + "!";
							break;
						case 2:
							replyText = "Oj, hörde ni också det där? " + _helper.bold(user.real_name) + " tyckte att alla i klassen skulle få veta att " + _helper.italic(message.text) + "!";
							break;
						case 3: 
							replyText = "Nämen, " + _helper.bold(user.real_name) + " då! Tycker du verkligen att " + _helper.italic(message.text) + "?";
							break;
						case 4:
							replyText = "Jaså, det är en sån dag idag!? " + _helper.bold(user.real_name) + " anser att " + _helper.italic(message.text) + "!";
							break;
						case 5:
							replyText = "Okej, " + _helper.bold(user.real_name) + ". Vi håller med om att " + _helper.italic(message.text) + ".";
							break;
						default:
							replyText = _helper.bold(user.real_name) + " ropade " + _helper.italic(message.text) + ".";
							break;
					}
                	callback(replyText);
            	});
			});
			
		},
		help: function(message, callback){
			callback("Actions: \n!help \n!shout")
		},
		today: function(message, callback){
			var questions = config.questions.questions;
			var theQuestion;
			questions.forEach(function(question){
				if (new Date(question.date).getDay() == new Date().getDay())
					theQuestion = question;
			});
			var text = "Ingen fråga idag :-(";
			if (theQuestion){
				text = _helper.italic(theQuestion.text) + " \n";
				var index = 1;
				theQuestion.options.forEach(function(option){
					text += "(" + index + ") " + _helper.bold(option.text) + "         ";
					index++;
				});
				text += "\n (svara genom att pm:a mig 1, 2 eller 3)";
			}
			callback(text);
		},
		beer: function(message, callback){
			getSlackUserFromUserId(message.user, function(user){
				if (user){
					var text = "";
					if (message.text != "")
						text = user.name + " slänger iväg en öl åt " + message.text + "'s håll! SKÅL! :beer:"; 
					else
						text = user.name + " är inte generös idag, utan behåller ölen för sig själv! :beer:"; 
					callback(text);
				}
			});
		},
		xmas: function(message, callback){
			getSlackUserFromUserId(message.user, function(user){
				if (user){
					var text = user.name + " önskar alla i kanalen en riktigt God Jul! :christmas_tree:"; 
					callback(text);
				}
			});
		},
		challenge: function(message, callback){
			getSlackUserFromUserId(message.user, function(user){
				if (user){
					var text = user.name + " utmanar " + _helper.bold(message.text) + "! Ses vid pingisbordet! :table_tennis_paddle_and_ball:"; 
					callback(text);
				}
			});
		},
	}
    
    Slack.prototype = {
		setShoutOut: function(user, text, date, callback){
			setShoutOut(user, text, date, function(){
                callback()
            });
		},
		getShoutOuts: function(callback){
			var query = "SELECT User, Text, Date FROM tShoutOut";
			_dataLayer.dbGetAll(query, function(shoutOuts){
				callback(shoutOuts);
			});
		},
        getNrShoutOuts: function(nr, callback){
			var query = "SELECT User, Text, Date FROM tShoutOut ORDER BY Date DESC LIMIT $limit";
            var params = { $limit: nr };
			_dataLayer.dbGetAll(query, function(shoutOuts){
				callback(shoutOuts);
			}, params);
		},
		getSlackUser: function (id, callback){
			getSlackUserFromUserId(id, function(user){
				callback(user);
			});
		},
        getSlackAction: function(message, callback){
			var text = message.text;
			if (text.indexOf('!') == 0)
			{
				var action = text.split(' ')[0].replace('!', '');
				message.text = text.replace("!" + action, '').trim();
				if(typeof actions[action] == "undefined")
				{
					return callback("Inget kommando. För en lista av kommandon skriv !help");
				}
				else
				{
					console.log(message);
					actions[action](message, callback); 
				}
			}
			return "";
		},
		
	};
    return Slack;
})()

exports.Slack = Slack;