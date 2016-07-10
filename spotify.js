 var spotifyCredentials = require('./variables').SPOTIFY;
var clientId = spotifyCredentials.clientId;
var clientSecret = spotifyCredentials.clientSecret;

var SpotifyWebApi = require('spotify-web-api-node');
//var spotifyCredentials = require('../variables').SPOTIFY;

var spotifyApi = new SpotifyWebApi({
  clientId : spotifyCredentials.clientId,
  clientSecret: spotifyCredentials.clientSecret
});


var doSearch = function(artist, callback) {
		var url = 'https://api.spotify.com/v1/search?type=track&limit=50&q=' + encodeURIComponent('artist:""'+artistName+'"');
		$.ajax(url, {
			dataType: 'json',
			success: function(r) {
				console.log('got track', r);
				callback({
          artist: artist,
					tracks: r.tracks.items
						.map(function(item) {
							var ret = {
								name: item.name,
								artist: 'Unknown',
								artist_uri: '',
								album: item.album.name,
								album_uri: item.album.uri,
								cover_url: '',
								uri: item.uri
							}
							if (item.artists.length > 0) {
								ret.artist = item.artists[0].name;
								ret.artist_uri = item.artists[0].uri;
							}
							if (item.album.images.length > 0) {
								ret.cover_url = item.album.images[item.album.images.length - 1].url;
							}
							return ret;
						})
				});
			},
			error: function(r) {
				callback({
          artist: artist,
					tracks: []
				});
			}
	});
}

var doLogin = function(callback, playlist) {
		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
			'&response_type=token' +
			'&scope=playlist-read-private%20playlist-modify%20playlist-modify-private' +
			'&redirect_uri=' + encodeURIComponent(redirect_uri);
		localStorage.setItem('createplaylist-tracks', JSON.stringify(g_tracks));
		localStorage.setItem('createplaylist-name', g_name);
		var w = window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
	}


  spotifyApi.createPlaylist('thelinmichael', 'My Cool Playlist', { 'public' : false })
  .then(function(data) {
    console.log('Created playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });

  var newPlaylist= function(data){
  	spotifyApi.createPlaylist('thelinmichael', 'My Cool Playlist', { 'public' : false })
  .then(function(data) {
    console.log(data)
    console.log('Created playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  })
  }

// Add tracks to a playlist
spotifyApi.addTracksToPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"])
  .then(function(data) {
    console.log('Added tracks to playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });




module.exports=doSearch;
