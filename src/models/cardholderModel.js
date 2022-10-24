const mongoose = require('mongoose');

const cardholderSchema = new mongoose.Schema({
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
	employeeId: {
		required: true,
		type: Number,
	},
	jobTitle: {
		required: true,
		type: String,
	},
	profileStatus: {
		required: true,
		type: String,
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
		type: [{ badgeNumber: Number }],
	},
	accessGroups: {
		required: true,
		type: [{ groupName: String }],
	},
});

module.exports = mongoose.model('Cardholder', cardholderSchema);
