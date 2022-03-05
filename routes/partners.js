const partnersRouter = require('express').Router();
const Partner = require('../models/partner');

partnersRouter
	.route('/')
	.get((req, res, next) => {
		Partner.find()
			.then((partners) => {
				console.log('partners retrieved');
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(partners);
			})
			.catch((err) => next(err));
	})

	.post((req, res, next) => {
		Partner.create(req.body)
			.then((partner) => {
				console.log('partner created');
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(partner);
			})
			.catch((err) => next(err));
	})

	.put((req, res) => {
		res.statusCode = 403;
		res.end(`
			PUT operation not supported on /partners
		`);
	})

	.delete((req, res, next) => {
		Partner.deleteMany()
			.then((response) => {
				console.log('Partners deleted');
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	});

partnersRouter
	.route('/:partnerId')
	.get((req, res, next) => {
		Partner.findById(req.params.partnerId)
			.then((partner) => {
				console.log('partner retrieved');
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(partner);
			})
			.catch((err) => next(err));
	})

	.post((req, res) => {
		res.status(403).end(`
			POST operation not supported on ${req.params.partnerId}
			`);
	})

	.put((req, res, next) => {
		Partner.findByIdAndUpdate(
			req.params.partnerId,
			{
				$set: req.body,
			},
			{
				new: true,
			},
		)
			.then((partner) => {
				console.log('partner updated');
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(partner);
			})
			.catch((err) => next(err));
	})

	.delete((req, res, next) => {
		Partner.findByIdAndDelete(req.params.partnerId)
			.then((response) => {
				console.log(
					`deleted partner ${req.params.partnerId}`,
					response,
				);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	});

module.exports = partnersRouter;
