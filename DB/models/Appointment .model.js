import mongoose, { Schema, Types, model } from "mongoose";

const AppointmentSchema = new Schema(
  {
    date: Date,
    time: String,
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
  },
  { timestamps: true }
);
const AppointmentModel =
  mongoose.models.AppointmentModel || model("Appointment", AppointmentSchema);
export default AppointmentModel;
