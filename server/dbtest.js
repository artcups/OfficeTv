var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
var check;
db.serialize(function() {

	db.run("CREATE TABLE if not exists user_info (info TEXT)");
	var stmt = db.prepare("INSERT INTO user_info VALUES (?)");
	for (var i = 0; i < 10; i++) {
		stmt.run("Ipsum " + i);
	}
	stmt.finalize();

	db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
		console.log(row.id + ": " + row.info);
	});
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