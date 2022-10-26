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

describe('GET /accessGroups with projection', () => {
	it('should return 30 access groups only groupName', async () => {
		const res = await request(app).get('/accessGroups/get?props=groupName');
		testFn.checkForResponseWithDocuments(res);

		res.body.documents.forEach((document) => {
			expect(assert(document.hasOwnProperty('groupName')));
			expect(assert(!document.hasOwnProperty('groupMembers')));
		});
	});
});
