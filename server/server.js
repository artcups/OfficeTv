var sqlite = require('sqlite3').verbose();
var DataLayer = (function () {
	var _db;

	// Constructor
	function DataLayer () {
		console.log(this)
		_db = new sqlite.Database('db-optv.db');
		_db.serialize(function() {
			_db.run("CREATE TABLE if not exists tSiteStatus (Id INTEGER PRIMARY KEY ASC, Name TEXT, Url TEXT, StatusCode TEXT, Date TEXT)", function(){
			});
		});
	}

	function dbPut(query, callback, prameters){
		if(prameters != undefined){
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
		if(prameters != undefined){
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
		setSiteStatus : function(name, url, statusCode, callback){
			var query = "INSERT INTO tSiteStatus (Name, Url, StatusCode) VALUES ($name, $url, $statusCode)";
			var params = { $name: name, $url: url, $statusCode: statusCode};
			dbPut(query, function(){
				callback();
			},params);
		},

		getSiteStatus : function(callback) {
			var query = "SELECT * FROM tSiteStatus";
			dbGetAll(query, function(rows){
				callback(rows);
			});
		}
	};

	return DataLayer;
})();

OPTV = (function(){

	var dl = new DataLayer();
	dl.setSiteStatus("test", "testurl", "200", function(){
			dl.getSiteStatus(function(rows){
				console.log(rows)
			})
		}
	);


	var sites = [
		{name: "Panduru", url : "www.pandurohobby.se", history: []},
		{name: "Ikano DK", url : "www.ikanobank.dk", history: []}
	];


	function collectSiteStatus(){
		var interval = setInterval(function(){
			sites.forEach(function(element, key){
				var request = http.get({host: element.url, path: "", port: 80, method: "GET", agent: false}, function(response){
					element.history.push({time: new Date(), status: response.statusCode});
				});
				//request.close();
			})
		}, 10000);
	}

	return {
		init: function(){
			collectSiteStatus();
		},
		getSiteStatus: function(){
			return sites;
		}
	}
})();

var http = require('http');
var fs = require('fs');

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
			res.writeHead(200, "OK", {"content-type": "text/json"});
			res.end(JSON.stringify(OPTV.getSiteStatus()));
			break;
		default:
			break;
	}
}).listen(9615);
