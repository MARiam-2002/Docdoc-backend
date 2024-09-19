import { Types } from "mongoose";

export const isValidObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("Invalid ObjectId");
};

export const isValidation = (Schema) => {
  return (req, res, next) => {
    const copyReq = {
      ...req.body,
      ...req.params,
      ...req.query,
      ...req.files,
    };

    // إجراء التحقق باستخدام Joi
    const validationResult = Schema.validate(copyReq, { abortEarly: false });

    if (validationResult.error) {
      // إنشاء كائن يحتوى على الأخطاء مفصلة لكل حقل
      const formattedErrors = validationResult.error.details.reduce(
        (acc, error) => {
          const key = error.path.join(".");
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(error.message);
          return acc;
        },
        {}
      );

      // إرجاع الخطأ بالتنسيق المطلوب
      return res.status(422).json({
        message: "Unprocessable Entity",
        data: formattedErrors,
        status: false,
        code: 422,
      });
    }

    next();
  };
};
