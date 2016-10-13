var passport = require('passport'),
    localStrategies = require('passport-local').Strategy,
    connection = require('./db'),
    bcrypt = require('bcrypt-nodejs');

passport.use(new localStrategies({usernameField: 'email'},function(email, password, done){
  console.log(email);
  console.log(password);
  console.log("in passport");
  connection.query('SELECT * FROM Users WHERE email = ?', email, function(err, rows){
    if(err)
      return err;
    var user = rows[0];
    bcrypt.compare(password, user.password, function(err, isMatch){
      console.log(user.email);
      console.log(isMatch);
      if(err)
        return callback(err);
      if(isMatch)
        return done(null,user);
      else
        return done(null,false,{message: "Invalid password and email"});
    });
  });
}))

passport.serializeUser(function(user, done) {
  console.log(user);
  console.log(done);
  done(null, user.userId);
});

passport.deserializeUser(function(id, done) {
  console.log("in deserializeUser");
  console.log(id);
  connection.query('SELECT * FROM Users WHERE userId = ?', id, function(err, rows){
    if(err)
      console.log("deserializeUser error "+err);
    console.log("user list rows "+rows);
    var user = rows[0];
    console.log(user.email);
    console.log("in deserializeUser "+user);
    done(err, user);
  });
});
