import mongoose, { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
  {
  name:{
    type: String,
  },
    googleId: String,
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    country:{
      type: String,
      required: true,
    },
    birthDay:{
      type: Date,
    },
    phone: String,
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    role: {
      type: String,
      enum: ["user", "doctor"],
      default: "user",
      required: true,
    },
    wishlist: [Types.ObjectId],
    isConfirmed: {
      type: Boolean,
      default: true, // edite after
    },
    forgetCode: String,
    // activationCode: String,
    profileImage: {
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

const userModel = mongoose.models.userModel || model("User", userSchema);
export default userModel;






