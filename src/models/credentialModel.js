const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema(
	{
		_id: {
			required: true,
			type: Number,
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
