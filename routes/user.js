var pool = require('../config/db'),
    passport = require('passport'),
    passportImport = require('../config/passport'),
    bcrypt = require('bcrypt-nodejs');

var connection = require('../config/db');

/*
 * GET users listing.
 */

 exports.userList = function(req, res){

   pool.getConnection(function(err, connection){
     if(err)
      console.log(err);
     connection.query('SELECT * FORM users', function(err, rows){
       if(err)
         console.log("Selecting error: ", err);
        console.log(rows);
      connection.release();
       res.render('')
     });
   });
 };

exports.login = function(req, res) {
  res.render('login');
};
exports.postLogin = function(req, res, next) {
  var email = req.body.email,
      password = req.body.password;
  connection.query("SELECT * FROM Users WHERE email =?", email, function(err, rows){
    if(err)
      console.log(err);
    if(!rows)
      res.end("Sorry your email id is not registered");

    //decrypt and authenticate
    passport.authenticate('local', { successRedirect: '/',
                          failureRedirect: '/signup'}, function(err, user, info){
      if (err)
        return console.log(err);;
      if(!user)
        res.redirect('/login');
      return req.logIn(user,function(err){
        if(err)
          return next(err);
        console.log("user is loggied in");
        req.session.shoppingCart = [];
        connection.release();
        res.redirect('/');
      });
    })(req, res, next);

  });
};

exports.signup = function(req, res) {
  res.render('signup');
};

exports.postSignUp = function(req, res, next){
  var firstName = req.body.firstName,
      lastName = req.body.lastName,
      email = req.body.email,
      password = req.body.password,
      hashedPassword;

  //hashing
  bcrypt.genSalt(10, function(err, salt){
    if(err)
      return err;
    bcrypt.hash(password,salt,null,function(err, hash){
      if(err)
        return err;
      hashedPassword = hash;
      console.log("the hashedPassword is "+hashedPassword);

      var userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
          };
        connection.query("INSERT INTO Users SET ?", userData, function(err, rows){
          if(err)
            console.log(err);
          console.log("Last insert ID", res.insertId);
          connection.release();
          res.redirect('/login');
        });
    });//end of bcrypt

  });
};

exports.logout = function(req, res){
  console.log("in logout");
  req.logout();
  res.redirect('/');
};

exports.profile = function(req, res){
  var user = req.user;
  res.render('profile', {
      user: user
    });
};

exports.postPublishAd = function(req, res){
  console.log(req.user.userId);
  var adData = {
      name : req.param("name"),
      specification : req.param("specification"),
      quantity : req.param("quantity"),
      shipping : req.param("shipping"),
      price : req.param("price"),
      status : "live",
      userId : req.user.userId
    };
  pool.getConnection(function(err, connection){
    connection.query("INSERT INTO Advertisement SET ?", adData, function(err, rows){
      if(err)
        console.log(err);
      console.log("Last insert ID", res.insertId);
      console.log(rows);
      connection.release();
      res.send("success");
    });
  });
};

exports.loadAd = function(req, res) {
  var userId = req.user.userId;
  console.log("in loadAd");
  pool.getConnection(function(err, connection){
    connection.query("SELECT * FROM Advertisement WHERE userId = ?", userId, function(err, rows){
      if(err)
        console.log(err);
      console.log("Last insert ID", res.insertId);
      console.log(rows);
      connection.release();
      res.send(rows);
    });
  });
};

exports.loadAllAd = function(req, res) {
  var userId = req.user.userId;
  console.log("in loadAd");
  pool.getConnection(function(err, connection){
    connection.query("SELECT * FROM Advertisement WHERE status = ?", "live", function(err, rows){
      if(err)
        console.log(err);
      console.log(rows);
      connection.release();
      res.send(rows);
    });
  });
};

exports.shoppingCart = function(req, res) {
  console.log(req.session);
  res.send(req.session.shoppingCart);
};

exports.postShoppingCart = function(req, res) {
  pool.getConnection(function(err, connection){
    connection.query("SELECT * FROM Advertisement WHERE id = ?", req.param("adId"), function(err, rows){
      if(err)
        console.log(err);
      console.log(rows);
      var fullCart = rows[0];
      fullCart = {
        name : rows[0].name,
        specification : rows[0].specification,
        quantity : rows[0].quantity,
        shipping : rows[0].shipping,
        price : rows[0].price,
        quantityEntered : req.param("quantityEntered")
      }
      console.log(fullCart);
      req.session.shoppingCart.push(fullCart);
      connection.release();
      res.send(fullCart);
    });
  });
};

exports.removeFromCart = function(req, res) {
  console.log("in removeFromCart");
  console.log(req.param("cartId"));
  for(var i=0; i<req.session.shoppingCart.length; i++)
    if (req.session.shoppingCart[i].id == req.param("cartId")) {
      req.session.shoppingCart.splice(i, 1);
      req.session.save();
      console.log(i);
    }
  console.log(req.session);
  res.send(req.session.shoppingCart);
};

exports.checkout = function(req, res) {
  console.log("-----------checkout-------");
  for(var i=0; i<req.session.shoppingCart.length; i++) {
    // if(req.session.shoppingCart[i].quantity < req.param(""))
    var purchasedData = {
      userId : req.user.userId,
      name : req.session.shoppingCart[i].name,
      specification : req.session.shoppingCart[i].specification,
      quantity : req.session.shoppingCart[i].quantity,
      shipping : req.session.shoppingCart[i].shipping,
      price : req.session.shoppingCart[i].price
    }
    pool.getConnection(function(err, connection){
      connection.query("UPDATE Advertisement SET status = ?, quantity = ? WHERE id = ?", ["sold", -(purchasedData.quantity), req.session.shoppingCart[i].id], function(err, rows){
        if(err)
          console.log(err);
        console.log("in update Advertisement");
        console.log(rows);
        connection.release();
      });
      connection.query("INSERT INTO Purchased SET ?", purchasedData, function(err, rows){
        if(err)
          console.log(err);
        console.log(rows);
        connection.release();
      });
    });
  }
  req.session.shoppingCart = [];
  res.send("data");
};

exports.purchasedAd = function(req, res) {
  var userId = req.user.userId;
  console.log("in purchasedAd");
  pool.getConnection(function(err, connection){
    connection.query("SELECT * FROM Purchased WHERE userId = ?", userId, function(err, rows){
      if(err)
        console.log(err);
      console.log(rows);
      connection.release();
      res.send(rows);
    });
  });
};
