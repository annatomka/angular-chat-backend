var express = require('express');
var app = module.exports = express.Router({mergeParams: true});
var Room = require('../model');
var Auth = require('../../auth');

app.get('/', function (req, res, next) {
  Room.findById(req.params.roomId)
    .lean()
    .populate('users')
    .exec(function (err, room) {
    if (err) {
      return next(err);
    }
    if (!room) {
      return res.status(404).send();
    }
    res.json(room.users);
  });
});

app.post('/', Auth.isAuthenticated, function (req, res, next) {
  Room.findByIdAndUpdate(req.params.roomId, {
    $addToSet: {
      users: req.body.users
    }
  }, {new: true}, function(err, room) {
    if (err) {
      return next(err);
    }
    res.json(room);
  });
});

app.delete('/:userId', Auth.isAuthenticated, function (req, res, next) {
  Room.findByIdAndUpdate(req.params.roomId, {
    $pull: {
      users: req.params.userId
    }
  }, {new: true}, function(err, room) {
    if (err) {
      return next(err);
    }
    res.json(room);
  });
});