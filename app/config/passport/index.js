'use strict';

var passport = require('passport'),
path = require('path'),
User = require('../../models').User,
fs = require('fs');		

module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		return done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User
			.find({
				where: {
					id: id
				}
			})
			.success(function(user) {
				return done(null, user);
			});
	});

	fs
		.readdirSync(path.join(__dirname, 'strategies'))
		.filter(function(file) {
			return (file !== 'index.js');
		})
		.forEach(function(file) {
			require(path.join(__dirname, 'strategies', file))();
		});
};