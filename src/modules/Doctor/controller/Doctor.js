import { doctorModel } from "../../../../DB/models/doctor.model.js";
import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/cloud.js";

export const create = asyncHandler(async (req, res, next) => {
  const {
    name,
    specialty,
    email,
    city,
    governorate,
    hospital,
    about,
    workingTime,
    pengalamanPraktik,
    location,
  } = req.body;

  const newDoctor = await doctorModel.create({
    name,
    email,
    city,
    governorate,
    specialty,
    hospital,
    about,
    workingTime,
    pengalamanPraktik: JSON.parse(pengalamanPraktik),
    location,
  });

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.FOLDER_CLOUDINARY}/Doctors/${newDoctor.name}`,
    }
  );
  newDoctor.image = { secure_url, public_id };
  await newDoctor.save();
  return res.status(201).json({ message: "Doctor created successfully" });
});

export const getAll = asyncHandler(async (req, res, next) => {
  const doctors = await doctorModel
    .find({})
    .populate("specialty")
    .populate("city")
    .populate("governorate")
    .populate("reviews.user"); // تأكد من أن هناك حقل 'user' في نموذج المراجعات

  const responseData = doctors.map((doctor) => ({
    imageDoctor: {
      url: doctor.imageDoctor.url,
      id: doctor.imageDoctor.id,
    },
    pengalamanPraktik: {
      hospital: doctor.pengalamanPraktik.hospital,
      startYear: doctor.pengalamanPraktik.startYear,
      current: doctor.pengalamanPraktik.current,
    },
    _id: doctor._id,
    name: doctor.name,
    specialty: doctor.specialty, // سيحتوي على التفاصيل الكاملة للتخصص
    hospital: doctor.hospital,
    rating: doctor.rating,
    reviewsCount: doctor.reviewsCount,
    about: doctor.about,
    workingTime: doctor.workingTime,
    city: doctor.city, // سيحتوي على تفاصيل المدينة
    governorate: doctor.governorate, // سيحتوي على تفاصيل المحافظة
    reviews: doctor.reviews.map((review) => ({
      comment: review.comment,
      rating: review.rating,
      _id: review._id,
      date: review.date,
      user: {
        _id: review.user._id,
        profileImage: review.user.profileImage,
        email: review.user.email,
        country: review.user.country,
        phone: review.user.phone,
        status: review.user.status,
        role: review.user.role,
        // يمكنك إضافة المزيد من الحقول إذا لزم الأمر
      },
    })),
    createdAt: doctor.createdAt,
    updatedAt: doctor.updatedAt,
    __v: doctor.__v,
  }));

  return res.status(200).json({
    message: "Successful query",
    data: responseData,
    status: true,
    code: 200,
  });
});

export const addReview = asyncHandler(async (req, res, next) => {
  const doctor = await doctorModel.findById(req.params.id);
  const { comment, rating } = req.body;

  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  const user = await userModel.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // إضافة المراجعة
  const newReview = {
    user: user._id,
    comment,
    rating,
  };

  doctor.reviews.push(newReview);

  // حساب متوسط التقييم
  doctor.calculateAverageRating();

  await doctor.save();
  return res.status(201).json(doctor);
});

export const getReviews = asyncHandler(async (req, res, next) => {
  const doctor = await doctorModel
    .findById(req.params.id)
    .populate("reviews.user"); // إظهار اسم المستخدم للمراجعات
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }
 return res.status(200).json({
    message: "Successful query",
    data: doctor.reviews,
    status: true,
    code: 200,
  });
});

export const recommendation = asyncHandler(async (req, res, next) => {
  const { specialty, minRating } = req.query;

  let filter = {};

  if (specialty) {
    filter.specialty = specialty;
  }

  if (minRating) {
    const ratingValue = parseFloat(minRating);
    if (!isNaN(ratingValue)) {
      filter.rating = { $gte: ratingValue, $lt: ratingValue + 1.0 };
    }
  }

  const doctors = await doctorModel
    .find(filter)
    .populate("specialty")
    .populate("city")
    .populate("governorate")
    .populate("reviews.user");

  const responseData = doctors.map((doctor) => ({
    imageDoctor: {
      url: doctor.imageDoctor.url,
      id: doctor.imageDoctor.id,
    },
    pengalamanPraktik: {
      hospital: doctor.pengalamanPraktik.hospital,
      startYear: doctor.pengalamanPraktik.startYear,
      current: doctor.pengalamanPraktik.current,
    },
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
    reviews: doctor.reviews.map((review) => ({
      comment: review.comment,
      rating: review.rating,
      _id: review._id,
      date: review.date,
      user: {
        _id: review.user._id,
        profileImage: review.user.profileImage,
        email: review.user.email,
        country: review.user.country,
        phone: review.user.phone,
        status: review.user.status,
        role: review.user.role,
      },
    })),
    createdAt: doctor.createdAt,
    updatedAt: doctor.updatedAt,
    __v: doctor.__v,
  }));

  return res.status(200).json({
    message: "Successful query",
    data: responseData,
    status: true,
    code: 200,
  });
});

export const getOne = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const doctor = await doctorModel
    .findById(req.params.id)
    .populate("specialty")
    .populate("city")
    .populate("governorate")
    .populate("reviews.user");

  if (!doctor) {
    return res.status(404).json({
      message: "Doctor not found",
      status: false,
      code: 404,
    });
  }

  const responseData = {
    imageDoctor: {
      url: doctor.imageDoctor.url,
      id: doctor.imageDoctor.id,
    },
    pengalamanPraktik: {
      hospital: doctor.pengalamanPraktik.hospital,
      startYear: doctor.pengalamanPraktik.startYear,
      current: doctor.pengalamanPraktik.current,
    },
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
    reviews: doctor.reviews.map((review) => ({
      comment: review.comment,
      rating: review.rating,
      _id: review._id,
      date: review.date,
      user: {
        _id: review.user._id,
        profileImage: review.user.profileImage,
        email: review.user.email,
        country: review.user.country,
        phone: review.user.phone,
        status: review.user.status,
        role: review.user.role,
      },
    })),
    createdAt: doctor.createdAt,
    updatedAt: doctor.updatedAt,
    __v: doctor.__v,
  };

  return res.status(200).json({
    message: "Successful query",
    data: [responseData],
    status: true,
    code: 200,
  });


});
