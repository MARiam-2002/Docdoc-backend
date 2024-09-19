export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(error);
    });
  };
};


export const globalErrorHandling = (error, req, res, next) => {
  // Determine the status code and message based on the error
  const statusCode = error.cause || 500;
  const message = error.message || "Internal Server Error";
  
  // Format error response for validation errors
  const data = {};
  if (statusCode === 422 && error.details) {
    // Error details are expected to be an object with field names as keys
    // and arrays of error messages as values
    for (const [key, value] of Object.entries(error.details)) {
      data[key] = value;
    }
  } else if (statusCode === 404) {
    // For not found errors, return an empty array for data
    return res.status(statusCode).json({
      message: "Not Found",
      data: [],
      status: false,
      code: statusCode
    });
  } else {
    // For other errors, use a generic structure
    data.error = [message];
  }

  return res.status(statusCode).json({
    message: statusCode === 404 ? "Not Found" : message,
    data: data,
    status: statusCode < 400,
    code: statusCode
  });
};

