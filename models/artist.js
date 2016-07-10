var mongoose = require('mongoose')
//var findOrCreate = require('mongoose-findorcreate')


var artistSchema = mongoose.Schema({
	name:String,
	picture:String,
	url:String
})


module.exports = mongoose.model('Artist',artistSchema)
