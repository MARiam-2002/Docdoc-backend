import specializationModel from "../../../../DB/models/specialization.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/cloud.js";

export const createDoctorSpeciality = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const speciality = await specializationModel.create({ name, description });
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.FOLDER_CLOUDINARY}/DoctorSpeciality/${speciality.name}`,
    }
  );
  speciality.image.url = secure_url;
  speciality.image.id = public_id;
  await speciality.save();
  return res.status(201).json({
    message: "Speciality created successfully",
    data: speciality,
    status: true,
    code: 201,
  });
});

export const getAllDoctorSpeciality = asyncHandler(async (req, res, next) => {
  const speciality = await specializationModel.find({});
  return res.status(200).json({
    message: "All speciality",
    data: speciality,
    status: true,
    code: 200,
  });
});
