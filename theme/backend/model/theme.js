var mongoose = require('mongoose');
var Schema = mongoose.Schema;

themeSchema = new Schema({
	theme: String,
	date : { type : Date, default: Date.now }
}),
theme = mongoose.model('theme', themeSchema);

module.exports = theme;