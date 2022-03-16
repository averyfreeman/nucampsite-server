const path = require('path');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config.js');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsitesRouter = require('./routes/campsites');
const partnersRouter = require('./routes/partners');
const promotionsRouter = require('./routes/promotions');

const url = config.mongoUrl;
const db = mongoose.connect(url, {
	useCreateIndex: true,
	useFindAndModify: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

db.then(
	() => console.info(`connected to: ${url}`),
	(err) => console.error(err),
);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/campsites', campsitesRouter);
app.use('/promotions', promotionsRouter);
app.use('/partners', partnersRouter);

app.use((req, res, next) => {
	res.statusCode = 404;
	res.setHeader('Content-Type', 'application/json');
	const err = new Error('misplaced sausage', 404);
	return next(err);
});

function errorHandler(err, req, res, next) {
	if (res.headersSent) {
		return next(err);
	}
	res.status(500);
	res.render('error', { error: err });
}

module.exports = app;
