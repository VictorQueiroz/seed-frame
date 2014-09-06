'use strict';

var controllers = require('../controllers'),
passport = require('passport'),
filters = require('./filters'),
_ = require('underscore-node');

module.exports = function (app) {
	var ctrl = controllers.users;

	app.route('/api/users')
		.get(filters.administrator, ctrl.list)
		.post(ctrl.store);

	app.route('/api/users/:id')
		.get(ctrl.get)
		.put(filters.administrator, ctrl.update)
		.delete(filters.administrator, ctrl.destroy);

	app.route('/auth/local').post(filters.guest, passport.authenticate('local'));

	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email', 'read_stream']
	}));

	app.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));

	app.route('/auth/check').get(function(req, res, next) {
		if(req.isAuthenticated())
			res.json({result: true, user: _.pick(req.user, 'email', 'name', 'username')});
		else 
			res.json({result: false});
	});

	app.route('/auth/destroy').get(function(req, res, next) {
		req.logout();
		res.redirect('/');
	});
};