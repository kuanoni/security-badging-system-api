const express = require('express');
const cardholderModel = require('../models/cardholderModel');
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
		const page = parseInt(req.query.page || 1);
		const limit = req.query.limit || 30;
		const sort =
			req.query.filter && !req.query.sortBy
				? {
						[req.query.filter]: 'asc',
				  }
				: req.query.sortBy && {
						[req.query.sortBy]: req.query.order ? req.query.order : 'asc',
				  };

		try {
			const data = await model.find(filter, projection, { limit, skip: limit * (page - 1) }).sort(sort);

			const totalPages = Math.ceil((await model.find(filter, projection).countDocuments()) / limit);

			if (page > totalPages) throw new Error(`Tried fetching page ${page} when there are only ${totalPages}`);

			res.json({ documents: data, page, totalPages });
		} catch (error) {
			res.status(400).json({ message: error.message });
		}

		next();
	});

	router.get('/getAvailable', async (req, res, next) => {
		const filterValue = new RegExp('^' + req.query.value?.toLowerCase(), 'i');
		const filter = {
			[req.query.filter]: { $regex: filterValue },
			badgeOwnerId: '',
			badgeOwnerName: '',
			status: true,
		};
		const projection = '_id badgeType';
		const page = parseInt(req.query.page || 1);
		const limit = req.query.limit || 30;
		const sort =
			req.query.filter && !req.query.sortBy
				? {
						[req.query.filter]: 'asc',
				  }
				: req.query.sortBy && {
						[req.query.sortBy]: req.query.order ? req.query.order : 'asc',
				  };

		try {
			const data = await model.find(filter, projection, { limit, skip: limit * (page - 1) }).sort(sort);

			const totalPages = Math.ceil((await model.find(filter, projection).countDocuments()) / limit);

			if (page > totalPages) throw new Error(`Tried fetching page ${page} when there are only ${totalPages}`);

			res.json({ documents: data, page, totalPages });
		} catch (error) {
			res.status(400).json({ message: error.message });
		}

		next();
	});

	router.delete('/delete/:id', async (req, res) => {
		try {
			const id = req.params.id;
			const credential = await model.findById(id);

			const queries = [];

			const cardholderOwner = await cardholderModel.findById(credential.badgeOwnerId);

			if (cardholderOwner?._doc) {
				const newCardholderCredentials = cardholderOwner._doc.credentials.filter((cred) => cred._id !== id);

				queries.push(
					cardholderModel.findOneAndUpdate(
						{ _id: cardholderOwner._doc._id },
						{
							...cardholderOwner._doc,
							credentials: newCardholderCredentials,
						},
						{
							new: true,
						}
					)
				);
			}

			const result = await Promise.all([...queries, model.findByIdAndDelete(id)]);

			res.send(result);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	});

	router.post('/post', basicRoutes.Post(model));
	router.get('/get/:id', basicRoutes.GetById(model));
	router.patch('/update/:id', basicRoutes.Update(model));

	return router;
};

module.exports = credentialsRoutes;
