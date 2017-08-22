var express = require('express');
var router = express.Router();
var passport = require('passport');
var mysql =require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'webshopping',
    password: '1234'
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.send(403);
    }
}
/* GET home page. */
router.get('/', function(req, res, next){
    res.redirect('/mainweb/main');
});

router.get('/main',function(req,res,next){
    pool.getConnection(function(err,connection){
		var sqlforMain = "select item_seq, item_name, price, image from item Order By accum DESC";
		connection.query(sqlforMain, function(err, rows){
			if(err) console.error("err : " + err);
			console.log("rows : " + JSON.stringify(rows));
			res.render('main', {isAuthenticated : req.isAuthenticated(),user: req.user, rows: rows});
			connection.release();
		});
	});
	
});

router.get('/sell_board',function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var op= req.param('opt');
    var id = req.user.id;

    if(req.user.identity != "판매자")
    {
        res.send("<script>alert('판매자가 아닙니다.'); history.back();</script>");
    }

    pool.getConnection(function(err,connection){
       var sqlsearchby;
       if(op=="item_seq"){
           sqlsearchby = "select item_seq, item_name, price, image from item where item.seller_id='"+id+"' and item_seq='"+op+"'";
            connection.query(sqlsearchby,function(err,rows){
                if(err) console.error(err);
                console.log("rows : ",rows);
                res.render('sell_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
       }
        if(op=="item_name"){
            sqlsearchby = "select item_seq, item_name, price, image from item where item.seller_id='"+id+"' and item_name='"+op+"'";
            connection.query(sqlsearchby,function(err,rows){
                if(err) console.error(err);
                console.log("rows : ",rows);
                res.render('sell_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else {
            sqlsearchby="select item_seq, item_name, price, image from item where item.seller_id='"+id+"'";
            connection.query(sqlsearchby,function (err,rows) {
                if(err) console.error(err);
                console.log("rows : ",rows);
                res.render('sell_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
    });
});

router.get('/sell_board/sell_board_read/:item_seq', function(req,res,next){
    var seq = req.params.item_seq;
    //var hit = req.params.hit;
    console.log(seq);
    pool.getConnection(function(err,connection){
            
            var sql = "select * from item where item_seq=?";
            connection.query(sql,[seq], function(err,row2){
                if(err) console.error(err);
                console.log("1개 상품 조회 결과 확인 : ",row2);
                res.render('sell_board_read', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, row2:row2[0]});
                    connection.release();
            });
    });
});

router.get('/item_list', function(req, res, next){
	//var category = req.params.category1;

	pool.getConnection(function(err, connection){
		var sqlforlist = "select item_seq, item_name, price, image, category1 from item where category1 = " + "'" + req.query.category1 + "'";
		connection.query(sqlforlist, function(err, rows){
			if(err) console.error("err : " + err);
			console.log("rows : " + JSON.stringify(rows));

			res.render('item_list', {isAuthenticated : req.isAuthenticated(),
               user: req.user, rows: rows});
			connection.release();
		});
	});
});

router.get('/item_info', function(req, res, next){
	pool.getConnection(function(err, connection){
		var sqlforItemInfo = "select item_name, price, image, image2, category1 from item where item_seq =" + req.query.item_seq;
		connection.query(sqlforItemInfo, function(err, rows){
			if(err) console.error("err : " + err);
			console.log("rows : " + JSON.stringify(rows));

			res.render('item_info', {isAuthenticated : req.isAuthenticated(),
               user: req.user, rows: rows});
			connection.release();
		});
	});
});
router.post('/item_info', function(req,res,next){
    var id = req.user.id;
    var price = "10000";
    var item_number = req.body.item_number;
    var color = req.body.color1;
    var size = req.body.size1;
    var order_seq = "1234";
    var order_price="10000"
    var datas = [id,price,item_number,color,size,order_seq,order_price];
    console.log(datas);

    pool.getConnection(function (err, connection){
        var sqlForInsertBoard = "insert into qna_board(id,price,item_number,color,size,order_seq,order_price,) values(?,?,?,?,?,?,?,?)";
        connection.query(sqlForInsertBoard,datas,function(err,rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));
            res.redirect('/mainweb/cart');
            connection.release();
        });
    });
});

router.get('/qna_board',function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var opt = req.param('opt');
    var sc = req.param('sc');
    //var datas = [id,content,title];

   pool.getConnection(function (err,connection) {
       var sqlsearchby;
       if(opt == "title") {
           sqlsearchby = "select * from qna_board where title= '" +sc+"'";
           connection.query(sqlsearchby, function (err, rows) {
               if (err) console.error("err : " + err);
               console.log("rows : " + JSON.stringify(rows));
               // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
               //   user: req.user, row: row[0]});
               res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                   user: req.user, rows: rows});
               connection.release();
           });
       }
       else if(opt=="id")
       {
           sqlsearchby = "select * from qna_board where id='" +sc+"'";
           connection.query(sqlsearchby, function (err, rows) {
               if (err) console.error("err : " + err);
               console.log("rows : " + JSON.stringify(rows));
               // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
               //   user: req.user, row: row[0]});
               res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                   user: req.user, rows: rows});
               connection.release();
           });
       }
       else if(opt=="content")
       {
           sqlsearchby = "select * from qna_board where content='" +sc+"'";
           connection.query(sqlsearchby, function (err, rows) {
               if (err) console.error("err : " + err);
               console.log("rows : " + JSON.stringify(rows));
               // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
               //   user: req.user, row: row[0]});
               res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                   user: req.user, row: rows});
              connection.release();
           });
       }
       else {
           var sqlforboard = "select idx,id,title,hit,file from qna_board";
           connection.query(sqlforboard,function(err,rows){
               if (err) console.error("err : " + err);
               console.log("rows : " + JSON.stringify(rows));

               res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                   user: req.user, rows: rows});
               connection.release();
           });
       }
   });
});

router.get('/qna_board/order_idx',function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var opt = req.param('opt');
    var sc = req.param('sc');
    //var datas = [id,content,title];

    pool.getConnection(function (err,connection) {
        var sqlsearchby;
        if(opt == "title") {
            sqlsearchby = "select * from qna_board where title= '" +sc+"' order by idx";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="id")
        {
            sqlsearchby = "select * from qna_board where id='" +sc+"' order by idx";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="content")
        {
            sqlsearchby = "select * from qna_board where content='" +sc+"' order by idx";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, row: rows});
                connection.release();
            });
        }
        else {
            var sqlforboard = "select idx,id,title,hit,file from qna_board order by idx";
            connection.query(sqlforboard,function(err,rows){
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));

                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
    });
});

router.get('/qna_board/order_title',function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var opt = req.param('opt');
    var sc = req.param('sc');
    //var datas = [id,content,title];

    pool.getConnection(function (err,connection) {
        var sqlsearchby;
        if(opt == "title") {
            sqlsearchby = "select * from qna_board where title= '" +sc+"' order by title";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="id")
        {
            sqlsearchby = "select * from qna_board where id='" +sc+"' order by title";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="content")
        {
            sqlsearchby = "select * from qna_board where content='" +sc+"' order by title";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, row: rows});
                connection.release();
            });
        }
        else {
            var sqlforboard = "select idx,id,title,hit,file from qna_board order by title";
            connection.query(sqlforboard,function(err,rows){
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));

                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
    });
});

router.get('/qna_board/order_id',function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var opt = req.param('opt');
    var sc = req.param('sc');
    //var datas = [id,content,title];

    pool.getConnection(function (err,connection) {
        var sqlsearchby;
        if(opt == "title") {
            sqlsearchby = "select * from qna_board where title= '" +sc+"' order by id";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="id")
        {
            sqlsearchby = "select * from qna_board where id='" +sc+"' order by id";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="content")
        {
            sqlsearchby = "select * from qna_board where content='" +sc+"' order by id";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, row: rows});
                connection.release();
            });
        }
        else {
            var sqlforboard = "select idx,id,title,hit,file from qna_board order by id";
            connection.query(sqlforboard,function(err,rows){
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));

                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
    });
});

router.get('/qna_board/order_date',function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var opt = req.param('opt');
    var sc = req.param('sc');
    //var datas = [id,content,title];

    pool.getConnection(function (err,connection) {
        var sqlsearchby;
        if(opt == "title") {
            sqlsearchby = "select * from qna_board where title= '" +sc+"' order by date";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="id")
        {
            sqlsearchby = "select * from qna_board where id='" +sc+"' order by date";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="content")
        {
            sqlsearchby = "select * from qna_board where content='" +sc+"' order by date";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, row: rows});
                connection.release();
            });
        }
        else {
            var sqlforboard = "select idx,id,title,hit,file from qna_board order by date";
            connection.query(sqlforboard,function(err,rows){
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));

                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
    });
});

router.get('/qna_board/order_hit',function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var opt = req.param('opt');
    var sc = req.param('sc');
    //var datas = [id,content,title];

    pool.getConnection(function (err,connection) {
        var sqlsearchby;
        if(opt == "title") {
            sqlsearchby = "select * from qna_board where title= '" +sc+"' order by hit";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="id")
        {
            sqlsearchby = "select * from qna_board where id='" +sc+"' order by hit";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="content")
        {
            sqlsearchby = "select * from qna_board where content='" +sc+"' order by hit";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('qna_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, row: rows});
                connection.release();
            });
        }
        else {
            var sqlforboard = "select idx,id,title,hit,file from qna_board order by hit";
            connection.query(sqlforboard,function(err,rows){
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));

                res.render('qna_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
    });
});

router.get('/joinForm', function(req, res, next) {
    res.render('joinForm',{isAuthenticated : req.isAuthenticated(),
        user: req.user});
});

router.get('/login',function(req,res,next){
    res.render('login',{isAuthenticated : req.isAuthenticated(),
        user: req.user, loginMessage : req.flash('message')});
});

router.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    res.clearCookie('secret');
    // connection.release();
    res.redirect('/mainweb/main');
});

router.post('/login', passport.authenticate('local'),function(req, res, next){
    var iden = req.body.identity;
   
    pool.getConnection(function (err,connection) {
       if(iden=="구매자") {
           var checkidentity = "select identity from user where id='"+req.user.id+"'";
           connection.query(checkidentity,function (err,rows) {
            console.log("rows:" ,rows);
            if(rows[0].identity=="구매자"){
               res.redirect('/mainweb/main');
               connection.release();
            }
            else
            {
                res.redirect('/mainweb/login');
                connection.release();
            }
           });
       }
       else if(iden=="판매자"){
           var checkidentity = "select identity from user where id='"+req.user.id+"'";
           connection.query(checkidentity,function (err,rows) {
            console.log("rows:" ,rows);
            console.log(rows[0].identity);
            if(rows[0].identity =="판매자"){   
               res.redirect('/mainweb/main');
               connection.release();
            }
            else{
                res.redirect('/mainweb/login');
                connection.release();
            }
           });
       }
       if(iden=="관리자"){
           var checkidentity = "select identity from user where id='"+req.user.id+"'";
           connection.query(checkidentity,function (err,rows) {
            console.log("rows:" ,rows);
            if(rows[0].identity =="관리자"){   
               res.redirect('/mainweb/main');
               connection.release();
           }
           else{
                res.redirect('/mainweb/login');
               connection.release();
           }
           });
       }
    });
});

router.get('/joinnext',function(req,res,next){
   res.render('joinnext',{isAuthenticated : req.isAuthenticated(),
       user: req.user});
});

router.post('/joinnext',function(req,res,next){
   res.redirect('/mainweb/login');
});

router.post('/joinForm', function(req,res,next){

    var id = req.body.id;
    var passwd = req.body.passwd;
    var name = req.body.name;
    var email = req.body.email;
    var gender = req.body.gender;
    var phone = req.body.phone;
    var address = req.body.address;
    var birth = req.body.birth;
    var identity = req.body.identity;
    var datas = [id,passwd,name,email,gender,phone,address,birth,identity];

    pool.getConnection(function (err, connection)
    {// Use the connection
        var sqlForInsert = "insert into user(id, passwd, name, email,gender, phone, address, birth, identity) values(?,?,?,?,?,?,?,?,?)";
        connection.query(sqlForInsert,datas, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));
            res.redirect('/mainweb/joinnext');
            connection.release();
            // Don't use the connection here, it has been returned to the pool.
        });
    });
});

router.get('/write_error', function(req,res,next){
    res.render('write_error',{isAuthenticated : req.isAuthenticated(),
        user: req.user});
});

router.post('/write_error',function(req,res,next){
   res.redirect('/mainweb/login'); 
});

router.get('/qna_board/qna_write', function(req,res,next){
    res.render('qna_write',{isAuthenticated : req.isAuthenticated(),
        user: req.user});
});

router.get('/qna_board/qna_write', function(req,res,next){
    res.render('qna_write',{isAuthenticated : req.isAuthenticated(),
        user: req.user});
});

router.post('/qna_board/qna_write', function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var id = req.user.id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var file = req.body.file;
    var datas = [id,title,content,passwd,file];

    pool.getConnection(function (err, connection){
        var sqlForInsertBoard = "insert into qna_board(id,title, content, passwd, file, qna_date) values(?,?,?,?,?,now())";
        connection.query(sqlForInsertBoard,datas,function(err,rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));
            res.redirect('/mainweb/qna_board');
            connection.release();
        });
    });
});

router.get('/qna_board/qna_read/:idx', function(req,res,next){
    var idx = req.params.idx;
    var hit = req.params.hit;

    pool.getConnection(function(err,connection){
        var sql = "update qna_board set hit=hit+1 where idx=?";
        connection.query(sql,[idx], function(err,row1){
            if(err) console.error(err);
            console.log("조회수 업데이트 : ", row1);
            sql = "select idx, id, title, content, hit, file from qna_board where idx=?";
            connection.query(sql,[idx], function(err,row2){
                if(err) console.error(err);
                console.log("1개 글 조회 결과 확인 : ",row2);
                var sqlcomment = "select qna_comment.* from qna_comment where qna_comment.board_idx='"+req.params.idx+"'";
                connection.query(sqlcomment,[idx],function(err,row3){
                    if(err) console.error(err);
                    console.log("1개 댓글 조회 결과 확인 : ",row3);
                    res.render('qna_read', {isAuthenticated : req.isAuthenticated(),
                        user: req.user, row3:row3, row2:row2[0]});
                    connection.release();
                });
            });

        });
    });
});

router.get('/qna_board/qna_delete',function(req,res,next){
    var idx = req.query.idx;

    pool.getConnection(function(err,connection){
        if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

        var sql = "select idx, id, title, content, hit , file from qna_board where idx=?";
        connection.query(sql,[idx], function(err,row){
            if(err) console.error(err);
            console.log("Delete에서 1개 글 조회 결과 확인 : ",row);
            res.render('qna_delete', {isAuthenticated : req.isAuthenticated(),
                user: req.user, row:row[0]});
            connection.release();
        });
    });
});


router.post('/qna_board/qna_delete', function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var idx = req.body.idx;
    var id = req.body.id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var file = req.body.file;
    var datas = [id,title,content,passwd,file];

    pool.getConnection(function(err,connection){
        var sql = "delete from qna_board where idx=? and passwd=?";
        connection.query(sql,[idx, passwd], function(err,result){
            console.log(result);
            if(err) console.error("글 수정 중 에러 발생 err : ",err);

            if(result.affectedRows == 0){
                res.send("<srcipt>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 삭제되지 않습니다.');history.back();</srcipt>");
            }
            else {
                res.redirect('/mainweb/qna_board');
            }
            connection.release();
        });
    });
});


router.get('/qna_board/qna_update',function(req,res,next){
    var idx = req.query.idx;

    pool.getConnection(function(err,connection){
        if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

        var sql = "select * from qna_board where idx=?";
        connection.query(sql,[idx], function(err,row){
            if(err) console.error(err);
            console.log("update에서 1개 글 조회 결과 확인 : ",row);
            res.render('qna_update', {isAuthenticated : req.isAuthenticated(),
                user: req.user, row:row[0]});
            connection.release();
        });
    });
});

router.post('/qna_board/qna_update', function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var idx = req.body.idx;
    var id = req.body.id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var file = req.body.file;
    var datas = [title, content, file, idx, passwd];

    console.log(datas);
    pool.getConnection(function(err,connection){
        var sql = "update qna_board set title=?, content=?, file=?, qna_date=now() where idx=? and passwd=?";
        connection.query(sql,[title, content, file, idx, passwd], function(err,result){
            console.log(result);
            if(err) console.error("글 수정 중 에러 발생 err : ",err);

            if(result.affectedRows == 0){
                res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
            }
            else{
            res.redirect('/mainweb/qna_board/qna_read/' + idx);
            }
            connection.release();
        });
    });
});

router.get('/info_board',function(req,res,next){
    var opt = req.param('opt');
    var sc = req.param('sc');
    //var datas = [id,content,title];

    pool.getConnection(function (err,connection) {
        var sqlsearchby;
        if(opt == "title") {
            sqlsearchby = "select * from info_board where title= '" +sc+"'";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="id")
        {
            sqlsearchby = "select * from info_board where id='" +sc+"'";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="content")
        {
            sqlsearchby = "select * from info_board where content='" +sc+"'";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, row: rows});
                connection.release();
            });
        }
        else {
            var sqlforboard = "select * from info_board";
            connection.query(sqlforboard,function(err,rows){
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));

                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
    });
});

router.get('/info_board/info_idx',function(req,res,next){
    var opt = req.param('opt');
    var sc = req.param('sc');
    //var datas = [id,content,title];

    pool.getConnection(function (err,connection) {
        var sqlsearchby;
        if(opt == "title") {
            sqlsearchby = "select * from info_board where title= '" +sc+"' order by idx";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="id")
        {
            sqlsearchby = "select * from info_board where id='" +sc+"' order by idx";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="content")
        {
            sqlsearchby = "select * from info_board where content='" +sc+"' order by idx";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, row: rows});
                connection.release();
            });
        }
        else {
            var sqlforboard = "select * from info_board order by idx";
            connection.query(sqlforboard,function(err,rows){
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));

                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
    });
});

router.get('/info_board/info_title',function(req,res,next){
    var opt = req.param('opt');
    var sc = req.param('sc');
    //var datas = [id,content,title];

    pool.getConnection(function (err,connection) {
        var sqlsearchby;
        if(opt == "title") {
            sqlsearchby = "select * from info_board where title= '" +sc+"' order by title";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="id")
        {
            sqlsearchby = "select * from info_board where id='" +sc+"' order by title";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="content")
        {
            sqlsearchby = "select * from info_board where content='" +sc+"' order by title";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, row: rows});
                connection.release();
            });
        }
        else {
            var sqlforboard = "select * from info_board order by title";
            connection.query(sqlforboard,function(err,rows){
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));

                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
    });
});

router.get('/info_board/info_date',function(req,res,next){
    var opt = req.param('opt');
    var sc = req.param('sc');
    pool.getConnection(function (err,connection) {
        var sqlsearchby;
        if(opt == "title") {
            sqlsearchby = "select * from info_board where title= '" +sc+"' order by date";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="id")
        {
            sqlsearchby = "select * from info_board where id='" +sc+"' order by date";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="content")
        {
            sqlsearchby = "select * from info_board where content='" +sc+"' order by date";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, row: rows});
                connection.release();
            });
        }
        else {
            var sqlforboard = "select * from info_board order by date";
            connection.query(sqlforboard,function(err,rows){
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));

                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
    });
});

router.get('/info_board/info_hit',function(req,res,next){
    var opt = req.param('opt');
    var sc = req.param('sc');
    //var datas = [id,content,title];

    pool.getConnection(function (err,connection) {
        var sqlsearchby;
        if(opt == "title") {
            sqlsearchby = "select * from info_board where title= '" +sc+"' order by hit";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="id")
        {
            sqlsearchby = "select * from info_board where id='" +sc+"' order by hit";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
        else if(opt=="content")
        {
            sqlsearchby = "select * from info_board where content='" +sc+"' order by hit";
            connection.query(sqlsearchby, function (err, rows) {
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));
                // res.render('info_board',{isAuthenticated : req.isAuthenticated(),
                //   user: req.user, row: row[0]});
                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, row: rows});
                connection.release();
            });
        }
        else {
            var sqlforboard = "select * from info_board order by hit";
            connection.query(sqlforboard,function(err,rows){
                if (err) console.error("err : " + err);
                console.log("rows : " + JSON.stringify(rows));

                res.render('info_board', {isAuthenticated : req.isAuthenticated(),
                    user: req.user, rows: rows});
                connection.release();
            });
        }
    });
});

router.get('/info_board/info_write', function(req,res,next){
    res.render('info_write',{isAuthenticated : req.isAuthenticated(),
        user: req.user});
});

router.post('/info_board/info_write', function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var id = req.user.id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var file = req.body.file;
    var datas = [id,title,content,passwd,file];
    console.log(datas);

    pool.getConnection(function (err, connection){
        var sqlForInsertBoard = "insert into info_board(id,title, content, passwd, file,info_date) values(?,?,?,?,?,now())";
        connection.query(sqlForInsertBoard,datas,function(err,rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));
            res.redirect('/mainweb/info_board');
            connection.release();
        });
    });
});

router.get('/info_board/info_read/:idx', function(req,res,next){
    var idx = req.params.idx;
    var hit = req.params.hit;

    pool.getConnection(function(err,connection){
        var sql = "update info_board set hit=hit+1 where idx=?";
        connection.query(sql,[idx],function(err,row1){
            if(err) console.error(err);
            console.log("조회수 업데이트 : ", row1);
            sql = "select * from info_board where idx=?";
            connection.query(sql,[idx], function(err,row2){
                if(err) console.error(err);
                console.log("1개 글 조회 결과 확인 : ",row2);
                var sqlcomment = "select * from info_comment where info_comment.board_idx=?";
                connection.query(sqlcomment,[idx],function(err,row3){
                    if(err) console.error(err);
                    console.log("1개 댓글 조회 결과 확인 : ",row2);
                    res.render('info_read', {isAuthenticated : req.isAuthenticated(),
                        user: req.user, row2:row2[0], row3:row3});
                    connection.release();
                });
            });
        });
    });
});

router.post('/info_board/info_read/:idx',function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var content = req.body.content;
    var id = req.user.id;
    var passwd = req.body.passwd;
    var idx = req.params.idx;
    var datas = [idx,id,passwd,content];

    pool.getConnection(function(err,connection){
        var insertcomment = "insert into info_comment(board_idx,id,passwd,content,date) values(?,?,?,?,now())";
        connection.query(insertcomment,datas,function(err,rows){
            if(err) console.error(err);
            console.log("rows : " + JSON.stringify(rows));
            res.redirect('/mainweb/info_board/info_read/'+idx);
            connection.release();
        });
    });
});

router.get('/orderlist',function(req,res,next){
  if(!req.isAuthenticated())
  {
    res.redirect('/mainweb/login');
  }
     var id = req.user.id
     console.log(req.body);
    pool.getConnection(function(err,connection){
        var sqlforboard = "select item.image,order_board.* from item,order_board where item.item_seq=order_board.item_seq and order_board.user_id=?";
        connection.query(sqlforboard,id,function(err,rows){
             res.render('orderlist', 
                {
                    isAuthenticated : req.isAuthenticated(),
                    user: req.user,
                    rows: rows
                 });
                connection.release();
        }); 
    });
});

router.post('/orderlist',function(req, res, next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    res.redirect('/mainweb/main');
});

router.get('/mypage',function(req,res,next){
    res.render('mypage',{isAuthenticated : req.isAuthenticated(),
        user: req.user, loginMessage : req.flash('message')});
});

router.post('/mypage',function(req, res, next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    res.redirect('/mainweb/main');
});

router.get('/editdata',function(req,res,next){
  if(!req.isAuthenticated())
  {
    res.redirect('/mainweb/login');
  }
  var id = req.user.id;
    pool.getConnection(function(err,connection){
        var sqlforboard = "select * from user where id=?";
        connection.query(sqlforboard,function(err,rows){
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.render('editdata', {isAuthenticated : req.isAuthenticated(),
                user: req.user, rows: rows});
            connection.release();
        });
    });
});
router.post('/editdata', function(req, res, next){

    var id = req.user.id;
    //var passwd = req.user.passwd
    var newpasswd = req.body.newpasswd;
    var originpasswd = req.body.originpasswd
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var datas = [newpasswd,email,phone,address,id,originpasswd];

    pool.getConnection(function (err, connection)
    {// Use the connection
        var sqlForUpdate = "UPDATE user SET passwd=?, email=?, phone=?, address=? WHERE id=? and passwd=?"
        connection.query(sqlForUpdate,datas, function (err, result) {
            if (err) console.error("err : " + err);
            console.log("result : " + JSON.stringify(result));
           
            if(result.affectedRows == 0){
                res.send("<srcipt>alert('기존 패스워드와 일치하지 않습니다.');history.back();</srcipt>");
            }
            else {
                res.redirect('/mainweb');
            }
             connection.release();
            // Don't use the connection here, it has been returned to the pool.
        });
    });
     //res.redirect('/mainweb');
});

router.get('/do_order_cart',function(req,res,next){
  if(!req.isAuthenticated())
  {
    res.redirect('/mainweb/login');
  }
     var id = req.user.id;
     console.log(req.body);
    pool.getConnection(function(err,connection){
        var sqlforboard =  "select cart.*, item.* from cart, item where cart.user_id=? and cart.item_seq=item.item_seq";
        connection.query(sqlforboard,id ,function(err,rows){
          console.log(rows);
             res.render('do_order_cart', 
                {
                    isAuthenticated : req.isAuthenticated(),
                    user: req.user,
                    rows: rows
                 });
                connection.release();
        }); 
    });
});
router.post('/do_order_cart',function(req, res, next){
    var id =  req.user.id;
    var item_seq = req.body.item_seq;
    var item_color = req.body.item_color;
    var item_number = req.body.item_number;
    var order_seq =  req.body.order_seq;
    var order_price = req.body.order_price;
    var order_msg = req.body.order_msg;
    var order_date = req.body.order_date;
  
    var datas= [id,item_seq,item_color,item_number, order_seq,order_price,order_msg,order_date];
    console.log(datas);
  pool.getConnection(function(err,connection){
        var sqlforboard = "insert into order_board(user_id,item_seq,item_color,item_number,order_seq,order_price,order_msg,order_date) values(?,?,?,?,?,?,?,?)";
        connection.query(sqlforboard,datas,function(err,rows){
             if (err)
                console.log('err' + err);
             console.log("rows: " + JSON.stringify(rows));
            // res.redirect('/mainweb');
             connection.release();
        }); 
    });
    res.redirect('/mainweb/main');
})

router.get('/cart',function(req,res,next){
  if(!req.isAuthenticated())
  {
    res.redirect('/mainweb/login');
  }
     var id = req.user.id;
     console.log(req.body);
    pool.getConnection(function(err,connection){
        var sqlforboard = "select item.*, cart.* FROM item, cart WHERE cart.user_id =? AND item.item_seq = cart.item_seq";
        connection.query(sqlforboard, id, function(err,rows){
          console.log(rows);
             res.render('cart', 
                {
                    isAuthenticated : req.isAuthenticated(),
                    user: req.user,
                    rows: rows
                 });
                connection.release();
        }); 
    });
});
router.post('/cart',function(req, res, next){
  var item_seq =  req.body.item_seq;
  var price = req.body.order_price;
  pool.getConnection(function(err,connection){
        var sqlforboard = "insert into cart(order_price) values(?)";
        connection.query(sqlforboard, function(err,rows){
             if (err)
                console.log('err' + err);

             console.log("rows: " + JSON.stringify(rows));
             res.redirect('/cart');
             connection.release();
        }); 
    });

});

router.post('/cart/delete',function(req, res, next){
  var item_seq =  req.body.item_seq;
  pool.getConnection(function(err,connection){
        var sqlforboard = "DELETE FROM cart WHERE item_seq =?";
        connection.query(sqlforboard, item_seq, function(err,rows){
             if (err)
                console.log('err' + err);

             console.log("rows: " + JSON.stringify(rows));
             res.redirect('/cart');
             connection.release();

        }); 

    });

});
router.get('/item_info',function(req,res,next){
  var seq = req.params.item_seq;
    console.log(req.params.price);
    pool.getConnection(function(err,connection){
        var sqlforboard = "select * from item where item_seq=?";
        connection.query(sqlforboard,seq,function(err,rows){
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.render('joinForm', {isAuthenticated : req.isAuthenticated(),
                user: req.user, rows: rows});
            connection.release();
        });
    });
});
router.post('/item_info',function(req, res, next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/');
    }
    res.redirect('/mainweb/');
});

router.get('/admin_board',function(req,res,next){
    if(!req.isAuthenticated())
    {
        res.redirect('/mainweb/login');
    }
    var id = req.user.id;
    console.log(req.user.identity);
    if(req.user.identity != "관리자")
    {
        res.send("<script>alert('관리자가 아닙니다.'); history.back();</script>");
    }
    pool.getConnection(function(err,connection){
            var sqlsearchby="select count(distinct item_seq) from item";
            connection.query(sqlsearchby,function (err,rows1) {
                if(err) console.error(err);
                console.log("rows : ",rows1);
                console.log(req.user.indentity);
                sqlsearchby = "select count(distinct idx) from info_board";
                connection.query(sqlsearchby,function (err,rows2) {
                    if(err) console.error(err);
                    console.log("rows : ",rows2);
                    sqlsearchby="select count(distinct idx) from qna_board";
                    connection.query(sqlsearchby,function (err,rows3) {
                        if(err) console.error(err);
                        console.log("rows : ",rows3);
                        sqlsearchby="select count(distinct id) from user";
                        connection.query(sqlsearchby,function (err,rows4) {
                            if (err) console.error(err);
                            console.log("rows : ", rows4);
                            sqlsearchby = "select count(distinct board_idx) from info_comment";
                            connection.query(sqlsearchby,function (err,rows5) {
                                if (err) console.error(err);
                                console.log("rows : ", rows5);
                                sqlsearchby="select * from info_board";
                                connection.query(sqlsearchby,function (err,rows6) {
                                    if (err) console.error(err);
                                    console.log("rows : ", rows6);
                                    res.render('admin_board', {isAuthenticated : req.isAuthenticated(),
                                        user: req.user, rows1: rows1, rows2:rows2, rows3:rows3, rows4:rows4,
                                    rows5:rows5, rows6:rows6});
                                    connection.release();
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get('/sell_board/sell_board_delete',function(req,res,next){
    var seq = req.query.item_seq;

    pool.getConnection(function(err,connection){
        if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

        var sql = "select * from item where item_seq=?";
        connection.query(sql,[seq], function(err,row){
            if(err) console.error(err);
            console.log("Delete에서 1개 글 조회 결과 확인 : ",row);
            res.render('sell_board_delete', {isAuthenticated : req.isAuthenticated(),
                user: req.user, row:row[0]});
            connection.release();
        });
    });
});

router.post('/sell_board/sell_board_delete', function(req,res,next){
    var seq = req.body.item_seq;
    var seller_id = req.body.seller_id;
    var name = req.body.item_name;
    var description = req.body.description;
    var color = req.body.color1;
    var image = req.body.image;
    var size = req.body.size1;
    var price = req.body.price;
    var stock = req.body.stock;
    var category = req.body.category1;
    var datas = [seller_id,stock,name,price,size,color,category,image,description];

    pool.getConnection(function(err,connection){
        var sql = "delete from item where item_seq=?";
        connection.query(sql,[seq], function(err,result){
            console.log(result);
            if(err) console.error("글 수정 중 에러 발생 err : ",err);

            if(result.affectedRows == 0){
                res.send("<srcipt>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 삭제되지 않습니다.');history.back();</srcipt>");
            }
            else {
                res.redirect('/mainweb/sell_board');
            }
            connection.release();
        });
    });
});

router.get('/sell_board/sell_board_update',function(req,res,next){
   if(!req.isAuthenticated())
  {
    res.redirect('/mainweb/login');
  }
    var seq = req.query.item_seq;

    pool.getConnection(function(err,connection){
        if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

        var sql = "select * from item where item_seq=?";
        connection.query(sql,[seq], function(err,row){
            if(err) console.error(err);
            console.log("update에서 1개 글 조회 결과 확인 : ",row);
            res.render('sell_board_update', {isAuthenticated : req.isAuthenticated(),
                user: req.user, row:row[0]});
            connection.release();
        });
    });
});

router.post('/sell_board/sell_board_update', function(req,res,next){
    var seq = req.body.item_seq;
    var name = req.body.item_name;
    var description = req.body.description;
    var color = req.body.color1;
    var image = req.body.image;
    var size = req.body.size1;
    var price = req.body.price;
    var stock = req.body.stock;
    var category = req.body.category1;
    var datas = [stock,name,price,size,color,category,image,description,seq];

    console.log(datas);
    pool.getConnection(function(err,connection){
        var sql = "update item set stock=?, item_name=?,price=?,size1=?,color1=?,category1=?,image=?,description=? where item_seq=?";
        connection.query(sql,datas, function(err,result){
            console.log(result);
            if(err) console.error("글 수정 중 에러 발생 err : ",err);

            if(result.affectedRows == 0){
                res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
            }
            else{
                res.redirect('/mainweb/sell_board/sell_board_read' + seq);
            }
            connection.release();
        });
    });
});

router.get('/sell_board/sell_board_write', function(req,res,next){
    res.render('sell_board_write',{isAuthenticated : req.isAuthenticated(),
        user: req.user});
});

router.post('/sell_board/sell_board_write', function(req,res,next){
    var seller_id = req.user.id;
    var name = req.body.item_name;
    var description = req.body.description;
    var color = req.body.color1;
    var image = req.body.image;
    var size = req.body.size1;
    var price = req.body.price;
    var stock = req.body.stock;
    var category = req.body.category1;
    var datas = [seller_id,stock,name,price,size,color,category,image,description];

    pool.getConnection(function (err, connection){
        var sqlForInsertBoard = "insert into item(seller_id,stock,item_name,price,size1,color1,category1,image,description) values(?,?,?,?,?,?,?,?,?)";
        connection.query(sqlForInsertBoard,datas,function(err,rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));
            res.redirect('/mainweb/sell_board');
            connection.release();
        });
    });
});
module.exports = router;