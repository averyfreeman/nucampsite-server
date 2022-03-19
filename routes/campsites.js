const campsitesRouter = require('express').Router();
const Campsite = require('../models/campsite');
const authenticate = require('../authenticate.js');

campsitesRouter
	.route('/')
	.get((_, res, next) => {
		Campsite.find()
			.populate('comments.author')
			.then((campsites) => {
				console.log('found campsites', campsites);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(campsites);
			})
			.catch((err) => next(err));
	})

	.post(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Campsite.create(req.body)
				.then((campsite) => {
					console.log('campsite created', campsite);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(campsite);
				})
				.catch((err) => next(err));
		},
	)

	.put(
		authenticate.verifyUser,
		// authenticate.verifyAdmin,
		(_, res, next) => {
			res.statusCode = 403;
			res.end(`
			PUT operation not supported on /campsites
		`);
		},
	)

	.delete(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Campsite.deleteMany()
				.then((response) => {
					console.log(`deleted all campsites`, response);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(response);
				})
				.catch((err) => next(err));
		},
	);

campsitesRouter
	.route('/:campsiteId')
	.get((req, res, next) => {
		Campsite.findById(req.params.campsiteId)
			.populate('comments.author')
			.then((campsite) => {
				console.log(
					`found campsite ${req.params.campsiteId}`,
					campsite,
				);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(campsite);
			})
			.catch((err) => next(err));
	})

	.post(
		authenticate.verifyUser,
		// authenticate.verifyAdmin,
		(_, res, next) => {
			res.statusCode = 403;
			res.end(`
			POST operation not supported on specific campsite listings. Did you mean comments?
			`);
		},
	)

	.put(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
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
		},
	)

	.delete(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
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
		},
	);

campsitesRouter
	.route('/:campsiteId/comments')
	.get((req, res, next) => {
		Campsite.findById(req.params.campsiteId)
			.populate('comments.author')
			.then((campsite) => {
				if (campsite) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(campsite.comments);
				} else {
					err = new Error(`
					Campsite ${req.params.campsiteId} not found
					`);
					err.status = 404;
					return next(err);
				}
			})
			.catch((err) => next(err));
	})

	.post(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Campsite.findById(req.params.campsiteId)
				.then((campsite) => {
					if (campsite) {
						req.body.author = req.user._id;
						campsite.comments.push(req.body);
						campsite
							.save()
							.then((campsite) => {
								res.statusCode = 200;
								res.setHeader('Content-Type', 'application/json');
								res.json(campsite);
							})
							.catch((err) => next(err));
					} else {
						err = new Error(`
						Campsite ${req.params.campsiteId} not found
						`);
						err.status = 404;
						return next(err);
					}
				})
				.catch((err) => next(err));
		},
	)

	// Schema for Campsite needs to be set so comment author is validated and person who created comment is only person who can alter it
	// syntax:
	// if ((campsite.comments.id(req.params.commentId === _id).equals(req.user._id)))

	// However, author id already populated w/fake names from dummy data, so maybe devise some system in which to change the names  - or just trash the fake authors

	.put(
		authenticate.verifyUser,
		// authenticate.verifyAdmin,
		(req, res, next) => {
			res.statusCode = 403;
			res.end(`
			PUT operation not supported on /campsites/${req.params.campsiteId}/comments
		`);
		},
	)

	// deletes all comments
	.delete(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, _, next) => {
			Campsite.findById(req.params.campsiteId)
				.then((campsite) => {
					if (campsite) {
						for (let i = campsite.comments.length - 1; i >= 0; i--) {
							campsite.comments.id(campsite.comments[i]._id).remove();
						}
					} else {
						err = new Error(`
						Campsite ${req.params.campsiteId} not found
						`);
						err.status = 404;
						return next(err);
					}
				})
				.catch((err) => next(err));
		},
	);

campsitesRouter
	.route('/:campsiteId/comments/:commentId')
	.get((req, res, next) => {
		Campsite.findById(req.params.campsiteId)
			.populate('comments.author')
			.then((campsite) => {
				if (campsite && campsite.comments.id(req.params.commentId)) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(campsite.comments.id(req.params.commentId));
				} else if (!campsite) {
					err = new Error(`
					Campsite ${req.params.campsiteId} not found
					`);
					err.status = 404;
					return next(err);
				} else {
					err = new Error(`
					Comment ${req.params.commentId} not found
					`);
					err.status = 404;
					return next(err);
				}
			})
			.catch((err) => next(err));
	})

	.post(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			res.statusCode = 403;
			res.end(
				`POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`,
			);
		},
	)

	// subdocument methods: https://mongoosejs.com/docs/subdocs.html
	// e.g. campsite.comments.id()
	.put(
		authenticate.verifyUser,
		// authenticate.verifyAdmin,
		(req, res, next) => {
			Campsite.findById(req.params.campsiteId)
				.then((campsite) => {
					if (campsite && campsite.comments.id(req.params.commentId)) {
						if (
							campsite.comments
								.id(req.params.commentId)
								.author._id.equals(req.user._id)
						) {
							if (req.body.rating) {
								campsite.comments.id(req.params.commentId).rating =
									req.body.rating;
							}
							if (req.body.text) {
								campsite.comments.id(req.params.commentId).text =
									req.body.text;
							}
							campsite
								.save()
								.then((campsite) => {
									res.statusCode = 200;
									res.setHeader('Content-Type', 'application/json');
									res.json(campsite);
								})
								.catch((err) => next(err));
						} else {
							const err = new Error('not your comment').status(403);
							console.error(err);
							return next(err);
						}
					} else if (!campsite) {
						err = new Error(`
						Campsite ${req.params.campsiteId} not found
						`);
						err.status = 404;
						return next(err);
					} else {
						err = new Error(`
						Comment ${req.params.commentId} not found
						`);
						err.status = 404;
						return next(err);
					}
				})
				.catch((err) => next(err));
		},
	)

	.delete(
		authenticate.verifyUser,
		// authenticate.verifyAdmin,
		(req, res, next) => {
			Campsite.findById(req.params.campsiteId)
				.then((campsite) => {
					if (campsite && campsite.comments.id(req.params.commentId)) {
						if (
							campsite.comments
								.id(req.params.commentId)
								.author._id.equals(req.user._id)
						) {
							campsite.comments.id(req.params.commentId).remove();
							campsite
								.save()
								.then((campsite) => {
									res.statusCode = 200;
									res.setHeader('Content-Type', 'application/json');
									res.json(campsite);
								})
								.catch((err) => next(err));
						} else {
							const err = new Error('not your comment').status(403);
							console.error(err);
							return next(err);
						}
					} else if (!campsite) {
						err = new Error(`
					Campsite ${req.params.campsiteId} not found
					`);
						err.status = 404;
						return next(err);
					} else {
						err = new Error(`
					Comment ${req.params.commentId} not found
					`);
						err.status = 404;
						return next(err);
					}
				})
				.catch((err) => next(err));
		},
	);

module.exports = campsitesRouter;
