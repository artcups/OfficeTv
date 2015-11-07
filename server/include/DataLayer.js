var sqlite = require('sqlite3').verbose();
var DataLayer = (function () {
	var _db;

	// Constructor
	function DataLayer() {
		_db = new sqlite.Database('data/db-optv.db');
		_db.serialize(function() {
			_db.run("CREATE TABLE if not exists tSiteStatus (Id INTEGER PRIMARY KEY ASC, Name TEXT, Url TEXT, StatusCode TEXT, ResponseTime INTEGER, Date INTEGER, SiteId INTEGER)", function(){
			});
			_db.run("CREATE TABLE if not exists tShoutOut (Id INTEGER PRIMARY KEY ASC, User TEXT, Text TEXT, Date INTEGER)", function(){
			});
		});
	}
	
	function dbDelete(query, callback, prameters){
		if(prameters !== undefined){
			_db.run(query, prameters, function(err) {
				callback();
			})
		}else{
			_db.run(query, function(err){
				callback();
			})
		}
	};

	function dbPut(query, callback, prameters){
		if(prameters !== undefined){
			_db.run(query, prameters, function(err) {
				callback();
			})
		}else{
			_db.run(query, function(err){
				callback();
			})
		}
	};
	function dbGetAll(query, callback, prameters){
		if(prameters !== undefined){
			_db.all(query, prameters, function(err, rows){
				callback(null, rows); return;
			})
		}else{
			_db.all(query, function(err, rows){
				callback(rows); return;
			})
		};
		
	};

	//All public functions 604800000
	DataLayer.prototype = {
		setSiteStatus : function(name, url, statusCode, responseTime, date, siteId, callback){
			var currTime = new Date().getTime();
			var deleteQuery = "DELETE FROM tSiteStatus WHERE $currTime - Date > 10000 AND SiteId = $siteId";
			var deleteParams = { $siteId: siteId, $currTime: currTime };
			dbDelete(deleteQuery, function(){
				var query = "INSERT INTO tSiteStatus (Name, Url, StatusCode, ResponseTime, Date, SiteId) VALUES ($name, $url, $statusCode, $responseTime, $date, $siteId)";
				var params = { $name: name, $url: url, $statusCode: statusCode, $responseTime: responseTime, $date: date, $siteId: siteId};
				dbPut(query, function(){
					if(callback !== undefined)
						callback();
				},params);
			}, deleteParams);
		},

		getSiteStatus : function(callback) {
			var query = "SELECT Name, Url, StatusCode, ResponseTime, Date, SiteId, (CURRENT_TIMESTAMP - Date) as Age FROM tSiteStatus";
			dbGetAll(query, function(rows){
				var sites = [];
				rows.forEach(function(site){
					if(sites[site.SiteId] === undefined){
						sites[site.SiteId] = {name: site.Name, url : site.Url, siteId: site.SiteId, history: [{date: site.Date, statusCode: site.StatusCode, responseTime: site.ResponseTime}]}
					}else{
						sites[site.SiteId].history.push({date: site.Date, statusCode: site.StatusCode, responseTime: site.ResponseTime})
					}
				})
				callback(sites);
			});
		},
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
	};

	return DataLayer;
})();

exports.DataLayer = DataLayer;

