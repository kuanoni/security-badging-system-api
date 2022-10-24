const express = require('express');
const mongoose = require('mongoose');
const cardholderRoutes = require('./routes/cardholderRoutes');
const credentialRoutes = require('./routes/credentialRoutes');

const app = express();

app.use(express.json());

app.use('/cardholders', cardholderRoutes);
app.use('/credentials', credentialRoutes);

app.listen(3000, () => {
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
