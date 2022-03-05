require('dotenv').config();
const path = require('path');
const express = require('express');
// optional: add express-status-monitor
// const statusMonitor = require('express-status-monitor');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
// for express-status-monitor
// const { monitorConfig } = require('./monitorConfig');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsitesRouter = require('./routes/campsites');
const partnersRouter = require('./routes/partners');
const promotionsRouter = require('./routes/promotions');

const dbServerName = process.env.DB_SERVER_NAME || 'bionicmongo';
const dbServerPort = process.env.DB_SERVER_PORT || '27017';
const dbServerProtocol = process.env.DB_SERVER_PROTO || 'mongodb';
const dbName = process.env.DB_NAME || 'nucampsite';

const url = `${dbServerProtocol}://${dbServerName}:${dbServerPort}/${dbName}`;

const connect = mongoose.connect(url, {
	useCreateIndex: true,
	useFindAndModify: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

connect.then(
	() =>
		console.log(`
	Connected to ${dbName} db on ${dbServerName} server via local network:
	${url} - everything looks OK
	`),
	(err) => console.error(err),
);

const app = express();

// for express-status-monitor
// app.use(statusMonitor(monitorConfig));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsitesRouter);
app.use('/partners', partnersRouter);
app.use('/promotions', promotionsRouter);

app.use((_, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.end('<html><body><h1>welcome to express.js</h1></body></html>');
});

module.exports = app;
