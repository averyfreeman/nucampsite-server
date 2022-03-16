const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // create, sign, verify tokens

const config = require('./config.js');

exports.local = passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
	return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
	new JwtStrategy(opts, (jwt_payload, done) => {
		console.log('JWT payload:', jwt_payload);
		User.findOne({ _id: jwt_payload._id }, (err, user) => {
			if (err) {
				return done(err, false); // error, no user founda
			} else if (user) {
				return done(null, user); // no error, user found
			} else {
				return done(null, false); // no error, no user found
			}
		});
	}),
);

exports.verifyUser = passport.authenticate(jwt, { session: false });
exports.verifyAdmin = (req, res, next) => {
	if (req.user.admin) {
		return next();
	} else {
		const err = new Error(`Your account is not an admin`);
		res.status = 403;
		return next(err);
		// passport.authenticate(jwt, { session: false });
	}
};
