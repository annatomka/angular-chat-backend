var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = config.port;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'Hello world!' });
});

app.use('/api', router);
app.listen(port);

console.log('Mukodunk a ' + port + ' porton!');

