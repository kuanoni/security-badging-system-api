const request = require('supertest');
const assert = require('assert');
const mongoose = require('mongoose');

// Connecting to the database before each test.
beforeEach(async () => {
	await mongoose.connect(process.env.DATABASE_URL);
});

// Closing database connection after each test.
afterEach(async () => {
	await mongoose.connection.close();
});

const checkForResponseWithDocuments = (res) => {
	expect(res.statusCode).toBe(200);
	expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
	expect(assert(res.body.hasOwnProperty('documents')));
	expect(assert(res.body.hasOwnProperty('count')));
};

module.exports = { checkForResponseWithDocuments };
