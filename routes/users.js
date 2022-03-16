const usersRouter = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate.js');

/* GET users listing. */
usersRouter.get('/', (_, res, next) => {
	authenticate.verifyUser,
		authenticate.verifyAdmin,
		User.find()
			.then((users) => {
				console.log('users list retrieved');
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(users);
			})
			.catch((err) => next(err));
});

usersRouter.post(
	'/signup',
	// authenticate.verifyUser,
	// authenticate.verifyAdmin,
	(req, res) => {
		// if (req.user) {
		// 	console.dir(req.user);
		// 	res.err = new Error(`User already exists`);
		// 	res.statusCode = 200;
		// 	res.setHeader('Content-Type', 'application/json');
		// }
		User.register(
			new User({
				username: req.body.username,
			}),
			req.body.password,
			(err, user) => {
				if (err) {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
					res.json({ err: err });
				} else {
					if (req.body.firstname) {
						user.firstname = req.body.firstname;
					}
					if (req.body.lastname) {
						user.lastname = req.body.lastname;
					}
					user.save((err) => {
						if (err) {
							res.statusCode = 500;
							res.setHeader('Content-Type', 'application/json');
							res.json({ err: err });
							return;
						}
						passport.authenticate('local')(req, res, () => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json({
								success: true,
								status: 'Registration successful',
							});
						});
					});
				}
			},
		);
	},
);

usersRouter.post(
	'/login',
	passport.authenticate('local'),
	(req, res) => {
		const token = authenticate.getToken({ _id: req.user._id });
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			success: true,
			token: token,
			// token, // es6 rules apply to res.json()?
			status: `You are logged in`,
		});
	},
);

usersRouter.get('/logout', (req, res, next) => {
	console.log(req.session);
	if (req.session) {
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect('/');
	} else {
		const err = new Error('You are not logged in!');
		err.status = 401;
		return next(err);
	}
});

usersRouter
	.route('/:userId')
	.get(
		// authenticate.verifyUser,
		// authenticate.verifyAdmin,
		(req, res, next) => {
			User.findById(req.params.userId)
				.then((user) => {
					console.log('user loaded');
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(user);
				})
				.catch((err) => next(err));
		},
	)

	.post(
		// authenticate.verifyUser,
		// authenticate.verifyAdmin,
		(_, res) => {
			res.statusCode = 403;
			res.end(`
			  POST operation not supported on /users/:_id
			`);
		},
	)
	// PUT for user modification not working yet
	.put(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			user
				.findByIdAndUpdate(
					req.params.userId,
					{
						$set: req.body,
					},
					{
						new: true,
					},
				)
				.then((user) => {
					console.log('user updated', user);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(user);
				})
				.catch((err) => next(err));
		},
	)
	.delete((req, res, next) => {
		authenticate.verifyUser,
			authenticate.verifyAdmin,
			User.findByIdAndDelete(req.params.userId)
				.then((response) => {
					console.log(`deleted user ${req.params.userId}`, response);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(response);
				})
				.catch((err) => next(err));
	});

module.exports = usersRouter;
