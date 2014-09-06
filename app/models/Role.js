'use strict';

module.exports = function (sequelize, DataTypes) {
	var Role = sequelize.define('Role', {
		name: DataTypes.STRING(255)
	}, {
    freezeTableName: true,
    timestamps: true,
    paranoid: false,
    underscored: true,
    tableName: 'roles'
	});

	return Role;
};