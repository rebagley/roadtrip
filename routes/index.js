var express = require('express');
var router = express.Router();
var LastfmAPI = require('lastfmapi');

var lfm = new LastfmAPI({
  'api_key' : variables.LASTFM.api_key,
  'secret' : variables.LASTFM.secret
});

var User = require('../models/user');
var Playlist = require('../models/playlist').Playlist;
var Song = require('../models/playlist').Song;
var doSearch = require('../spotify')
var getRelated =require('../lastfm');


/* GET home page. */
router.use(function(req,res,next){
  if(!req.user){
    res.redirect('/login')
  }
  else{
    //console.log(req.user)
    next();
  }
})
router.get('/', function(req, res, next) {
  res.render('index')

});

router.get('/discover',function(req,res,next){
function(){
  lfm.chart.getTopTracks( function(err, tracks){
    if(err){
      console.log(err)
    }
    else{
      console.log(tracks)
    }
  })
}
// $.ajax({
//   method: "get",
//   url: 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=Cher&api_key=9a09b3b6f2f046ad39b28327bf5477e6&format=json',
//   success: function(data) {
//     console.log(data.artist.name);
//   }
// })
  res.render('discover')
})

router.get('/myAccount',function(req,res,next){
  res.render('myAccount',{user:req.user})
})

router.get('/friends',function(req,res,next){
  res.render('friends',{user:req.user})
})

router.get('/myPlaylists',function(req,res,next){
  var playlists = req.user.playlists.slice();
  for(var i=0;i<playlists.length;i++){
    User.findById(playlists[i].creator).populate('creator').exec(function(err){
      if(err){res.send(err)}
      else{
        playlists[i].creator = playlists[i].creator.username
      }
    })
  }
  res.render('playlists',{playlists:playlists});
})

router.get("/playlist/:id",function(req,res){
  Playlist.findById(req.params.id,function(err,playlist){
    if(err){
      res.send(err)
    }
    else{
      res.render('playlist',{playlist:playlist,timeSince:timeSince(playlist.dateCreated)});
    }
  })
})

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

router.get('/search',function(req,res,next){
  var artist1 = decodeURI(req.query.artist1);
  var artist2 = decodeURI(req.query.artist2);
  var tempObj= null;
  getRelated(artist1,artist2,5,function(list){
    tempObj=list
  });
  console.log(tempObj)
  var artists = tempObj.artists;

  var tracks = [];
  artists.forEach(function(artist){
    doSearch(artist,function(data){
        tracks=tracks.concat(data.tracks)
    })
  })

  router.post('/', function(req,res){
    console.log(req.body.artist1)
    console.log(req.body.artist2)
    res.redirect('/')



  var tempPlaylist = new Playlist({
    name: artist1+" and "+artist2,
    creator: req.user._id,
    dateCreated: new Date(),
    followers: [req.user._id],
    spotifyId: null,
    songs: tracks
  });
  tempPlaylist.save(function(err,playlist){
    if(err){
      res.send(err)
    }
    else{
      req.user.update({playlists:req.user.playlists.push(playlist)},function(err){})
      res.render('playlist',playlist)
    }
  })
})

router.post('/',function(req,res,next){
  res.redirect('/playlist')
})

//
// router.get('/export/:id',function(req,res,next){
//   spotifyApi.createPlaylist('thelinmichael', 'My Cool Playlist', { 'public' : false })
//   .then(function(data) {
//     console.log('Created playlist!');
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });
//
// // Add tracks to a playlist
// spotifyApi.addTracksToPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"])
//   .then(function(data) {
//     console.log('Added tracks to playlist!');
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });
// })



module.exports = router;
