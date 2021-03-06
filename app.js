var express = require('express');
var session = require('express-session')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var FacebookStrategy = require('passport-facebook');
var SpotifyStrategy = require('passport-spotify').Strategy;
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');


var variables = require('./variables');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var User = require('./models/user');


var SpotifyWebApi = require('spotify-web-api-node');
var spotifyCredentials = require('./variables').SPOTIFY;

var spotifyApi = new SpotifyWebApi({
  clientId : spotifyCredentials.clientId,
  clientSecret: spotifyCredentials.clientSecret
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//What Ruth put in
var connect = variables.MONGODB_URI
mongoose.connect(connect);

//Copied passport stuff
app.use(session({
    secret: variables.SECRET,
    // name: 'Catscoookie',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport strategy
passport.use(new LocalStrategy(function(username, password, done) {
    // Find the user with the given username
    User.findOne({ username: username }, function (err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (err) {
        console.error(err);
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        //console.log(user);
        return done(null, false, { message: 'Incorrect username.' });
      }
      // if passwords do not match, auth failed
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      // auth has has succeeded
      return done(null, user);
    });
  }
));

//Facebook stuff

passport.use(new FacebookStrategy({
    clientID: variables.FACEBOOK.clientID,
    clientSecret: variables.FACEBOOK.clientSecret,
    callbackURL: "https://warm-refuge-54272.herokuapp.com/login/facebook/callback",
    profileFields: ['id','email']
  },
  function(accessToken, refreshToken, profile, done) {
   // console.log(profile)
    User.findOne({$or:[{facebookId: profile.id},{email:profile.emails[0].value}] }, function (err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      //console.log(profile.emails[0].value)

      if (err) {
        console.error(err);
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        user = new User({
          facebookId:profile.id,
          wantsSpotify:true,
          email:profile.emails[0].value,
          spotifyId:null
        });
        user.save(function(err,tempUser){
          if(err){
            return done(err, null);
          }
          else{
            return done(null, tempUser);
          }
        });
      }
      else if(!user.facebookId){
        user.facebookId = profile.id
        //console.log("facebook id added")
        user.save(function(err){
          if(err){done(err)}
        })
        return done(null, user);
      }
      // auth has has succeeded
      else{
        //console.log("success")
        return done(null, user);
      }
    });
  }
));


passport.use(new SpotifyStrategy({
    clientID: variables.SPOTIFY.clientId,
    clientSecret: variables.SPOTIFY.clientSecret,
    callbackURL: "https://warm-refuge-54272.herokuapp.com/login/spotify/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //console.log(profile)
    User.findOne({email:profile.emails[0].value},function(err,user){
      //console.log(user.email)
      if(err){
        return done(err)
      }
      else if(!user){
        return done("no user")
      }
      else{
        spotifyApi.clientCredentialsGrant()
        .then(function(data) {
          //console.log('The access token expires in ' + data.body['expires_in']);
          //console.log('The access token is ' + data.body['access_token']);

          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
          user.spotifyToken = data.body['access_token'];
          user.spotifyId = profile.id;
          user.spotifyRefreshToken = data.body['refresh_token']
          user.save(function(err){
            if(err){done(err)}
          })
          return done(null,user)
        }
        , function(err) {
          console.log('Something went wrong when retrieving an access token', err.message);
        });
      }

    })
  }))



//Back to original stuff


app.use('/', auth(passport));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
