var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
   connectionLimit: 5,
    host : 'localhost',
    user : 'root',
    database : 'webshopping',
    password : 'ghktn9220'
});

router.get('/',function(req,res,next){
   pool.getConnection(function(err,connection){

       connection.query('select * from board',function(err,rows){
          if(err) console.error("err : " +err);
           console.log("rows : " + JSON.stringify(rows));

           res.render('index',{title: 'webshopping',rows:rows});
           connection.release();
       });
   });
});

module.exports = router;