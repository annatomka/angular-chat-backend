var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config');
var mongoose   = require('mongoose');

mongoose.connect(config.mongoUri);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var api = require('./app');
app.use('/api/v1/', api);

var router = express.Router();
router.get('/', function(req, res) {
    res.json({ message: 'Hello world!' });
});
app.use('/', router);

var port = config.port;
app.listen(port);

console.log('Mukodunk a ' + port + ' porton!');

