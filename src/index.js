const express = require('express');
const mongoose = require('mongoose');
const cardholderModel = require('./models/cardholderModel');
const credentialModel = require('./models/credentialModel');
const createRouterForModel = require('./routes/routes');

const app = express();

app.use(express.json());

app.use('/cardholders', createRouterForModel(cardholderModel));
app.use('/credentials', createRouterForModel(credentialModel));

app.listen(process.env.PORT, () => {
	console.log(`Server Started at ${3000}`);
});

require('dotenv').config();

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
	console.log(error);
});

database.once('connected', () => {
	console.log('Database Connected');
});
