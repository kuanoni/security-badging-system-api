const mongoose = require('mongoose');

const cardholderSchema = new mongoose.Schema(
	{
		_id: {
			required: true,
			type: String,
		},
		avatar: {
			required: true,
			type: String,
		},
		firstName: {
			required: true,
			type: String,
		},
		lastName: {
			required: true,
			type: String,
		},
		email: {
			required: true,
			type: String,
		},
		jobTitle: {
			required: true,
			type: String,
		},
		profileStatus: {
			required: true,
			type: Boolean,
		},
		activationDate: {
			required: true,
			type: Date,
		},
		expirationDate: {
			required: true,
			type: Date,
		},
		profileType: {
			required: true,
			type: String,
		},
		credentials: {
			required: true,
			type: [{ _id: Number, badgeNumber: Number }],
		},
		accessGroups: {
			required: true,
			type: [{ _id: String, groupName: String }],
		},
	},
	{ collection: 'cardholders' }
);

module.exports = mongoose.model('Cardholder', cardholderSchema);
