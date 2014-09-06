'use strict';

var Sequelize = require('sequelize'),
options = require('./config').database;

var sequelize = new Sequelize(options.database, options.user, options.password, {
	host: options.host,
	dialect: options.dialect,
  logging: false,
});

sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database:', err);
    } else {
      console.log('Connection has been established successfully.');
    }
  });

module.exports = sequelize;