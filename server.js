'use strict';

var db = require('./app/config/db'),
app = require('./app/config/express')(db),
server = require('http').Server(app),
io = require('socket.io')(server),
controllers = require('./app/controllers'),
db = require('./app/models');

require('./app/config/passport')();

controllers['socket.io'](io);

/**
 * Sequelize starter
 */
db.sequelize.sync({
	force: false
}).complete(function(err){
	if(err) {
		throw err[0];
	} else {
		server.listen(app.get('port'));
	};
});

/**
 * Routes
 */
require('./app/routes')(app, io);

module.exports = app;