const express = require('express');

//Post Function
const Post = (model) => async (req, res, next) => {
	const data = new model(req.body);

	try {
		const dataToSave = await data.save();
		res.status(200).json(dataToSave);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}

	next();
};

//Get Function
const Get = (model) => async (req, res, next) => {
	const filterValue = new RegExp('^' + req.query.value?.toLowerCase(), 'i');
	const filter = { [req.query.filter]: { $regex: filterValue } };
	const projection = req.query.props ? req.query.props.replace(',', ' ') : '';
	const page = parseInt(req.query.page || 1);
	const limit = req.query.limit || 30;

	try {
		const data = await model.find(filter, projection, { limit, skip: limit * (page - 1) }).sort(
			req.query.filter && {
				[req.query.filter]: 'asc',
			}
		);

		const totalPages = Math.ceil((await model.find(filter, projection).countDocuments()) / limit);

		if (page > totalPages) throw new Error(`Tried fetching page ${page} when there are only ${totalPages}`);

		res.json({ documents: data, page, totalPages });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}

	next();
};

//Get by ID Function
const GetById = (model) => async (req, res, next) => {
	try {
		const data = await model.findById(req.params.id);
		res.json(data);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}

	next();
};

//Update by ID Function
const Update = (model) => async (req, res, next) => {
	try {
		const id = req.params.id;
		const updatedData = req.body;
		const options = { new: true };

		const result = await model.findByIdAndUpdate(id, updatedData, options);

		res.send(result);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}

	next();
};

//Delete by ID Function
const Delete = (model) => async (req, res, next) => {
	try {
		const id = req.params.id;
		const data = await model.findByIdAndDelete(id);
		res.send(`Document with ${data.name} has been deleted..`);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}

	next();
};

module.exports = {
	Post,
	Get,
	GetById,
	Update,
	Delete,
};
