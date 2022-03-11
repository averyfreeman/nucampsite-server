/*     mongodb      */
const mongoose = require('mongoose');
const { chalkChecks } = require('../config/logColors');
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
		chalkChecks(
			console.log,
			`Connected to`,
			`${dbName} db on ${dbServerName}`,
			`mongodb url`,
			`${url}`,
			`statistics`,
			`http://localhost:3000/status`,
		),
	(err) => console.error(err),
);
/*    end mongodb    */

module.exports = {
	db: {
		connect,
		url,
		dbServerName,
		dbServerProtocol,
		dbName,
	},
};
