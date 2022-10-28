const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cardholdersRoutes = require('./routes/cardholders.routes');
const credentialsRoutes = require('./routes/credentials.routes');
const accessGroupsRoutes = require('./routes/accessGroups.routes');

require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// Routes
app.get('/', (req, res, next) => {
	res.status(200).json({ alive: 'True' });
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.use('/cardholders', cardholdersRoutes());
app.use('/credentials', credentialsRoutes());
app.use('/accessGroups', accessGroupsRoutes());

module.exports = app;
