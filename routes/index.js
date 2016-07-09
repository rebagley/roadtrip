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

router.get('/myAccount/:id',function(req,res,next){
  User.findById(req.params.id,function(err,user){
    if(err){
      res.send(err);
    }
    else{
      res.render('myAccount',user)
    }
  })
})

router.get('/friends/:id',function(req,res,next){
  User.findById(req.params.id,function(err,user){
    if(err){
      res.send(err);
    }
    else{
      res.render('friends',user)
    }
  })
})

router.get

module.exports = router;
