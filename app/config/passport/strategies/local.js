'use strict';

var passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy,
		User = require('../../../models').User;

module.exports = function (req, res, next) {	
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			User
				.find({
					where: {
						username: username
					}
				})
				.success(function(user) {
					if (!user) {
						return done(null, false, {
							message: 'Unknown user'
						});
					}

					// if (!user.authenticate(password)) {
					// 	return done(null, false, {
					// 		message: 'Invalid password'
					// 	});
					// } else {
					// }

					return done(null, user);
				});
		}
	));
};