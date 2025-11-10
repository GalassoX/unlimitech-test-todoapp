import mongoose from "mongoose";
import { ENV } from "./environments";

export async function connectDB() {
  try {
    await mongoose.connect(ENV.MONGODB_URI, { 
      user: ENV.MONGODB_USERNAME, 
      pass: ENV.MONGODB_PASSWORD,
      dbName: ENV.MONGODB_DATABASE
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}
