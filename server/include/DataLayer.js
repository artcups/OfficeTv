var sqlite = require('sqlite3').verbose();
var DataLayer = (function () {
	var _db;

	// Constructor
	function DataLayer() {
		_db = new sqlite.Database('data/db-optv.db');
		_db.serialize(function() {
            _db.run("CREATE TABLE if not exists tSlackUser (Id INTEGER PRIMARY KEY ASC, UserId INTEGER, UserName TEXT)", function(){
			});
			_db.run("CREATE TABLE if not exists tSiteStatus (Id INTEGER PRIMARY KEY ASC, Name TEXT, Url TEXT, StatusCode TEXT, ResponseTime INTEGER, Date INTEGER, SiteId INTEGER)", function(){
			});
			_db.run("CREATE TABLE if not exists tShoutOut (Id INTEGER PRIMARY KEY ASC, User TEXT, Text TEXT, Date INTEGER)", function(){
			});
            _db.run("CREATE TABLE if not exists tQuestionAnswer (Id INTEGER PRIMARY KEY ASC, Answer INTEGER, SlackUserId TEXT, QuestionId INTEGER, RequestTime INTEGER, AnswerTime INTEGER)", function(){
			});
		});
	}
	DataLayer.prototype = {
		dbDelete: function (query, callback, prameters){
			if(prameters !== undefined){
				_db.run(query, prameters, function(err) {
					callback();
				})
			}else{
				_db.run(query, function(err){
					callback();
				})
			}
		},

		dbPut: function (query, callback, prameters){
            
			if(prameters !== undefined){
				_db.run(query, prameters, function(err) {
					if (err)
						callback(err);
					else
						callback();
				})
			}else{
				_db.run(query, function(err){
					if (err)
						callback(err);
					else
						callback();
				})
			}
		},
		dbGetAll: function (query, callback, prameters){
			
			if(prameters !== undefined){
				var stmt = _db.prepare(query);
				var result = [];
                _db.each(query, prameters, function(err, row){
					if(err != null)
					{
						callback(err);
						return;
					}
					else
						result.push(row);
				}, function(err, rows){
					callback(result); return;
				})				
			}else{
				_db.all(query, function(err, rows){
					callback(rows); return;
				})
			};	
		}
	}
	//All public functions 604800000
	/*DataLayer.prototype = {
		setShoutOut: function(user, text, date, callback){
			var query = "INSERT INTO tShoutOut (User, Text, Date) VALUES ($User, $Text, $Date)";
			var params = { $user: user, $text: text, $date: date};
			dbPut(query, function(){
				if(callback !== undefined)
					callback();
			},params);
		},
		getShoutOuts: function(callback){
			var query = "SELECT User, Text, Date FROM tShoutOut";
			dbGetAll(query, function(shoutOuts){
				callback(shoutOuts);
			});
		}
	};*/

	return DataLayer;
})();

exports.DataLayer = DataLayer;

