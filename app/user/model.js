var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  imageUrl: String
});

userSchema.methods.verifyPassword = function(password, cb) {
  cb(null, password === this.password);
};

var Model = mongoose.model('User', userSchema);

module.exports = Model;