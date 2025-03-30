const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Ensure MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true, // Ensures indexes are created automatically
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if unable to connect
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;