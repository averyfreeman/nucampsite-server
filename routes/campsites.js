const campsitesRouter = require('express').Router();

campsitesRouter
	.route('/')
	.all((_, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		next();
	})

	.get((_, res) => {
		res.end(`
			Will send all campsites to you
		`);
	})

	.post((req, res) => {
		res.end(`
			Addi campsite ${req.params.campsiteId}
			name: ${req.body.name}
			description: ${req.body.description}
		`);
	})

	.put((_, res) => {
		res.statusCode = 403;
		res.end(`
			PUT operation not supported on /campsites
		`);
	})

	.delete((_, res) => {
		res.end(`
			Deleting all campsites
		`);
	});

campsitesRouter
	.route('/:campsiteId')
	.get((req, res) => {
		res.end(`
			Campsite requested:
			${req.params.campsiteId}
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
			Updating campsite: ${req.params.campsiteId}
		`);
		res.end(`
			with name: ${req.body.name}
			with description: ${req.body.description}
		`);
	})

	.delete((req, res) => {
		res.end(`
		Deleting campsite: ${req.params.campsiteId}`);
	});

module.exports = campsitesRouter;
