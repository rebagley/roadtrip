var mongoose = require('mongoose')
//var findOrCreate = require('mongoose-findorcreate')


var userSchema = mongoose.Schema({
	username: String,
	email:String,
	password: String,
	facebookId: String,
  spotifyId: String,
  playlists:Array,
	wantsSpotify:Boolean,
	friends:Array,
	spotifyToken:String,
})





module.exports = mongoose.model('User',userSchema)
