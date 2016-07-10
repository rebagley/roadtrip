var express = require('express');
var router = express.Router();
var LastfmAPI = require('lastfmapi');
var variables = require('../variables');
//var SpotifyWebApi = require('spotify-web-api-node');
// var spotifyApi = require('spotify-web-api-node');
var spotify=require('../spotify.js')

var lfm = new LastfmAPI({
  'api_key' : "9a09b3b6f2f046ad39b28327bf5477e6",
  'secret' : "47460a4caa8ab51daacfced86dcc574c"
});

var User = require('../models/user');
var Playlist = require('../models/playlist').Playlist;
var Song = require('../models/playlist').Song;
var List = require('../models/artist')
var doSearch = require('../spotify')
var items =require('../lastfm');



var SpotifyWebApi = require('spotify-web-api-node');
var spotifyCredentials = require('../variables').SPOTIFY;

var spotifyApi = new SpotifyWebApi({
  clientId : spotifyCredentials.clientId,
  clientSecret: spotifyCredentials.clientSecret
});

var getRelated=items.getRelated
//console.log(getRelated)
var id=items.getRelated
//console.log(id)

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
  lfm.chart.getTopTracks(function(err, tracks){
    if(err){
      console.log(err)
    }
    else{
      var tracks = tracks.track;
      console.log(tracks)
      var trackArr = [];
      tracks.map(function(track){
        // console.log("NEW ONE", track)
        console.log(track.image[0])
        var song = new Song({
          name: track.name,
          artist: track.artist.name,
          url: track.url,
          picture: track.image[3]['#text']
        })
        //console.log(song)
        // console.log("SONG",song)
        song.save(function(err,song){
          if(err){
            res.send(err)
          }
          else{
            // console.log("SAVED SONG", song,trackArr)
            trackArr.push(song)

            if (trackArr.length==20){
              makePlaylist(trackArr);
            }
          }
        })
      })
      //console.log("ARRAY",trackArr)

    }
  })

var makePlaylist = function(trackArr)
{var top40 = new Playlist({
  name: 'top40',
  creator: null,
  dateCreated: new Date(),
  songs:trackArr
})
top40.save(function(err,playlist){
  if(err){
    res.send(err)
  }
  else{
    console.log("LOOK HERE", playlist);
    res.render('discover',{tracks:playlist.songs})
  }
})
}
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

router.post('/', function(req,res){
  console.log(req.body.artist1)
  console.log(req.body.artist2)
  res.redirect('/search?artist1='+encodeURIComponent(req.body.artist1)+'&artist2='+encodeURIComponent(req.body.artist2))
})

var cbfunc = function(fun,cb){
  return cb(fun);
}


router.get('/search',function(req,res,next){
  var artist1 = decodeURI(req.query.artist1);
  var artist2 = decodeURI(req.query.artist2);
  var tempObj= null;

  cbfunc(getRelated(artist1,artist2,5),function(id){
    console.log("done",id)

  })

  console.log(tempObj)
  var artists = tempObj.artists;

  var tracks = [];
  artists.forEach(function(artist){
    doSearch(artist,function(data){
        tracks=tracks.concat(data.tracks)
    })
  })



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

});

// //
router.get('/export/:id',function(req,res,next){
  Playlist.findById(req.params.id, function(err,data){
    if(err){
      console.log(err)
    }
    else{
      spotify.newPlaylist(data)
      // console.log(data)
  //   spotifyApi.createPlaylist('thelinmichael', 'My Cool Playlist', { 'public' : false })
  // .then(function(data) {
  //   console.log(data)
  //   console.log('Created playlist!');
  // }, function(err) {
  //   console.log('Something went wrong!', err);
  // })
  }
  });
})


module.exports = router;
