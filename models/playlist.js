var mongoose = require('mongoose')
//var findOrCreate = require('mongoose-findorcreate')

var songSchema=mongoose.Schema({
	name:String,
	artist:String,
	picture:String,
	url:String
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
	songs:Array,
	artists:Array,
	artist1:String,
	artist2:String
})



module.exports ={
	Playlist:mongoose.model('Playlist',playlistSchema),
	Song:mongoose.model('Song',songSchema)
}
