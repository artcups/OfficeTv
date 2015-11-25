var Slack = (function(){
    var _dataLayer;
    
    function Slack(dataLayer){
        _dataLayer = dataLayer;
    }
    function setShoutOut(user, text, date, callback){
        var query = "INSERT INTO tShoutOut (User, Text, Date) VALUES ($user, $text, $date)";
        var params = { $user: user, $text: text, $date: date};
        _dataLayer.dbPut(query, function(){
            if(callback !== undefined)
                callback();
        },params);
    }
    
	var actions = {
		shout: function(post, callback){
			setShoutOut(post.user_name, post.text, new Date().getTime(), function(){
                callback(post.user_name + " ropade upp på tvn")
            })
		},
		help: function(callback){
			callback("Actions: \n!help \n!shout")
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
        getSlackAction: function(post, callback){
            post.text = decodeURIComponent(post.text);
            post.trigger_word = decodeURIComponent(post.trigger_word);
            if(post.text.indexOf(post.trigger_word) != -1){
				var action = "";
				var action = post.text.substr(0, post.text.indexOf("+"));
				if(action == "")
					action = text.replace(post.trigger_word, "");
                
                action = action.replace(post.trigger_word, "");
                post.text = post.text.replace(action, "");
                post.text = post.text.replace(post.trigger_word, "");
                post.text = post.text.replace("+", " ").trim();
				if(typeof actions[action] == "undefined")
					return callback("Ingen kommando. För en lista av kommandon skriv !help");
				else
					actions[action](post, callback);
			}
                return "";
        }
	};
    return Slack;
})()

exports.Slack = Slack;