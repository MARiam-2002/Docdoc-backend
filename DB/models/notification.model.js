import mongoose, { model, Schema, Types } from "mongoose";

const notificationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "Appointment Success",
      "Schedule Changed",
      "Video Call Appointment",
      "Appointment Cancelled",
      "New Payment Added",
    ],
    required: true,
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const notificationModel =
  mongoose.models.notificationModel ||
  model("Notification", notificationSchema);
