var express = require('express');
var router = express.Router();
var User = require('../models/user')


module.exports = function(passport) {

  // GET registration page
  router.get('/register', function(req, res) {
    res.render('register');
  });

  // POST registration page
  var validateReq = function(userData) {
    return (userData.password === userData.passwordConfirm);
  };

  router.post('/register', function(req, res) {
    // validation step
    if (!validateReq(req.body)) {
      return res.render('register', {
        error: "Passwords don't match."
      });
    }
    var u = new User({
      username: req.body.username,
      password: req.body.password,
      defaultShipping: null,
      verified:false,
      verifyCode:randomCode()
    });
    console.log(u)
    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
      console.log(user);
      res.redirect('/login');
    });
  });

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local'), function(req, res) {
      res.redirect('/');
  });

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });


  //FACEBOOK

  router.get('/login/facebook',
    passport.authenticate('facebook'));

  router.get('/login/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });



  return router;
};
