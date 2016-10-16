var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host : 'localhost',
  user : 'root',
  password : '123',
  database : 'ebay'
});

pool.getConnection(function(err, connection) {
  if(err)
    console.log(err);
  else {
    console.log("Connection successfull");
  }
});
module.exports = pool;
