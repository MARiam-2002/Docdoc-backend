import mongoose, { model, Schema } from "mongoose";
import { Types } from "mongoose";
import { reviewSchema } from "./review.model.js";
const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageDoctor: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dmkh4y8bw/image/upload/v1726864032/photo_2024-09-20_23-25-42_tjxc9y.jpg",
      },
      id: {
        type: String,
        default: "photo_2024-09-20_23-25-42_tjxc9y",
      },
    },
    specialty: {
      type: Types.ObjectId,
      ref: "Specialization",
    },
    hospital: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    about: {
      type: String,
      required: true,
    },
    workingTime: {
      type: String,
      required: true,
    },
    // إضافة قسم خاص بالتجربة العملية
    pengalamanPraktik: {
      hospital: {
        type: String,
        required: true,
      },
      startYear: {
        type: Number,
        required: true,
      },
      current: {
        type: Boolean,
        default: true,
      },
    },
    // موقع الممارسة باستخدام GeoJSON
    city: {
      type: Types.ObjectId,
      ref: "City",
    },
    governorate: {
      type: Types.ObjectId,
      ref: "Governorate",
    },

    // المراجعات
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

// حساب التقييم المتوسط والتعامل مع عدد المراجعات تلقائياً
// حساب التقييم المتوسط والتعامل مع عدد المراجعات تلقائياً
doctorSchema.methods.calculateAverageRating = function () {
    const totalReviews = this.reviews.length;
    const sumRatings = this.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
  
    this.reviewsCount = totalReviews;
    this.rating = totalReviews === 0 ? 0 : parseFloat((sumRatings / totalReviews).toFixed(1));
  };
  

// تصدير النموذج
export const doctorModel = mongoose.models.doctorModel || model("Doctor", doctorSchema);

