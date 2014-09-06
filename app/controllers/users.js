'use strict';

var models = require('../models'),
User = models.User,
Role = models.Role,
passport = require('passport'),
_ = require('underscore-node');

exports.list = function (req, res) {
	var query = req.query;

	query.page = parseInt(query.page ? query.page : 1);
	query.per_page = query.per_page ? query.per_page : 4;

	var offset = (query.page - 1) * (query.per_page),
	limit = parseInt(query.per_page);

	User
		.findAndCountAll({
			limit: limit,
			offset: offset,
			order: 'updated_at DESC'
		})

		.success(function(result) {
			var users = result.rows;
			var count = result.count;

			res.json({
				current: query.page,
				pageCount: Math.ceil((count / limit - 1) + 1),
				count: count,
				data: _.filter(users, function (user) {
					return _.pick(user, 'name', 'username', 'email');
				})
			});			
		});
};

exports.get = function (req, res) {
	var id = req.params.id;

	User
		.find({ id: id })
		.success(function(user) {
			if(user)
				res.json(user);
		});
};

exports.store = function (req, res) {
	var data = _.pick(req.body,
		'username',
		'email',
		'name',
		'password'
	);

	User
		.create(data)
		.success(function(user) {
			if(user) {
				Role.find({ where: { id: 1 } }).success(function(role) {
					user.setRoles([role]).success(function() {
						User.find({
							where: {
								id: user.id
							},

							include: [{
								model: Role
							}]
						}).success(function(user) {
							res.json(user);
						});
					});
				});
			}
		});
};

exports.update = function (req, res) {
	var id = req.params.id;
	var data = req.body;

	User
		.update(_.pick(data, 'name', 'username', 'email'), { id: id })
		.success(function() {
			User
				.find({	id: id })
				.success(function(user) {
					if(user)
						res.json(user);
				});
		});
 };

exports.destroy = function (req, res) {
	var id = req.params.id;

	User
		.destroy({ id: id })
		.success(function() {
			User
				.find({ id: id })
				.success(function(user) {
					if(!user)
						res.json({ result: true });
					else
						res.json({ result: false });
				});
		});
};