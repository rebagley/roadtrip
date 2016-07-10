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
      email: req.body.email,
      password: req.body.password,
      wantsSpotify:true,
      facebookId: null,
      spotifyId:null
    });
    User.findOne({email:u.email},function(err,user){
      if(err){
        res.send(err)
        return;
      }
      else if(user && !user.username){
        user.username = u.username;
        user.password = u.password;
        console.log(user);
        user.save(function(err, user) {
          if (err) {
            res.status(500).redirect('/register');
          }
          else{
          console.log(user);
          res.redirect('/login');
          }
        })
      }
      else{
        console.log(u)
        u.save(function(err, user) {
          if (err) {
            console.log(err);
            res.status(500).redirect('/register');
          }
          else{
            console.log(user);
            res.redirect('/login');
          }
        });
      }
    })
  });

  // GET Login page
  router.get('/login', function(req, res) {
    if(req.user){
      res.redirect('/')
    }
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local'), function(req, res) {

    if(req.user.wantsSpotify && !req.user.spotifyId){
      res.redirect('/login/getSpotify')
    }
    else{
      res.redirect('/');
    }
  });

  router.get('/login/getSpotify',function(req,res){
    res.render('getSpotify')
  })

  router.post('/login/getSpotify',function(req,res){
    if(req.body.login){
      res.redirect('/login/spotify')
    }
    else{
      req.user.wantsSpotify = false;
      res.redirect('/')
    }
  })

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });


  //FACEBOOK

  router.get('/login/facebook',
    passport.authenticate('facebook', { scope:['email']}), function(req,res){});

  router.get('/login/facebook/callback',
    passport.authenticate('facebook',{failureRedirect: '/login'} ),
    function(req, res) {

      console.log(req.user)
      // Successful authentication, redirect home.
      if(req.user.wantsSpotify && !req.user.spotifyId){
        res.redirect('/login/getSpotify')
      }
      else{
        res.redirect('/');
      }
    });

    router.get('/login/spotify',passport.authenticate('spotify',{scope:['user-read-email','playlist-modify-public']}));
    // , {scope:['user-read-email','playlist-modify-public']}

    router.get('/login/spotify/callback',passport.authenticate('spotify',{failureRedirect: '/login'}), function(req,res){
      console.log(req.user);
      res.redirect('/')
      // passport.authenticate('spotify',function(profile){
      //   console.log(profile);
      //   req.user.spotifyId = profile._id;
      //   res.redirect('/');
      // })
    })



  return router;
};
