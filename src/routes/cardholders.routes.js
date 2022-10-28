const express = require('express');
const model = require('../models/cardholderModel');
const credentialModel = require('../models/credentialModel');
const accessGroupModel = require('../models/accessGroupModel');
const basicRoutes = require('./basicRoutes');

const updateParallelDocuments = async (oldCardholder, newCardholder, docKey, model, addFn, removeFn) => {
	const oldDocIds = oldCardholder[docKey].map((doc) => doc._id);
	const newDocIds = newCardholder[docKey].map((doc) => doc._id);

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
			const id = req.params.id;
			const options = { new: true };

			const newCardholder = req.body;
			const oldCardholder = await model.findById(id);

			const credentialsQuery = updateParallelDocuments(
				oldCardholder,
				newCardholder,
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
				oldCardholder,
				newCardholder,
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

	router.post('/post', basicRoutes.Post(model));
	router.get('/get', basicRoutes.Get(model));
	router.get('/get/:id', basicRoutes.GetById(model));
	router.delete('/delete/:id', basicRoutes.Delete(model));

	return router;
};

module.exports = cardholdersRoutes;
