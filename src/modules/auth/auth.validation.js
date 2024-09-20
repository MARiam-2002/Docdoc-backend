import joi from "joi";

export const registerSchema = joi.object({
  email: joi.string().email().required().messages({
    "any.required": "The email field is required.",
    "string.email": "Please provide a valid email address.",
    "string.empty": "The email field is required.",
  }),
  phone: joi.string().required().messages({
    "any.required": "The phone field is required.",
    "string.empty": "The phone field is required.",
  }),

  password: joi.string().required().messages({
    "any.required": "The password field is required.",
    "string.empty": "The password field is required.",
  }),
  country: joi.string().required().messages({
    "any.required": "The country field is required.",
    "string.empty": "The country field is required.",
  }),
  cPassword: joi.string().valid(joi.ref("password")).required().messages({
    "any.required": "The confirm password field is required.",
    "any.only": "The confirm password does not match the password.",
  }),
});

// export const activateSchema = joi
//   .object({
//     activationCode: joi.string().required(),
//   })
//   .required();

export const login = joi
  .object({
    email: joi.string().email().required().messages({
      "any.required": "The email field is required.",
      "string.email": "Please provide a valid email address.",
      "string.empty": "The email field is required.",
    }),
    password: joi.string().required().messages({
      "any.required": "The password field is required.",
      "string.empty": "The password field is required.",
    }),
  })
  .required();

  export const updateProfile = joi
  .object({
    name: joi.string().min(3).max(30).optional().messages({
      "string.base": "Name must be a string.",
      "string.empty": "Name cannot be empty.",
      "string.min": "Name must be at least 3 characters long.",
      "string.max": "Name cannot be longer than 30 characters.",
    }),
    birthDay: joi.date().optional().messages({
      "date.base": "Birth date must be a valid date.",
    }),
    email: joi.string().email().optional().messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "email cannot be empty.",

    }),
    phone: joi.string().optional().messages({
      "string.base": "Phone number must be a string.",
      "string.empty": "Phone number cannot be empty.",
    }),
    country: joi.string().optional().messages({
      "string.empty": "The country field cannot be empty.",
    }),
    size: joi.number().positive().optional().messages({
      "number.base": "File size must be a positive number.",
    }),
    path: joi.string().optional().messages({
      "string.base": "File path must be a string.",
    }),
    filename: joi.string().optional().messages({
      "string.base": "File name must be a string.",
    }),
    destination: joi.string().optional().messages({
      "string.base": "File destination must be a string.",
    }),
    mimetype: joi.string().optional().messages({
      "string.base": "File MIME type must be a string.",
    }),
    encoding: joi.string().optional().messages({
      "string.base": "File encoding must be a string.",
    }),
    originalname: joi.string().optional().messages({
      "string.base": "Original file name must be a string.",
    }),
    fieldname: joi.string().optional().messages({
      "string.base": "Field name must be a string.",

    }),
  })
  .required();


// export const forgetCode = joi
//   .object({
//     email: joi.string().email().required(),
//   })
//   .required();

// export const resetPassword = joi
//   .object({
//     email: joi.string().email().required(),
//     password: joi.string().required(),
//     forgetCode: joi.string().required(),
//     confirmPassword: joi.string().valid(joi.ref("password")).required(),
//   })
//   .required();
