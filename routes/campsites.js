const campsitesRouter = require('express').Router();
const Campsite = require('../models/campsite');

campsitesRouter
	.route('/')

	.get((req, res, next) => {
		Campsite.find()
			.then((campsites) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(campsites);
			})
			.catch((err) => next(err));
	})

	.post((req, res) => {
		Campsite.create(req.body)
			.then((campsite) => {
				console.log('campsite created', campsite);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(campsite);
			})
			.catch((err) => next(err));
	})

	.put((req, res) => {
		res.statusCode = 403;
		res.end(`
			PUT operation not supported on /campsites
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

campsitesRouter
	.route('/:campsiteId')
	.get((req, res, next) => {
		Campsite.findById(req.params.campsiteId)
			.then((campsite) => {
				console.log('campsite updated', campsite);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(campsite);
			})
			.catch((err) => next(err));
	})

	.post((req, res) => {
		res.statusCode = 403;
		res.end(`
			POST operation not supported on ${req.params.campsiteId}
			`);
	})

	.put((req, res, next) => {
		Campsite.findByIdAndUpdate(
			req.params.campsiteId,
			{
				$set: req.body,
			},
			{
				new: true,
			},
		)
			.then((campsite) => {
				console.log('campsite updated', campsite);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(campsite);
			})
			.catch((err) => next(err));
	})

	.delete((req, res, next) => {
		Campsite.findByIdAndDelete(req.params.campsiteId)
			.then((response) => {
				console.log(
					`deleted campsite ${req.params.campsiteId}`,
					response,
				);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	});

module.exports = campsitesRouter;
