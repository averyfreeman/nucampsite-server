const partnersRouter = require('express').Router();
const Campsite = require('../models/partner');

partnersRouter
	.route('/')

	.get((req, res, next) => {
		Campsite.find()
			.then((partners) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(partners);
			})
			.catch((err) => next(err));
	})

	.post((req, res) => {
		Campsite.create(req.body)
			.then((partner) => {
				console.log('partner created', partner);
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
		Campsite.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	});

partnersRouter
	.route('/:partnerId')
	.get((req, res, next) => {
		Campsite.findById(req.params.partnerId)
			.then((partner) => {
				console.log('partner updated', partner);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(partner);
			})
			.catch((err) => next(err));
	})

	.post((req, res) => {
		res.statusCode = 403;
		res.end(`
			POST operation not supported on ${req.params.partnerId}
			`);
	})

	.put((req, res, next) => {
		Campsite.findByIdAndUpdate(
			req.params.partnerId,
			{
				$set: req.body,
			},
			{
				new: true,
			},
		)
			.then((partner) => {
				console.log('partner updated', partner);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(partner);
			})
			.catch((err) => next(err));
	})

	.delete((req, res, next) => {
		Campsite.findByIdAndDelete(req.params.partnerId)
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
