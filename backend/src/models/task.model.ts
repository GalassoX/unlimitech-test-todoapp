import { TaskStatus } from "@/constants/taskStatus";
import mongoose, { Schema } from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: Number, default: TaskStatus.PENDING },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
}, { versionKey: false });

export const TaskModel = mongoose.model("Task", TaskSchema);