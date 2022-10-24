const mongoose = require('mongoose');

const credentialSchema = mongoose.Schema({
	_id: {
		required: true,
		type: Number,
	},
	badgeNumber: {
		type: Number,
		required: true,
	},
	badgeType: {
		type: String,
		required: true,
	},
	badgeOwnerId: String,
	badgeOwnerName: String,
});

module.exports = mongoose.model('Credential', credentialSchema);
