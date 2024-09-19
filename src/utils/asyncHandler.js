export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(error);
    });
  };
};


export const globalErrorHandling = (error, req, res, next) => {
  // تحديد الكود والرسالة المناسبة بناءً على نوع الخطأ
  const statusCode = error.cause || 500;
  const message = error.message || "Internal Server Error";
  
  // إذا كان الخطأ يحتوي على تفاصيل، نعرضها في "data"
  const data = statusCode === 404 ? [] : [{ msgError: message }];

  return res.status(statusCode).json({
    message: statusCode === 404 ? "Not Found" : message,
    data: data,
    status: false,
    code: statusCode
  });
};
