'use strict';

var models = require('../models'),
fs = require('fs'),
path = require('path'),
FOLDER = 'socket.io';

module.exports = function (io) {
	io.on('connection', function (socket) {
		socket.broadcast.emit('user connected');

		socket.on('disconnect', function () {
			socket.broadcast.emit('user disconnected');
		});		

		// Load all socket.io controllers
		fs
			.readdirSync(path.join(__dirname, FOLDER))
			.filter(function(file) {
				return (file !== 'index.js');
			})
			.forEach(function(file) {
				require(path.join(__dirname, FOLDER, file).replace('.js', ''))(socket);
			});
	});
};