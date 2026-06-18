/**
 * config/db.js — MongoDB connection helper using Mongoose.
 *
 * Exports a `connectDB` function that establishes a persistent connection.
 * The connection string is read from the MONGO_URI environment variable.
 */

import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options suppress deprecation warnings in Mongoose 7+
      serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB is unreachable
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit process on DB connection failure
  }
};
