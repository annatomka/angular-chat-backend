var express = require('express');
var app = module.exports = express();
var User = require('./model');

app.get('/', function (req, res, next) {
  User.find().exec(function (err, users) {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
});

app.post('/', function (req, res, next) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    imageUrl: req.body.imageUrl
  });
  user.save(function (err, savedEntity) {
    if (err) {
      return next(err);
    }
    res.json(savedEntity);
  });
});

app.get('/:userId', function (req, res, next) {
  User.findById(req.params.userId, function (err, user) {
    if (err) {
      return next(err);
    }
    res.json(user);
  });
});

app.put('/:userId', function (req, res, next) {
  User.findByIdAndUpdate(req.params.userId, {
    $set: {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      imageUrl: req.body.imageUrl
    }
  }, {new: true}, function (err, user) {
    if (err) {
      return next(err);
    }
    res.json(user);
  });
});

app.delete('/:userId', function (req, res, next) {
  User.findByIdAndRemove(req.params.userId, function (err, result) {
    if (err) {
      return next(err);
    }
    res.json(result);
  });
});
