import mongoose, { Schema, Types, model } from "mongoose";

const paymentSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["Credit Card", "Bank Transfer", "Paypal"],
      required: true,
    },
    details: String,
    totalAmount: Number,
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
const paymentModel =
  mongoose.models.paymentModel || model("payment", paymentSchema);
export default paymentModel;
