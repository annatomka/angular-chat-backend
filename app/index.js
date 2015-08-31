var _ = require('lodash');
var express = require('express');
var app = module.exports = express();

app.get('/', function(req, res) {
    res.json({
        message: 'API v1 home'
    });
});

app.use('/account', require('./account'));
app.use('/users', require('./users'));
app.use('/rooms', require('./rooms'));

//Mongoose validation error handler middleware
app.use(function(err, req, res, next) {
    //if mongo error
    if(err.code === 11000 || err.name === 'ValidationError') {
        console.error(err.stack);
        return res.status(400).json({
            error: err.errors ? _.map(err.errors, 'message') : 'Validation error',
            message: err.message
        });
    }
    next(err);
});
