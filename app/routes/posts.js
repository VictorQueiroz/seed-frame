'use strict';

var controllers = require('../controllers'),
passport = require('passport');

module.exports = function (app, io) {
	var ctrl = controllers.posts;

	app
		.route('/api/posts/seed')
		.get(ctrl.seed);	

	app
		.route('/api/posts/:id')
		.get(ctrl.get)
		.put(ctrl.update)
		.delete(ctrl.destroy);

	app
		.route('/api/posts')
		.get(ctrl.list)
		.post(ctrl.store);
};