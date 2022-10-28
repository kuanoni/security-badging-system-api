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
	},
	{ collection: 'credentials' }
);

module.exports = mongoose.model('Credential', credentialSchema);
