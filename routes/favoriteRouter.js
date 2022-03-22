const favoriteRouter = require('express').Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorite = require('../models/favoriteSchema');

favoriteRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res, next) =>
		res
			.sendStatus(200)
			.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
				Favorite.find({ user: req.user._id })
					.populate('user')
					.populate('campsites')
					.then((favorite) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					})
					.catch((err) => next(err));
			})

			.post(
				authenticate.verifyUser,
				// authenticate.verifyAdmin,
				cors.cors,
				(req, res, next) => {
					Favorite.findOne({ user: req.user._id })
						.then((favorite) => {
							if (favorite) {
								req.body.forEach((fave) => {
									if (!favorite.campsites.includes(fave._id)) {
										favorite.campsites.push(fave._id);
									}
								});
								favorite
									.save()
									.then((favorite) => {
										res.statusCode = 200;
										res.setHeader('Content-Type', 'application/json');
										res.json(favorite);
									})
									.catch((err) => next(err));
							} else {
								Favorite.create({
									user: req.user._id,
									campsites: req.body,
								})
									.then((favorite) => {
										console.log('created favorite', favorite);
										res.statusCode = 200;
										res.setHeader('Content-Type', 'application/json');
										res.json(favorite);
									})
									.catch((err) => next(err));
							}
						})
						.catch((err) => next(err))

						.put(
							cors.corsWithOptions,
							authenticate.verifyUser,
							(req, res, next) => {
								res.statusCode = 403;
								res.setHeader('Content-Type', 'text/plain');
								res.end('PUT operation not supported on /favorites');
							},
						)

						.delete(
							cors.corsWithOptions,
							authenticate.verifyUser,
							(req, res, next) => {
								Favorite.findOne({ user: req.user._id })
									.then((favorite) => {
										if (favorite) {
											// get indexOf query string:
											const idx = favorite.campsites.indexOf(
												req.params.campsiteId,
											);
											// pull out query string ref if it's bigger than 0
											if (idx >= 0) {
												favorite.campsites.splice(idx, 1);

												// another method, filter everything but what you're looking for:
												// favorite.campsites = favorite.campsites.filter(fave => fave.toString() !== req.params.campsiteId);
												// method 3: map match. may work or not (not sure)
												// favorite.map((fave) => fave._id === req.params.campsiteId) // ???!!!
											}
											favorite
												.save()
												.then((favorite) => {
													res.statusCode = 200;
													res.setHeader(
														'Content-Type',
														'application/json',
													);
													res.json(favorite);
												})
												.catch((err) => next(err));
										} else {
											res.statusCode = 403;
											res.setHeader('Content-Type', 'text/plain');
											res.end('no favorites to delete');
										}
									})
									.catch((err) => next(err));
							},
						);

					favoriteRouter
						.route('/:favoriteId')
						.get(
							cors.cors,
							authenticate.verifyUser,
							(req, res, next) => {
								res.statusCode = 403;
								res.setHeader('Content-Type', 'text/plain');
								res.end(
									'GET operation not supported on favorites/:favoriteId',
								);
							},
						)
						.put(
							cors.corsWithOptions,
							authenticate.verifyUser,
							(req, res, next) => {
								res.statusCode = 403;
								res.setHeader('Content-Type', 'text/plain');
								res.end(
									'PUT operation not supported on favorites/:favoriteId',
								);
							},
						)
						.post(
							cors.corsWithOptions,
							authenticate.verifyUser,
							// authenticate.verifyAdmin,
							(req, res, next) => {
								Favorite.findOne({ user: req.user._id })
									.then((favorite) => {
										if (favorite) {
											if (
												!favorite.campsites.includes(
													req.params.campsiteId,
												)
											) {
												favorite.campsites.push(req.params.campsiteId);
											}
											res.statusCode = 200;
											favorite
												.delete()
												.then((favorite) => {
													res.statusCode = 200;
													res.setHeader(
														'Content-Type',
														'application/json',
													);
													res.json(favorite);
												})
												.catch((err) => next(err));
										} else {
											Favorite.create({
												user: req.user._id,
												campsites: [req.params.campsiteId],
											})
												.then((favorite) => {
													console.log('added favorite', favorite);
													res.statusCode = 200;
													res.setHeader('Content-Type', 'text/plain');
													res.end('no favorites left to delete');
												})
												.catch((err) => next(err));
										}
									})
									.catch((err) => next(err));
							},
						)
						.delete(
							cors.cors,
							authenticate.verifyUser,
							// authenticate.verifyAdmin,
							(req, res, next) => {
								Favorite.findOneAndDelete({ user: req.user._id })
									.then((favorite) => {
										if (favorite) {
											res.statusCode = 200;
											favorite
												.delete()
												.then((favorite) => {
													res.statusCode = 200;
													res.setHeader(
														'Content-Type',
														'application/json',
													);
													res.json(favorite);
												})
												.catch((err) => next(err));
										} else {
											Favorite.delete({
												user: req.user._id,
												campsites: req.body,
											})
												.then((favorite) => {
													console.log('deleted favorite', favorite);
													res.statusCode = 200;
													res.setHeader(
														'Content-Type',
														'application/json',
													);
													res.json(favorite);
												})
												.catch((err) => next(err));
										}
									})
									.catch((err) => next(err));
							},
						);
				},
			),
	);

module.exports = favoriteRouter;
