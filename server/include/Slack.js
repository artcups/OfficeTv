var Slack = (function(){
    var _dataLayer;
    
    function Slack(dataLayer){
        _dataLayer = dataLayer;
    }
    
    DataLayer.prototype = {
		setShoutOut: function(user, text, date, callback){
			var query = "INSERT INTO tShoutOut (User, Text, Date) VALUES ($User, $Text, $Date)";
			var params = { $user: user, $text: text, $date: date};
			_dataLayer.dbPut(query, function(){
				if(callback !== undefined)
					callback();
			},params);
		},
		getShoutOuts: function(callback){
			var query = "SELECT User, Text, Date FROM tShoutOut";
			_dataLayer.dbGetAll(query, function(shoutOuts){
				callback(shoutOuts);
			});
		}
	};
    return Slack;
})()