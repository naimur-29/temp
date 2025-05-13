// app/lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the NodeJS Global type with our mongoose cache
declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    // console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose's buffering to fail fast if not connected
      // useNewUrlParser: true, // Deprecated, no longer needed in Mongoose 6+
      // useUnifiedTopology: true, // Deprecated, no longer needed in Mongoose 6+
    };

    // console.log("Creating new MongoDB connection promise");
    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB Connected Successfully!");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("MongoDB Connection Error in Promise:", err);
        // Set promise to null so that next attempt will try to reconnect
        cached.promise = null;
        throw err; // Re-throw to be caught by the caller
      });
  }

  try {
    // console.log("Awaiting MongoDB connection promise");
    cached.conn = await cached.promise;
  } catch (e) {
    // If the promise rejected, clear it so we can try again
    cached.promise = null;
    console.error("Failed to establish MongoDB connection:", e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
