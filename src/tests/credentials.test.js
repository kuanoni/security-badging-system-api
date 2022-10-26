const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const testFn = require('./testFunctions');

require('dotenv').config();

describe('GET /credentials', () => {
	it('should return 30 valid credentials', async () => {
		const res = await request(app).get('/credentials/get');
		testFn.checkForResponseWithDocuments(res);
		expect(res.body.documents.length).toBe(30);
	});
});

describe('GET /credentials with projection', () => {
	it('should return 30 credentials only badgeType', async () => {
		const res = await request(app).get('/credentials/get?props=badgeType');
		testFn.checkForResponseWithDocuments(res);
		expect(res.body.documents.length).toBe(30);

		res.body.documents.forEach((document) => {
			expect(assert(document.hasOwnProperty('badgeType')));
			expect(assert(!document.hasOwnProperty('badgeOwner')));
		});
	});
});
