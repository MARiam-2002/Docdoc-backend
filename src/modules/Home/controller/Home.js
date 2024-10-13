import { doctorModel } from "../../../../DB/models/doctor.model.js";
import specializationModel from "../../../../DB/models/specialization.model.js";
import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

export const home = asyncHandler(async (req, res, next) => {
  const [speciality, doctors] = await Promise.all([
    specializationModel.find({}).select("name description image"),
    doctorModel.find({})
      .populate("specialty")
      .populate("city")
      .populate("governorate")
      .populate("reviews.user")
  ]);

  const responseData = doctors
    .map((doctor) => ({
      imageDoctor: doctor.imageDoctor,
      pengalamanPraktik: doctor.pengalamanPraktik,
      _id: doctor._id,
      name: doctor.name,
      specialty: doctor.specialty,
      hospital: doctor.hospital,
      rating: doctor.rating,
      reviewsCount: doctor.reviewsCount,
      about: doctor.about,
      workingTime: doctor.workingTime,
      city: doctor.city,
      governorate: doctor.governorate,
      reviews: doctor.reviews.map(({ comment, rating, _id, date, user }) => ({
        comment,
        rating,
        _id,
        date,
        user: {
          _id: user._id,
          profileImage: user.profileImage,
          email: user.email,
          country: user.country,
          phone: user.phone,
          status: user.status,
          role: user.role,
        },
      })),
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    }))
    .sort((a, b) => b.rating - a.rating); 

  return res.status(200).json({
    message: "Successful query",
    title: `Hi, ${req.user.name}!`,
    doctorSpeciality: speciality,
    recommendationDoctor: responseData,
    status: true,
    code: 200,
  });
});

