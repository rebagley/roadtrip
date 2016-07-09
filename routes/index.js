var express = require('express');
var router = express.Router();
var User = require('../models/user')

/* GET home page. */
router.use(function(req,res,next){
  if(!req.user){
    res.redirect('/login')
  }
  else{
    next();
  }
})
router.get('/', function(req, res, next) {
  res.render('index')

});

router.get('/discover',function(req,res,next){
  res.render('discover')
})

router.get('/myAccount',function(req,res,next){
  res.render('myAccount',req.user)
})

router.get('/friends',function(req,res,next){
  res.render('friends',req.user)
})

router.get('/myPlaylists',function(req,res,next){
  res.render('myPlaylists',req.user);
})


module.exports = router;
