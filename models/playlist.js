var mongoose = require('mongoose')
//var findOrCreate = require('mongoose-findorcreate')


var playlistSchema = mongoose.Schema({
	name:String
	creator:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	dateCreated: Date,
	followers:Array
})



module.exports = mongoose.model('Playlist',playlistSchema)
