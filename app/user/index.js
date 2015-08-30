var express = require('express');
var app = module.exports = express();

app.get('/', function(req, res) {
    res.json({
        message: 'List users'
    });
});

app.post('/', function(req, res) {
    res.json({
        message: 'Create new user: ' + req.params.userId
    });
});

app.get('/:userId', function(req, res) {
    res.json({
        message: 'Get User by Id: ' + req.params.userId
    });
});

app.put('/:userId', function(req, res) {
   res.json({
       message: 'Update User by id: ' + req.params.userId
   });
});

app.delete('/:userId', function(req, res) {
    res.json({
        message: 'Delete User by id: ' + req.params.userId
    });
});
