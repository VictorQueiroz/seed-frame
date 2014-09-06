'use strict';

module.exports = function (sequelize, DataTypes) {
	var Post = sequelize.define('Post', {
		title: DataTypes.STRING(255),
		body: DataTypes.TEXT
	}, {
    freezeTableName: true,
    timestamps: true,
    paranoid: false,
    underscored: true,
    tableName: 'posts'
	});

	return Post;
};