const promotionRouter = require('express').Router();
const Promotion = require('../models/promotion');
const authenticate = require('../authenticate.js');

promotionRouter
	.route('/')
	.get((_, res, next) => {
		Promotion.find()
			.then((promotions) => {
				console.log('promotions retrieved');
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotions);
			})
			.catch((err) => next(err));
	})

	.post(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Promotion.create(req.body)
				.then((promotions) => {
					console.log('promotions created');
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(promotions);
				})
				.catch((err) => next(err));
		},
	)

	.put(authenticate.verifyUser, authenticate.verifyAdmin, (_, res) => {
		res.statusCode = 403;
		res.end(`r
			PUT operation not supported on /promotions
		`);
	})

	.delete(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(_, res, next) => {
			Promotion.deleteMany()
				.then((response) => {
					console.log('Promotions deleted');
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(response);
				})
				.catch((err) => next(err));
		},
	);

promotionRouter
	.route('/:promotionId')
	.get((req, res, next) => {
		Promotion.findById(req.params.promotionId)
			.then((promotion) => {
				console.log('promotion retrieved');
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotion);
			})
			.catch((err) => next(err));
	})

	.post(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res) => {
			res.statusCode = 403;
			res.end(`
			POST operation not supported on ${req.params.promotionId}
			`);
		},
	)

	.put(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Promotion.findByIdAndUpdate(
				req.params.promotionId,
				{
					$set: req.body,
				},
				{
					new: true,
				},
			)
				.then((promotions) => {
					console.log('promotion updated');
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(promotions);
				})
				.catch((err) => next(err));
		},
	)

	.delete(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Promotion.findByIdAndDelete(req.params.promotionId)
				.then((response) => {
					console.log(
						`deleted promotion ${req.params.promotionId}`,
						response,
					);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(response);
				})
				.catch((err) => next(err));
		},
	);

module.exports = promotionRouter;
