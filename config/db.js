const mongoose = require("mongoose");

// Get MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

/**
 * Connects to the MongoDB database.
 */
const connectDB = async () => {
	try {
		mongoose.connect(MONGO_URI, {
			serverSelectionTimeoutMS: 5000,
			connectTimeoutMS: 10000,
		});
		const connection = mongoose.connection;

		connection.on("connected", () => {
			console.log("Great! MongoDb is connected bro!");
		});

		connection.on("error", (err) => {
			console.log("MongoDB connected ERROR. " + err);
			process.exit(1);
		});
	} catch (error) {
		console.log("Ups! Something went wrong! " + error);
	}
};

module.exports = connectDB;
