import mongoose, { Schema, Types, model } from "mongoose";

const AppointmentSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      match: /^([0-9]{2}):([0-9]{2}) (AM|PM)$/,
    },
    type: {
      type: String,
      enum: ["In Person", "Video Call", "Phone Call"],
      required: true,
    },
    doctor: {
      type: Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: { type: Types.ObjectId, ref: "User", required: true },
    payment: { type: Types.ObjectId, ref: "Payment" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
const AppointmentModel =
  mongoose.models.AppointmentModel || model("Appointment", AppointmentSchema);
export default AppointmentModel;
