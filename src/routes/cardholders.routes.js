const express = require('express');
const model = require('../models/cardholderModel');
const credentialModel = require('../models/credentialModel');
const accessGroupModel = require('../models/accessGroupModel');
const basicRoutes = require('./basicRoutes');

const updateParallelDocuments = async (oldDocs, newDocs, docKey, model, addFn, removeFn) => {
	const oldDocIds = oldDocs ? oldDocs.map((doc) => doc._id) : [];
	const newDocIds = newDocs ? newDocs.map((doc) => doc._id) : [];

	const documentIdsToUpdate = oldDocIds
		.filter((x) => !newDocIds.includes(x))
		.concat(newDocIds.filter((x) => !oldDocIds.includes(x)));

	const updatedDocuments = [];

	for (let i = 0; i < documentIdsToUpdate.length; i++) {
		const documentId = documentIdsToUpdate[i];
		const foundDocument = await model.findById(documentId);

		if (oldDocIds.includes(documentId)) {
			// cardholder is removed
			const doc = await model.findOneAndUpdate({ _id: documentId }, removeFn(foundDocument._doc), { new: true });
			updatedDocuments.push(doc);
		}

		if (newDocIds.includes(documentId)) {
			// cardholder is added
			const doc = await model.findOneAndUpdate({ _id: documentId }, addFn(foundDocument._doc), { new: true });
			updatedDocuments.push(doc);
		}
	}

	if (updatedDocuments.length === 0) return { messeage: `No ${docKey} updated` };
	else return updatedDocuments;
};

const cardholdersRoutes = () => {
	const router = express.Router();

	router.patch('/update/:id', async (req, res) => {
		try {
			const { id } = req.params;
			const options = { new: true };

			const oldCardholder = await model.findById(id);
			const newCardholder = req.body;

			const { credentials: oldCredentials, accessGroups: oldAccessGroups } = oldCardholder;
			const { credentials: newCredentials, accessGroups: newAccessGroups } = newCardholder;

			const credentialsQuery = updateParallelDocuments(
				oldCredentials,
				newCredentials,
				'credentials',
				credentialModel,
				(cred) => ({
					...cred,
					badgeOwnerId: newCardholder._id,
					badgeOwnerName: newCardholder.firstName + ' ' + newCardholder.lastName,
				}),
				(cred) => ({
					...cred,
					badgeOwnerId: '',
					badgeOwnerName: '',
				})
			);

			const accessGroupsQuery = updateParallelDocuments(
				oldAccessGroups,
				newAccessGroups,
				'accessGroups',
				accessGroupModel,
				(group) => ({
					...group,
					groupMembers: [...group.groupMembers, newCardholder._id],
				}),
				(group) => ({
					...group,
					groupMembers: group.groupMembers.filter((memberId) => memberId !== newCardholder._id),
				})
			);

			const result = await Promise.all([
				credentialsQuery,
				accessGroupsQuery,
				model.findOneAndUpdate({ _id: id }, newCardholder, options),
			]);

			res.send(result);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	});

	router.post('/post', async (req, res) => {
		const cardholder = new model(req.body);
		const validationErrors = cardholder.validateSync()?.errors;

		try {
			if (validationErrors)
				throw new Error(Object.keys(validationErrors).map((key) => validationErrors[key].properties.message));
			const dataToSave = await cardholder.save();
			res.status(200).json(dataToSave);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	});

	router.get('/get', basicRoutes.Get(model));
	router.get('/get/:id', basicRoutes.GetById(model));
	router.delete('/delete/:id', basicRoutes.Delete(model));

	return router;
};

module.exports = cardholdersRoutes;
