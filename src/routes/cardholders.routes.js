const express = require('express');
const model = require('../models/cardholderModel');
const credentialModel = require('../models/credentialModel');
const accessGroupModel = require('../models/accessGroupModel');
const basicRoutes = require('./basicRoutes');

const updateParallelDocuments = async (oldCardholder, newCardholder, docKey, model, addFn, removeFn) => {
	const oldDocIds = oldCardholder[docKey].map((doc) => doc._id);
	const newDocIds = newCardholder[docKey].map((doc) => doc._id);

	const documentIdsToUpdate = [
		...oldDocIds.filter((_, i) => oldDocIds[i] !== newDocIds[i]),
		...newDocIds.filter((_, i) => oldDocIds[i] !== newDocIds[i]),
	];

	documentIdsToUpdate.forEach(async (documentId) => {
		const updatedDocument = await model.findById(documentId);

		if (oldDocIds.includes(documentId)) {
			// cardholder is removed

			await model.findByIdAndUpdate(documentId, {
				...updatedDocument._doc,
				badgeOwnerId: '',
				badgeOwnerName: '',
			});
		}
		if (newDocIds.includes(documentId)) {
			// cardholder is added

			await model.findByIdAndUpdate(documentId, {
				...updatedDocument._doc,
				badgeOwnerId: newCardholder._id,
				badgeOwnerName: newCardholder.firstName + ' ' + newCardholder.lastName,
			});
		}
	});
};

// updateParallelDocuments(cholder1, cholder2, 'credentials', credentialModel);

const cardholdersRoutes = () => {
	const router = express.Router();

	router.patch('/update/:id', async (req, res) => {
		try {
			const id = req.params.id;
			const options = { new: true };

			const newCardholder = req.body;
			const oldCardholder = await model.findById(id);

			updateParallelDocuments(oldCardholder, newCardholder, 'credentials', credentialModel);

			const result = await model.findByIdAndUpdate(id, newCardholder, options).then(async (res) => {});

			res.send(result);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	});

	router.post('/post', basicRoutes.Post(model));
	router.get('/get', basicRoutes.Get(model));
	router.get('/get/:id', basicRoutes.GetById(model));
	router.delete('/delete/:id', basicRoutes.Delete(model));

	return router;
};

module.exports = cardholdersRoutes;
