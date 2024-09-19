import joi from "joi";

export const registerSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": "The name field is required.",
    "string.empty": "The name field is required."
  }),
  email: joi.string().email().required().messages({
    "any.required": "The email field is required.",
    "string.email": "Please provide a valid email address.",
    "string.empty": "The email field is required."
  }),
  phone: joi.string().required().messages({
    "any.required": "The phone field is required.",
    "string.empty": "The phone field is required."
  }),
  birthDay: joi.date().required().messages({
    "any.required": "The birthDay field is required.",
    "date.base": "Please provide a valid birth date."
  }),
  password: joi.string().required().messages({
    "any.required": "The password field is required.",
    "string.empty": "The password field is required."
  }),
  country: joi.string().required().messages({
    "any.required": "The country field is required.",
    "string.empty": "The country field is required."
  }),
  cPassword:joi.string().
  valid(joi.ref("password"))
  .required()
  .messages({
    "any.required": "The confirm password field is required.",
    "any.only": "The confirm password does not match the password.",
  }),
  
});

// export const activateSchema = joi
//   .object({
//     activationCode: joi.string().required(),
//   })
//   .required();

// export const login = joi
//   .object({
//     email: joi.string().email().required(),
//     password: joi.string().required(),
//   })
//   .required();

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
