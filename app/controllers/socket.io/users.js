'use strict';

var models = require('../../models'),
User = models.User;

module.exports = function (socket) {
	socket.on('user authenticated', function(user){
		socket.emit('user authenticated', user);
	});

	socket.on('user new', function (id) {
		User.find({
			where: {
				id: id
			}
		})
		.success(function(user) {
			socket.broadcast.emit('user new', user);
		});
	});
};