'use strict';

var models = require('../models'),
Post = models.Post,
User = models.User,
passport = require('passport'),
faker = require('faker'),
_ = require('underscore-node');

exports.seed = function (req, res) {
	var posts = [];

	for (var i = 0; i < 800; i++) {
		posts.push({
			title: faker.Lorem.sentences(8),
			user_id: 1,
			body: faker.Lorem.sentences(300)
		});
	};

	Post
		.bulkCreate(posts)
		.success(function (posts) {
			res.json(posts);
		});
};

exports.list = function (req, res) {
	var query = req.query;

	query.page = parseInt(query.page ? query.page : 1);
	query.per_page = query.per_page ? query.per_page : 4;

	var offset = (query.page - 1) * (query.per_page),
	limit = parseInt(query.per_page);

	Post
		.findAndCountAll({
			limit: limit,
			offset: offset,
			order: 'updated_at DESC'
		})

		.success(function(result) {
			var posts = result.rows;
			var count = result.count;

			res.json({
				current: query.page,
				pageCount: Math.ceil((count / limit - 1) + 1),
				count: count,
				data: posts
			});			
		});
};

exports.get = function (req, res) {
	var id = req.params.id;

	Post
		.find({
			where: {
				id: id
			},

			include: [{
				model: User
			}]
		})
		.success(function(post) {
			if(post)
				res.json(post);
		});
};

exports.store = function (req, res) {
	var data = _.pick(req.body,
		'title',
		'body'
	);

	data.user_id = req.user.id;

	Post
		.create(data)
		.success(function(post) {
			if(post)
				res.json(post);
		});
};

exports.update = function (req, res) {
	var id = req.params.id;
	var data = _.pick(req.body, 'title', 'body');
	var where = {
		id: id,
		user_id: req.user.id
	};

	Post
		.update(data, where)
		.success(function() {
			Post
				.find({	id: id })
				.success(function(post) {
					if(post)
						res.json(post);
				});
		});
 };

exports.destroy = function (req, res) {
	var id = req.params.id;

	Post
		.destroy({ id: id })
		.success(function() {
			Post.find({ id: id })
			.success(function(post) {
				if(!post)
					res.json({ result: true });
				else
					res.json({ result: false });
			});
		});
};