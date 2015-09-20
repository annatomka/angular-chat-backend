var express = require('express');
var app = module.exports.app = express();
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config');

mongoose.connect(config.mongoUri);
app.use(bodyParser.json());
app.use(passport.initialize());

//CORS

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
  next();
});

var api = require('./app');
app.use('/api/v1/', api);
app.use(express.static('public'));

var server = http.createServer(app);
var Room = require('./app/rooms/model');
var io = module.exports.socketIO = require('socket.io').listen(server);
io.on('connection', function (socket) {
  console.log('User connected');
  socket.on('disconnect', function () {
    console.log('User disconnected');
  });
  socket.on('subscribe', function(data) {
    socket.join(data.room);
    console.log("users: " + data.user.username)
    Room.findByIdAndUpdate(data.room, {
      $addToSet: {
        users: [data.user._id]
      }
    },{new: true}, function(err, room) {
      if (err) {
       console.log("error: "+ err)
      }
      console.log("user room connection created successfully")
    });
    io.in(data.room).emit("user.joined",data.user);
    //socket.in(data.room).emit("update.user",data.user);
    console.log('User joined to room:' + data.room);

  });
  socket.on('unsubscribe', function(data) {
    socket.leave(data.room);
    socket.in(data.room).emit("user.left",data.user);
    console.log('User left room:' + data.room);
    Room.findByIdAndUpdate(data.room, {
      $pull: {
        users: [data.user._id]
      }
    }, {new: true}, function(err, room) {
      if (err) {
        console.log(err)
      }
      console.log("user room connection deleted successfully")
    });
  });
});

var port = config.port;
server.listen(port);

console.log('Mukodunk a ' + port + ' porton!');


