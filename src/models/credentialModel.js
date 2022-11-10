const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema(
	{
		_id: {
			required: true,
			type: String,
		},
		badgeType: {
			type: String,
			required: true,
		},
		badgeOwnerId: String,
		badgeOwnerName: String,
		badgeFormat: {
			type: String,
			required: true,
		},
		activationDate: {
			type: Date,
			required: true,
		},
		expirationDate: {
			type: Date,
			required: true,
		},
		status: {
			type: Boolean,
			required: true,
		},
		partition: {
			type: String,
			required: true,
		},
	},
	{ collection: 'credentials' }
);

module.exports = mongoose.model('Credential', credentialSchema);
