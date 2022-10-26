const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const testFn = require('./testFunctions');

require('dotenv').config();

describe('GET /accessGroups', () => {
	it('should return valid access groups', async () => {
		const res = await request(app).get('/accessGroups/get');
		testFn.checkForResponseWithDocuments(res);
		expect(res.body.documents.length).toBeGreaterThan(0);
	});
});
