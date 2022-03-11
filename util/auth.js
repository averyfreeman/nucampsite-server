exports.auth = (req, res, next) => {
	console.log('req.session: ', req.session);
	if (!req.session.user) {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			const err = new Error('You are not authenticated');
			res.setHeader('WWW-Authenticate', 'Basic');
			err.status = 401;
			return next(err);
		}
		const auth = Buffer.from(authHeader.split(' ')[1], 'base64')
			.toString()
			.split(':');
		const user = auth[0];
		const pass = auth[1];
		if (user === 'admin' && pass === 'password') {
			req.session.user === 'admin';

			return next(); // authorized
		} else {
			const err = new Error('You are not authenticated');
			res.setHeader('WWW-Authenticate', 'Basic');
			err.status = 401;
			return next(err);
		}
	} else if (req.session.user === 'admin') {
		return next();
	} else {
		const err = new Error('You are not authenticated');
		err.status = 401;
		return next(err);
	}
};
