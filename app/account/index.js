var express = require('express');
var app = module.exports = express();
var User = require('../users/model');
var Auth = require('../auth');

app.get('/me', Auth.isAuthenticated, function (req, res, next) {
  User.findById(req.user._id).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    res.json(user);
  });
});

app.post('/register', function (req, res, next) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    imageUrl: req.body.imageUrl
  });
  user.save(function (err, entity) {
    if (err) {
      return next(err);
    }
    res.json(entity);

    //Ha session lenne:
    //req.login(entity, function (err) {
    //  if (err) {
    //    return next(err);
    //  }
    //  res.json(entity);
    //});
  });
});
