var express = require('express');
var app = module.exports = express();
var Room = require('./model');
var Auth = require('../auth');

app.use('/:roomId/users', require('./users'));
app.use('/:roomId/messages', require('./messages'));

app.get('/', function (req, res, next) {
  Room.find().exec(function (err, rooms) {
    if (err) {
      return next(err);
    }
    res.json(rooms);
  });
});

app.post('/', Auth.isAuthenticated, function (req, res, next) {
  var room = new Room({
    name: req.body.name,
    creatorId: req.user._id
  });
  room.save(function (err, entity) {
    if (err) {
      return next(err);
    }
    res.json(entity);
  });
});

app.get('/:roomId', function (req, res, next) {
  Room.findById(req.params.roomId, function (err, room) {
    if (err) {
      return next(err);
    }
    res.json(room);
  });
});

app.put('/:roomId', Auth.isAuthenticated, function (req, res, next) {
  Room.update({
    _id: req.params.roomId,
    creatorId: req.user._id
  }, {
    $set: {
      name: req.body.name
    }
  }, {new: true}, function (err, room) {
    if (err) {
      return next(err);
    }
    res.json(room);
  });
});

app.delete('/:roomId', Auth.isAuthenticated, function (req, res, next) {
  Room.remove({
    _id: req.params.roomId,
    creatorId: req.user._id
  }, function (err, result) {
    if (err) {
      return next(err);
    }
    res.json(result);
  });
});