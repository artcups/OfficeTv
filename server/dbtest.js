/*var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
var check;*/

var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('db-optv.db');
db.serialize(function() {
	db.run("CREATE TABLE if not exists user_info (info TEXT)");
});
db.close();

//SQL operations
/*//Load modules
 var sqlite3         =       require('sqlite3').verbose();
 var db              =       new sqlite3.Database('./database_name.db');

 //Perform SELECT Operation
 db.all("SELECT * from blah blah blah where this="+that,function(err,rows){
 //rows contain values while errors, well you can figure out.
 });

 //Perform INSERT operation.
 db.run("INSERT into table_name(col1,col2,col3) VALUES (val1,val2,val3)");

 //Perform DELETE operation
 db.run("DELETE * from table_name where condition");

 //Perform UPDATE operation
 db.run("UPDATE table_name where condition");*/