var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '123',
  database : 'ebay'
});
connection.connect(function(error){
  if(error)
    console.log('DB connection error');
  else {
    console.log('Connection successfull');
  }
});

module.exports = connection;
