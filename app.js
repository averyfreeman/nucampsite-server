require('dotenv').config();
const path = require('path');
const express = require('express');
const logger = require('morgan');
const statusMonitor = require('express-status-monitor');
const cookieParser = require('cookie-parser');
/*  local modules   */
const { config } = require('./config/monitor');
const { auth } = require('./util/auth');
/*      routes      */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsitesRouter = require('./routes/campsites');
const partnersRouter = require('./routes/partners');
const promotionsRouter = require('./routes/promotions');

/*      mongo       */
const { db } = require('./util/dbConnect');
const { url, dbServerName, dbServerProtocol, dbName } = db;

const app = express();

/*      view ng      */
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

/*    middlewares    */
app.use(statusMonitor(config));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('9359c7d2-b3e7-4075-9272-379a8c3ca927'));

app.use(auth);

/*     use routes     */
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsitesRouter);
app.use('/partners', partnersRouter);
app.use('/promotions', promotionsRouter);

// 404 handler: vanilla express-gen if !== --no-view
app
	.use((_, req, next) => {
		next(createError(404));
	})
	.use((err, req, res) => {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
		res.status(err.status || 500);
		res.render('error');
	});

module.exports = app;
