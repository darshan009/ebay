var passport = require('passport');
/*
 * GET home page.
 */

exports.index = function(req, res){
  var user = req.user;
  res.render('index', {
      title: 'Express',
      user: user
    });
};
