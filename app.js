require('dotenv').config();
const path = require('path');
const express = require('express');
const logger = require('morgan');
const statusMonitor = require('express-status-monitor');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { config } = require('./config/monitor');
const { auth } = require('./util/auth');
/*  import routes   */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsitesRouter = require('./routes/campsites');
const partnersRouter = require('./routes/partners');
const promotionsRouter = require('./routes/promotions');
/*   end imports    */

/*     mongodb      */
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
/*  end mongodb    */

const app = express();

/*   middlewares   */
app.use(statusMonitor(config));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(auth);

/*   use routes    */
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsitesRouter);
app.use('/partners', partnersRouter);
app.use('/promotions', promotionsRouter);

// % todo: improve, needs 404
app.use((err, req, res, next) => {
	if (req.accepts('html')) {
		res
			.status(200)
			.set('Content-Type', 'text/html')
			.end('<html><body><h1>welcome to express.js</h1></body></html>')
			.catch((err) => next(err));
	}
	if (err) {
		new Error(err);
	}
});

module.exports = app;
