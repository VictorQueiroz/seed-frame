'use strict';

var express = require('express'),
session = require('express-session'),
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),

/**
 * This module provides "guest" sessions, meaning any visitor
 * will have a session, authenticated or not. If a session is
 * new a Set-Cookie will be produced regardless of populating
 * the session.
 */
cookieSession = require('cookie-session'),

csrf = require('csurf'),
methodOverride	= require('method-override'),
errorhandler = require('errorhandler'),
morgan = require('morgan'),

// Returns middleware that adds a X-Response-Time header to responses.
responseTime = require('response-time'),

favicon = require('serve-favicon'),
cors = require('cors'),
http = require('http'),
path = require('path'),
passport = require('passport'),
SequelizeStore = require('connect-session-sequelize')(session.Store);

module.exports = function (sequelize) {
	var app = express();

	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'ejs');

	// Enable jsonp
	app.enable('jsonp callback');

	app.use(cors());
	// app.use(favicon(path.join(__dirname, '../..', 'public', 'favicon.ico')));

	app.use(responseTime());

	app.use(morgan('dev'));

	app.use(bodyParser.urlencoded({
		extended: true
	}));  
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(cookieParser());

	// Passport required options
	app.use(session({
		// maxAge: new Date(Date.now() + 3600000),
		secret: 'something here',
		saveUninitialized: true,
		resave: true,
		// proxy: true,
		// secureProxy: true,
		store: new SequelizeStore({
			db: sequelize
		})
	}));
	
	app.use(passport.initialize());
	app.use(passport.session());

	app.disable('x-powered-by');

	app.use(express.static(path.join(__dirname, '../../public')));

	/**
	 * Transfer the 'bower_components' folder contents to '/vendor' of the 'public' folder.
	 */
	app.use('/vendor', express.static(path.join(__dirname, '../../bower_components')));
	app.use('/js', express.static(path.join(__dirname, '../../src/js')));

	// Development only
	if (app.get('env') === 'development') {
		app.use(errorhandler());
	}

	// Production only
	if (app.get('env') === 'production') {
		app.use(csrf());
	}

	return app; 
};