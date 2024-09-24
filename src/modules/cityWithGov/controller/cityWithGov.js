import cityModel from "../../../../DB/models/city.model.js";
import governorateModel from "../../../../DB/models/governorates.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

export const getAllCityWithGov = asyncHandler(async (req, res, next) => {
  const governorates = await governorateModel
    .find({})
    .select("name _id location")
    .populate({
      path: "cities", // جلب المدن المرتبطة
      select: "name _id location -governorateId", // جلب الحقول المطلوبة فقط
    })
    .lean(); // استخدام `lean` لجعل الاستعلام أسرع وإعادة كائنات JavaScript عادية

  // التحقق من وجود البيانات
  if (!governorates || governorates.length === 0) {
    return res.status(404).json({
      message: "No data found",
      status: false,
      code: 404,
    });
  }

  // إرسال الاستجابة بشكل صحيح مع المدن المرتبطة
  return res.status(200).json({
    message: "Successful query",
    data: governorates, // جلب المحافظات مع المدن المرتبطة
    status: true,
    code: 200,
  });
});
