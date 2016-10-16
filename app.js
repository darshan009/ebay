
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , db = require('./config/db')
  , passport = require('passport')
  , session = require('express-session')
  , sqlStore = require('express-mysql-session');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

//session store
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "2hjkeydwjfhusdifsb",
  store: new sqlStore({
    host : 'localhost',
    user : 'root',
    password : '123',
    database : 'ebay'
  })
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(function(req, res, next){
//   res.locals.currentUser= req.user;
//   next();
// });
app.use(app.router);

//user loggedin authenticate
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
};

app.get('/', routes.index);
app.get('/userList', user.userList);
app.get('/login', user.login);
app.post('/login', user.postLogin);
app.get('/signup', user.signup);
app.post('/signup', user.postSignUp);
app.get('/logout', user.logout);

app.get('/profile', user.profile);
app.post('/publishAd', user.postPublishAd);
app.get('/loadAd', user.loadAd);
app.get('/loadAllAd', user.loadAllAd);
app.get('/purchasedAd', user.purchasedAd);
app.get('/shoppingCart', user.shoppingCart);
app.post('/addToCart', user.postShoppingCart);
app.post('/removeFromCart', user.removeFromCart);
app.get('/checkout', user.checkout);
app.post('/loadSingleAdvertisement', user.loadSingleAdvertisement);
app.post('/placeBid', user.placeBid);
// app.get('/getBids', user.getBids);
app.post('/updateBiddingAfter', user.updateBiddingAfter);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
