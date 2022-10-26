const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const testFn = require('./testFunctions');

require('dotenv').config();

describe('GET /cardholders', () => {
	it('should return 30 cardholders', async () => {
		const res = await request(app).get('/cardholders/get');
		testFn.checkForResponseWithDocuments(res);
		expect(res.body.documents.length).toBe(30);
	});
});

describe('GET /cardholders with projection', () => {
	it('should return 30 cardholders only first and last names', async () => {
		const res = await request(app).get('/cardholders/get?props=firstName,lastName');
		testFn.checkForResponseWithDocuments(res);
		expect(res.body.documents.length).toBe(30);

		res.body.documents.forEach((document) => {
			expect(assert(document.hasOwnProperty('firstName')));
			expect(assert(document.hasOwnProperty('lastName')));
			expect(assert(!document.hasOwnProperty('email')));
		});
	});
});

describe('GET /cardholders with filter', () => {
	it('should return filtered cardholders', async () => {
		const filterValue = 'kai';
		const res = await request(app).get('/cardholders/get?filter=firstName&value=' + filterValue);
		testFn.checkForResponseWithDocuments(res);
		expect(res.body.documents.length).toBeGreaterThan(0);

		res.body.documents.forEach((document) => {
			expect(document.firstName.includes(filterValue));
		});
	});
});
