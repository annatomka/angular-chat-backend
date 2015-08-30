var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema  = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    imageUrl: String
});

var Model = mongoose.model('User', userSchema);

module.exports = Model;