var mongoose = require('mongoose')
//var findOrCreate = require('mongoose-findorcreate')


var userSchema = mongoose.Schema({
	username: String,
	//username actually a phone#, but passport requires 'username' field
	password: String,
	facebookId: String,
  mixLists:Array
})





module.exports = mongoose.model('User',userSchema)
