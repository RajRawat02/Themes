var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	username: String,
	password: String,
	themeId:Schema.Types.ObjectId
}),
user = mongoose.model('user', userSchema);

module.exports = user;