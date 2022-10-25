const express = require('express');

const createRouterForModel = (model) => {
	const router = express.Router();

	//Post Method
	router.post('/post', async (req, res) => {
		const data = new model({
			badgeNumber: req.body.badgeNumber,
			badgeType: req.body.badgeType,
			badgeOwnerId: req.body.badgeOwnerId,
			badgeOwnerName: req.body.badgeOwnerName,
		});

		try {
			const dataToSave = await data.save();
			res.status(200).json(dataToSave);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	});

	//Get Method
	router.get('/get', async (req, res) => {
		const searchValue = new RegExp('^' + req.query.value?.toLowerCase(), 'i');
		const queryObj = { [req.query.searchBy]: { $regex: searchValue } };

		const page = req.query.page || 1;
		const limit = req.query.limit || 30;

		console.log(queryObj);

		try {
			const data = await model.find(queryObj, null, { limit, skip: limit * (page - 1) }).sort(
				req.query.searchBy && {
					[req.query.searchBy]: 'asc',
				}
			);
			res.json(data);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	});

	//Get by ID Method
	router.get('/get/:id', async (req, res) => {
		try {
			const data = await model.findById(req.params.id);
			res.json(data);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	});

	//Get total count Method
	router.get('/count', async (req, res) => {
		try {
			const data = await model.find().estimatedDocumentCount();
			res.json(data);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	});

	//Update by ID Method
	router.patch('/update/:id', async (req, res) => {
		try {
			const id = req.params.id;
			const updatedData = req.body;
			const options = { new: true };

			const result = await model.findByIdAndUpdate(id, updatedData, options);

			res.send(result);
			console.log(result);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	});

	//Delete by ID Method
	router.delete('/delete/:id', async (req, res) => {
		try {
			const id = req.params.id;
			const data = await model.findByIdAndDelete(id);
			res.send(`Document with ${data.name} has been deleted..`);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	});

	return router;
};

module.exports = createRouterForModel;
