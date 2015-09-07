var express = require('express');
var app = module.exports.app = express();
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config');
var Room = require('app/rooms/model');

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

var io = module.exports.socketIO = require('socket.io').listen(server);
io.on('connection', function (socket) {
  console.log('User connected');
  socket.on('disconnect', function () {
    console.log('User disconnected');
  });
  socket.on('subscribe', function(data) {
    socket.join(data.room);
    Room.findByIdAndUpdate(data.room, {
      $addToSet: {
        users: data.users
      }
    });
    socket.emit("update","new person is online in the room");
    console.log('User joined to room:' + data.room);
  });
  socket.on('unsubscribe', function(data) {
    socket.leave(data.room);
    console.log('User left room:' + data.room);
  });
});

var port = config.port;
server.listen(port);

console.log('Mukodunk a ' + port + ' porton!');


