import mongoose, { Schema, Types, model } from "mongoose";

const citySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    governorateId: {
      type: Types.ObjectId,
      ref: "Governorate",
    },
    location: {
      Longitude: { type: Number },
      Latitude: { type: Number },
    },
  },
  { timestamps: true }
);
const cityModel = mongoose.models.cityModel || model("City", citySchema);
export default cityModel;
