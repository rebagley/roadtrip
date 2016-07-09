var mongoose = require('mongoose')
//var findOrCreate = require('mongoose-findorcreate')


var userSchema = mongoose.Schema({
	username: String,
	email:String,
	password: String,
	facebookId: String,
  spotifyId: String,
  mixLists:Array,
	wantsSpotify:Boolean,
	friends:Array
})





module.exports = mongoose.model('User',userSchema)
