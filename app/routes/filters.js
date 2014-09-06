'use strict';

var models = require('../models'),
User = models.User,
Role = models.Role;

var hasRole = function (roleId, callback) {
	return function (req, res, next) {
		User
			.find({
				where: {
					id: req.user.id
				},

				include: [{
					model: Role
				}]
			})

			.success(function(user) {

				user.getRoles({
					where: {
						id: roleId
					}
				}).success(callback);

			});			
	};
};

exports.guest = function (req, res, next) {
	if(req.isAuthenticated())
		return res.status(404).redirect('/');

	next();
};

exports.authenticated = function (req, res, next) {
	if(!req.isAuthenticated())
		return res.status(404).redirect('/');

	next();
};

exports.administrator = function (req, res, next) {
	hasRole(2, function(roles) {
		if(roles.length > 0)
			return next();
		
		res.status(404).redirect('/');
	})(req, res, next);
};

exports.owner = function (req, res, next) {
	hasRole(3, function(roles) {
		if(roles.length > 0)
			return next();
		
		res.status(404).redirect('/');
	})(req, res, next);
};

exports.user = function (req, res, next) {
	hasRole(1, function(roles) {
		if(roles.length > 0)
			return next();
		
		res.status(404).redirect('/');
	})(req, res, next);
};