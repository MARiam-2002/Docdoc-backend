import mongoose, { Schema, Types, model } from "mongoose";

const specializationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dmkh4y8bw/image/upload/v1726864032/photo_2024-09-20_23-25-42_tjxc9y.jpg",
      },
      id: {
        type: String,
        default:
          "photo_2024-09-20_23-25-42_tjxc9y",
      },
    },
    
  
  },
  { timestamps: true }
);
const specializationModel =
  mongoose.models.specializationModel || model("Specialization", specializationSchema);
export default specializationModel;
