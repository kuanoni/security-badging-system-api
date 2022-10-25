const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cardholderModel = require('./models/cardholderModel');
const credentialModel = require('./models/credentialModel');
const createRouterForModel = require('./routes/routes');

require('dotenv').config();
const app = express();

app.use(express.json());

app.use(cors());
app.use(morgan('tiny'));

app.use('/cardholders', createRouterForModel(cardholderModel));
app.use('/credentials', createRouterForModel(credentialModel));

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server Started at ${PORT}`);
});

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
	console.log(error);
});

database.once('connected', () => {
	console.log('Database Connected');
});
