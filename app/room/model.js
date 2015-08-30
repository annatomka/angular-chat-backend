var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

var Model = mongoose.model('Room', roomSchema);

module.exports = Model;