const partnersRouter = require('express').Router();

partnersRouter
	.route('/')
	.all((_, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		next();
	})

	.get((_, res) => {
		res.end(`
			Will send all partners to you
		`);
	})

	.post((req, res) => {
		res.end(`
			Addi partner ${req.params.partnerId}
			name: ${req.body.name}
			description: ${req.body.description}
		`);
	})

	.put((_, res) => {
		res.statusCode = 403;
		res.end(`
			PUT operation not supported on /partners
		`);
	})

	.delete((_, res) => {
		res.end(`
			Deleting all partners
		`);
	});

partnersRouter
	.route('/:partnerId')
	.get((req, res) => {
		res.end(`
			partner requested:
			${req.params.partnerId}
		`);
	})

	.post((req, res) => {
		res.statusCode = 403;
		res.end(`
			POST operation not supported on ${req.body.name}
		`);
	})

	.put((req, res) => {
		res.write(`
			Updating partner: ${req.params.partnerId}
		`);
		res.end(`
			with name: ${req.body.name}
			with description: ${req.body.description}
		`);
	})

	.delete((req, res) => {
		res.end(`
		Deleting partner: ${req.params.partnerId}`);
	});

module.exports = partnersRouter;
