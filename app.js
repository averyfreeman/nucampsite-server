require('dotenv').config();
const path = require('path');
const util = (require('util').inspect.defaultOptions.depth = null);
const express = require('express');
const logger = require('morgan');
const monitor = require('express-status-monitor');
const createError = require('http-errors');
// util.inspect.defaultOptions.depth = null;
// const cookieParser = require('cookie-parser'); // still req. ?
const session = require('express-session');
const FileStore = require('session-file-store')(session);
/*  local modules   */
const { auth } = require('./util/auth');
const { config } = require('./config/monitor');
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
app.use(monitor(config));
// app.use(monitor(config));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// do not use cookieParser, but if same secret might work LOL
// app.use(cookieParser('12345-67890-ABCDE-FGHIJ'));
app.use(
	session({
		name: 'session-id',
		secret: '12345-67890-ABCDE-FGHIJ',
		saveUninitialized: true, // req true to save session-id
		resave: false,
		store: new FileStore(),
	}),
);

app.use(auth);

/*     use routes     */
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsitesRouter);
app.use('/partners', partnersRouter);
app.use('/promotions', promotionsRouter);

// 404 handler: vanilla express-gen if !== --no-view
app.use((res, req, next) => {
	return next().catch(createError(404));
});

app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	x;
	res.render('error');
});

module.exports = app;
