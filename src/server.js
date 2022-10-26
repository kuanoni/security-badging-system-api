const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.PORT || 3000;

require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL);
const server = mongoose.connection;

server.on('error', (error) => {
	console.log(error);
});

server.once('connected', () => {
	console.log('Database Connected');
	app.listen(PORT, () => {
		console.log(`Server Started at ${PORT}`);
	});
});
