'use strict';

var models = require('../../models'),
Post = models.Post;

module.exports = function (socket) {
	socket.on('post new', function (id) {
		Post.find({
			where: {
				id: id
			}
		})

		.success(function(post) {
			socket.broadcast.emit('post new', post);
		});			
	});	
};