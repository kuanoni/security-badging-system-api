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
