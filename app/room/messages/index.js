var express = require('express');
var app = module.exports = express.Router({mergeParams: true});
var Room = require('../model');
var Message = require('./model');
var Auth = require('../../auth');

app.get('/', function (req, res, next) {
  Message.find({roomId: req.params.roomId})
    .sort({_id: -1})
    .exec(function (err, messages) {
      res.json(messages);
    });
});

app.post('/', Auth.isAuthenticated, function (req, res, next) {
  Message.create({
    text: req.body.text,
    roomId: req.params.roomId,
    authorId: req.user._id
  }, function(err, message) {
    if (err) {
      return next(err);
    }
    res.json(message);
  });
});

app.delete('/:messageId', Auth.isAuthenticated, function (req, res, next) {
  Message.remove({
    _id: req.params.messageId,
    roomId: req.params.roomId
  }, function(err, message) {
    if (err) {
      return next(err);
    }
    res.json(message);
  });
});