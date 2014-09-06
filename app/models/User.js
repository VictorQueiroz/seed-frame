'use strict';

module.exports = function (sequelize, DataTypes) {
	var User = sequelize.define('User', {
		name: {
			type: DataTypes.STRING (100),
		},

		username: {
			type: DataTypes.STRING (20),
		},

		email: {
			type: DataTypes.STRING(255),
			isEmail: true
		},

		password: {
			type: DataTypes.STRING(255)
		},

		fb_id: { // Facebook
			type: DataTypes.STRING(255)
		},

		go_id: { // Google
			type: DataTypes.STRING(255)
		},

		tw_id: { // Twitter
			type: DataTypes.STRING(255)
		},

		gh_id: { // Github
			type: DataTypes.STRING(255)
		}
	}, {
    freezeTableName: true,
    timestamps: true,
    paranoid: false,
    underscored: true,
    classMethods: {
      associate: function(models) {
      	var Post = models.Post;
      	var Role = models.Role;

				Post.belongsTo(User);

				User.hasMany(Post);

				Role.hasMany(User, {
					through: 'user_roles'
				});

				User.hasMany(Role, {
					through: 'user_roles'
				});
      }
   	},
   	tableName: 'users'
	});	

	return User;
};