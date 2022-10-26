const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cardholderModel = require('./models/cardholderModel');
const credentialModel = require('./models/credentialModel');
const accessGroupModel = require('./models/accessGroupsModel');
const createRouterForModel = require('./routes/routes');

require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// Routes
app.get('/', (req, res) => {
	res.status(200).json({ alive: 'True' });
});

app.use('/cardholders', createRouterForModel(cardholderModel));
app.use('/credentials', createRouterForModel(credentialModel));
app.use('/accessGroups', createRouterForModel(accessGroupModel));

module.exports = app;
