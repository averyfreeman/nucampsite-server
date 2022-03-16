const indexRouter = require('express').Router();

/* GET home page. */
indexRouter.get('/', (_, res) => {
	return res.render('index', { title: 'R E S T' });
});

module.exports = indexRouter;
