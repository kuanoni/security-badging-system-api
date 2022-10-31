const express = require('express');
const model = require('../models/credentialModel');
const basicRoutes = require('./basicRoutes');

const credentialsRoutes = () => {
	const router = express.Router();

	// custom RegEx search for badgeOwnerName filter
	router.get('/get', async (req, res, next) => {
		const filterValue =
			req.query.filter === 'badgeOwnerName'
				? new RegExp('(^|\\s)' + req.query.value?.toLowerCase() + '\\w*', 'gsi')
				: new RegExp('^' + req.query.value?.toLowerCase(), 'i');
		const filter = { [req.query.filter]: { $regex: filterValue } };
		const projection = req.query.props ? req.query.props.replace(',', ' ') : '';

		const page = req.query.page || 1;
		const limit = req.query.limit || 30;

		try {
			const data = await model.find(filter, projection, { limit, skip: limit * (page - 1) }).sort(
				req.query.filter && {
					[req.query.filter]: 'asc',
				}
			);

			const count = await model.find(filter, projection).countDocuments();

			res.json({ documents: data, count });
		} catch (error) {
			res.status(400).json({ message: error.message });
		}

		next();
	});

	router.get('/getAvailable', async (req, res, next) => {
		const filterValue = new RegExp('^' + req.query.value?.toLowerCase(), 'i');
		const filter = { [req.query.filter]: { $regex: filterValue }, badgeOwnerId: '', badgeOwnerName: '' };
		const projection = '_id badgeType';

		const page = req.query.page || 1;
		const limit = req.query.limit || 30;

		try {
			const data = await model.find(filter, projection, { limit, skip: limit * (page - 1) }).sort(
				req.query.filter && {
					[req.query.filter]: 'asc',
				}
			);

			const count = await model.find(filter, projection).countDocuments();

			res.json({ documents: data, count });
		} catch (error) {
			res.status(400).json({ message: error.message });
		}

		next();
	});

	router.post('/post', basicRoutes.Post(model));
	router.get('/get/:id', basicRoutes.GetById(model));
	router.patch('/update/:id', basicRoutes.Update(model));
	router.delete('/delete/:id', basicRoutes.Delete(model));

	return router;
};

module.exports = credentialsRoutes;
