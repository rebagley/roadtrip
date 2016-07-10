var mongoose = require('mongoose')
//var findOrCreate = require('mongoose-findorcreate')

var songSchema=mongoose.Schema({
	name:String,
	artist:String,
	album: String
})

var playlistSchema = mongoose.Schema({
	name:String,
	creator:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	dateCreated: Date,
	followers:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	spotifyId:String,
	songs:Array
})



module.exports ={
	Playlist:mongoose.model('Playlist',playlistSchema),
	Song:mongoose.model('Song',songSchema)
}
