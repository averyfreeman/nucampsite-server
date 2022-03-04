const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsitesRouter = require('./routes/campsites');
const partnersRouter = require('./routes/partners');
const promotionsRouter = require('./routes/promotions');

const dbServerName = 'bionicmongo';
const dbServerPort = '27017';
const dbServerProtocol = 'mongodb';
const dbName = 'nucampsite';

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

app.use((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.end('<html><body><h1>welcome to express.js</h1></body></html>');
});

module.exports = app;
