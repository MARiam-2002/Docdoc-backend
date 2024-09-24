import mongoose, { Schema, Types, model } from "mongoose";

export const reviewSchema = new Schema({
  user: {
    type: Types.ObjectId, // استخدام المرجع
    ref: "User", // ربط بـ 'User'
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const reviewModel =
  mongoose.models.reviewModel || model("Review", reviewSchema);
