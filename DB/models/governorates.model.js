// governorateModel.js
import mongoose, { Schema, model } from "mongoose";

const governorateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      Longitude: { type: Number },
      Latitude: { type: Number },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

governorateSchema.virtual("cities", { // تأكد من استخدام الجمع هنا
  ref: "City",
  localField: "_id",
  foreignField: "governorateId",
});

// تأكد من استخدام الاسم الصحيح عند تسجيل النموذج
const governorateModel = mongoose.model("Governorate", governorateSchema);
export default governorateModel;
