var express = require('express');
var app = module.exports = express.Router({mergeParams: true});
var Room = require('../model');
var Message = require('./model');
var Auth = require('../../auth');
var server = require('../../../server');

app.get('/', function (req, res, next) {
  Message.find({roomId: req.params.roomId})
    .sort({_id: 1})
    .exec(function (err, messages) {
      res.json(messages);
    });
});

app.post('/', Auth.isAuthenticated, function (req, res, next) {
  console.log("user of message: "+ req.user._id)
  Message.create({
    text: req.body.text,
    roomId: req.params.roomId,
    authorId: req.user._id
  }, function(err, message) {
    if (err) {
      return next(err);
    }
    console.log("message["+message+"] emitted to room: ",message.roomId)
    server.socketIO.in(message.roomId).emit('new message', message);
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
    server.socketIO.in(req.params.roomId).emit('message removed', { messageId: req.params.messageId});
    res.json(message);
  });
});