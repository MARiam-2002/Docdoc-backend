import cityModel from "../../../../DB/models/city.model.js";
import governorateModel from "../../../../DB/models/governorates.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

export const getAllCityWithGov = asyncHandler(async (req, res, next) => {
  const governorates = await governorateModel
    .find({})
    .select("name _id location")
    .populate({
      path: "cities",  
      select: "name _id location -governorateId",
    })
    .lean(); 

  if (!governorates || governorates.length === 0) {
    return res.status(404).json({
      message: "No data found",
      status: false,
      code: 404,
    });
  }

  return res.status(200).json({
    message: "Successful query",
    data: governorates, 
    status: true,
    code: 200,
  });
});
