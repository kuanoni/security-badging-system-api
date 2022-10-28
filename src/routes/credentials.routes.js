const express = require('express');
const model = require('../models/credentialModel');
const basicRoutes = require('./basicRoutes');

const credentialsRoutes = () => {
	const router = express.Router();

	router.post('/post', basicRoutes.Post(model));
	router.get('/get', basicRoutes.Get(model));
	router.get('/get/:id', basicRoutes.GetById(model));
	router.patch('/update/:id', basicRoutes.Update(model));
	router.delete('/delete/:id', basicRoutes.Delete(model));

	return router;
};

module.exports = credentialsRoutes;
