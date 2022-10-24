const express = require('express');
const Credential = require('../models/credentialModel');

const router = express.Router();
module.exports = router;

//Post Method
router.post('/post', async (req, res) => {
	const data = new Credential({
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

//Get all Method
router.get('/get', async (req, res) => {
	try {
		const data = await Model.find();
		res.json(data);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

//Get by ID Method
router.get('/get/:id', async (req, res) => {
	try {
		const data = await Model.findById(req.params.id);
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

		const result = await Model.findByIdAndUpdate(id, updatedData, options);

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
		const data = await Model.findByIdAndDelete(id);
		res.send(`Document with ${data.name} has been deleted..`);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});
