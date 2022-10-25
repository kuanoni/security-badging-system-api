const express = require('express');
const Cardholder = require('../models/cardholderModel');

const router = express.Router();
module.exports = router;

//Post Method
router.post('/post', async (req, res) => {
	const data = new Cardholder({
		avatar: req.body.avatar,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		employeeId: req.body.employeeId,
		jobTitle: req.body.jobTitle,
		profileStatus: req.body.profileStatus,
		activationDate: req.body.badgeOwnerName,
		expirationDate: req.body.expirationDate,
		profileType: req.body.profileType,
		credentials: req.body.credentials,
		accessGroups: req.body.accessGroups,
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
	const queryValue = new RegExp('.*' + req.query.value + '.*', 'i');
	const queryObj = {
		[req.query.searchBy]: { $regex: queryValue },
	};

	try {
		const data = await Cardholder.find(queryObj);
		res.json(data);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

//Get by ID Method
router.get('/get/:id', async (req, res) => {
	try {
		const data = await Cardholder.findById(req.params.id);
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

		const result = await Cardholder.findByIdAndUpdate(id, updatedData, options);

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
		const data = await Cardholder.findByIdAndDelete(id);
		res.send(`Document with ${data.name} has been deleted..`);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});
