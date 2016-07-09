var express = require('express');
var router = express.Router();
var User = require('.')

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

module.exports = router;
