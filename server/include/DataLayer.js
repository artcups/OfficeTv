var sqlite = require('sqlite3').verbose();
var DataLayer = (function () {
	var _db;

	// Constructor
	function DataLayer () {
		_db = new sqlite.Database('data/db-optv.db');
		_db.serialize(function() {
			_db.run("CREATE TABLE if not exists tSiteStatus (Id INTEGER PRIMARY KEY ASC, Name TEXT, Url TEXT, StatusCode TEXT, ResponseTime INTEGER, Date INTEGER, SiteId INTEGER)", function(){
			});
		});
	}

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

	//All public functions
	DataLayer.prototype = {
		setSiteStatus : function(name, url, statusCode, responseTime, date, siteId, callback){
			var query = "INSERT INTO tSiteStatus (Name, Url, StatusCode, ResponseTime, Date, SiteId) VALUES ($name, $url, $statusCode, $responseTime, $date, $siteId)";
			var params = { $name: name, $url: url, $statusCode: statusCode, $responseTime: responseTime, $date: date, $siteId: siteId};
			dbPut(query, function(){
				if(callback !== undefined)
					callback();
			},params);
		},

		getSiteStatus : function(callback) {
			var query = "SELECT Name, Url, StatusCode, ResponseTime, Date, SiteId FROM tSiteStatus";
			dbGetAll(query, function(rows){
				var sites = [];
				rows.forEach(function(site){
					if(sites[site.SiteId] === undefined){
						sites[site.SiteId] = {name: site.Name, url : site.Url, history: [{date: site.Date, statusCode: site.StatusCode, responseTime: site.ResponseTime}]}
					}else{
						sites[site.SiteId].history.push({date: site.Date, statusCode: site.StatusCode, responseTime: site.ResponseTime})
					}
				})
				callback(sites);
			});
		}
	};

	return DataLayer;
})();

exports.DataLayer = DataLayer;

