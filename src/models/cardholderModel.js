const mongoose = require('mongoose');
const { numbersField, lettersField, emailField, lettersNumbersField } = require('../helpers/utils');

const cardholderSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			validate: {
				validator: numbersField,
				message: (props) => `${props.value} is not a valid employee ID`,
			},
			required: [true, 'Cardholder employee ID required'],
		},
		avatar: {
			required: false,
			type: String,
		},
		firstName: {
			type: String,
			validate: { validator: lettersField, message: (props) => `${props.value} is not a valid firstName` },
			required: [true, 'firstName required'],
		},
		lastName: {
			type: String,
			validate: { validator: lettersField, message: (props) => `${props.value} is not a valid lastName` },
			required: [true, 'lastName required'],
		},
		email: {
			type: String,
			validate: { validator: emailField, message: (props) => `${props.value} is not a valid email` },
			required: [true, 'email required'],
		},
		jobTitle: {
			type: String,
			validate: { validator: lettersNumbersField, message: (props) => `${props.value} is not a valid jobTitle` },
			required: [true, 'jobTitle required'],
		},
		profileStatus: {
			required: [true, 'profileStatus required'],
			type: Boolean,
		},
		activationDate: {
			required: [true, 'activation date required'],
			type: Date,
		},
		expirationDate: {
			required: [true, 'expirationDate required'],
			type: Date,
		},
		profileType: {
			required: [true, 'profileType required'],
			type: String,
		},
		credentials: {
			required: [true, 'credentials required'],
			type: [{ _id: String, status: Boolean }],
		},
		accessGroups: {
			required: [true, 'accessGroups required'],
			type: [{ _id: String, groupName: String }],
		},
	},
	{ collection: 'cardholders' }
);

module.exports = mongoose.model('Cardholder', cardholderSchema);
