// asyncHandler function to handle async routes
export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next); // Await the async function
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  };
};

// Global error handling middleware
export const globalErrorHandling = (error, req, res, next) => {
  // Determine the status code and message based on the error
  const statusCode = error.status || 500; // Use error.status instead of error.cause
  const message = error.message || "Internal Server Error";
  
  // Initialize data object for error response
  const data = {};

  if (statusCode === 422 && error.details) {
    // Format error response for validation errors
    for (const [key, value] of Object.entries(error.details)) {
      data[key] = value; // Map field names to error messages
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
    data.error = [message]; // Generic error message
  }

  // Send error response
  return res.status(statusCode).json({
    message: statusCode === 404 ? "Not Found" : message,
    data: data,
    status: statusCode < 400, // Status is true if code is less than 400
    code: statusCode,
  });
};
