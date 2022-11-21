const { MongoClient } = require('mongodb');

let secrets;
let password;

if (!process.env.PASSWORD) {
	secrets = require('./secrets.json');
	password = secrets.password;
} else {
	password = process.env.PASSWORD;
}

let dbConnection;

// Connection URL
const url = `mongodb+srv://sigma:${password}@cluster0.khwo5ja.mongodb.net/badminton`;
const client = new MongoClient(url);

async function setUpDatabase() {
	try {
		const db = await client.connect();
		dbConnection = db.db("badminton");
		console.log("Successfully connected to MongoDB.");
	} catch (err) {
		throw err;
	}
}

function getDb () {
	return dbConnection;
}

module.exports = {
	setUpDatabase,
	getDb
}



