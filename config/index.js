var config = {};

config.port = process.env.PORT || 8080;
config.mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/chatdemo';

module.exports = config;