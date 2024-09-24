
import cityModel from "../../../../DB/models/city.model.js";
import governorateModel from "../../../../DB/models/governorates.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";


export const getAllCityWithGov = asyncHandler(async (req, res, next) => {
  const governorate = await cityModel
    .find({
      governorateId:"66f2618089b3c3692b849dc3"

    })
     
  return res.status(200).json({
    success: true,
    data: governorate,

  });
});

