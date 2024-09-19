import mongoose, { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
  {
  name:{
    type: String,
    required: true,
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
      required: true
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
          "https://res.cloudinary.com/dz5dpvxg7/image/upload/v1691521498/ecommerceDefaults/user/png-clipart-user-profile-facebook-passport-miscellaneous-silhouette_aol7vc.png",
      },
      id: {
        type: String,
        default:
          "ecommerceDefaults/user/png-clipart-user-profile-facebook-passport-miscellaneous-silhouette_aol7vc",
      },
    },
    
  },
  { timestamps: true }
);

const userModel = mongoose.models.userModel || model("User", userSchema);
export default userModel;






