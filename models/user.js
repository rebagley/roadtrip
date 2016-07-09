var mongoose = require('mongoose')
//var findOrCreate = require('mongoose-findorcreate')


var userSchema = mongoose.Schema({
	username: String,
	//username actually a phone#, but passport requires 'username' field
	password: String,
	facebookId: String,
  spotifyId: String,
  mixLists:Array,
	wantsSpotify:Boolean,
	friends:Array
})





module.exports = mongoose.model('User',userSchema)
