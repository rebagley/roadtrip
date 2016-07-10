var mongoose = require('mongoose')
//var findOrCreate = require('mongoose-findorcreate')


var artistSchema = mongoose.Schema({
	artists: [String]
})


module.exports = mongoose.model('Artist',artistSchema)
