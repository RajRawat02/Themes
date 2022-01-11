var mongoose = require('mongoose');
var Schema = mongoose.Schema;

themeSchema = new Schema( {
	theme: String,
	_id: Schema.ObjectId,
	date : { type : Date, default: Date.now }
}),
theme = mongoose.model('theme', themeSchema);

module.exports = theme;