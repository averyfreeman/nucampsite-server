const promotionsRouter = require('express').Router();

promotionsRouter
	.route('/')
	.all((_, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		next();
	})

	.get((_, res) => {
		res.end(`
			Will send all promotions to you
		`);
	})

	.post((req, res) => {
		res.end(`
			Adding promotion ${req.params.promotionId}
			name: ${req.body.name}
			description: ${req.body.description}
		`);
	})

	.put((_, res) => {
		res.statusCode = 403;
		res.end(`
			PUT operation not supported on /promotions
		`);
	})

	.delete((_, res) => {
		res.end(`
			Deleting all promotions
		`);
	});

promotionsRouter
	.route('/:promotionId')
	.get((req, res) => {
		res.end(`
			promotion requested:
			${req.params.promotionId}
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
			Updating promotion: ${req.params.promotionId}
		`);
		res.end(`
			with name: ${req.body.name}
			with description: ${req.body.description}
		`);
	})

	.delete((req, res) => {
		res.end(`
		Deleting promotion: ${req.params.promotionId}`);
	});

module.exports = promotionsRouter;
