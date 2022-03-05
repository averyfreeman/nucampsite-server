const promotionssRouter = require('express').Router();
const Campsite = require('../models/promotions');

promotionssRouter
	.route('/')

	.get((req, res, next) => {
		Campsite.find()
			.then((promotionss) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotionss);
			})
			.catch((err) => next(err));
	})

	.post((req, res) => {
		Campsite.create(req.body)
			.then((promotions) => {
				console.log('promotions created', promotions);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotions);
			})
			.catch((err) => next(err));
	})

	.put((req, res) => {
		res.statusCode = 403;
		res.end(`
			PUT operation not supported on /promotionss
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

promotionssRouter
	.route('/:promotionsId')
	.get((req, res, next) => {
		Campsite.findById(req.params.promotionsId)
			.then((promotions) => {
				console.log('promotions updated', promotions);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotions);
			})
			.catch((err) => next(err));
	})

	.post((req, res) => {
		res.statusCode = 403;
		res.end(`
			POST operation not supported on ${req.params.promotionsId}
			`);
	})

	.put((req, res, next) => {
		Campsite.findByIdAndUpdate(
			req.params.promotionsId,
			{
				$set: req.body,
			},
			{
				new: true,
			},
		)
			.then((promotions) => {
				console.log('promotions updated', promotions);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotions);
			})
			.catch((err) => next(err));
	})

	.delete((req, res, next) => {
		Campsite.findByIdAndDelete(req.params.promotionsId)
			.then((response) => {
				console.log(
					`deleted promotions ${req.params.promotionsId}`,
					response,
				);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	});

module.exports = promotionssRouter;
