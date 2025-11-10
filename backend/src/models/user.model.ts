import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
}, { versionKey: false });

export const UserModel = mongoose.model("User", UserSchema);