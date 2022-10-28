const mongoose = require('mongoose');

const accessGroupSchema = new mongoose.Schema(
	{
		_id: {
			required: true,
			type: String,
		},
		groupName: {
			required: true,
			type: String,
		},
		groupMembers: {
			required: true,
			type: [String],
		},
	},
	{ collection: 'accessGroups' }
);

module.exports = mongoose.model('AccessGroup', accessGroupSchema);
