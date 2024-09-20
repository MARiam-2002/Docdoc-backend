import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import tokenModel from "../../../../DB/models/token.model.js";

export const register = asyncHandler(async (req, res, next) => {
  const { phone, email, password, country } = req.body;
  const existingUser = await userModel.findOne({ $or: [{ email }, { phone }] });

  const errorMessages = {};
  if (existingUser) {
    if (existingUser.email === email) {
      errorMessages.email = ["The email has already been taken."];
    }
    if (existingUser.phone === phone) {
      errorMessages.phone = ["The phone has already been taken."];
    }
  }

  if (Object.keys(errorMessages).length > 0) {
    return res.status(422).json({
      message: "Unprocessable Entity",
      data: errorMessages,
      status: false,
      code: 422,
    });
  }

  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );

  const user = await userModel.create({
    phone,
    email,
    password: hashPassword,
    country,
  });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_KEY
  );

  await tokenModel.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  return res.status(200).json({
    message: "Logged in Successfully.",
    data: {
      token,
      username: user.name,
    },
    status: true,
    code: 200,
  });
});

export const allCountryWithFlag = asyncHandler(async (req, res, next) => {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const countries = await response.json();

  const countriesWithFlagsAndPhoneCodes = countries.map((country) => ({
    name: country.name.common,
    flag: country.flags.png, // or country.flags.svg for SVG format
    phoneCode:
      country.idd?.root +
      (country.idd?.suffixes ? country.idd.suffixes[0] : ""), // Concatenate phone root and first suffix
  }));
  res.status(200).json({
    message: "All countries with flags",
    data: countriesWithFlagsAndPhoneCodes,
    status: true,
    code: 200,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const errorMessages = {};

  // Check if user exists
  const user = await userModel.findOne({ email });
  if (!user) {
    errorMessages.email = ["The email does not exist."];
  } else {
    // Check if password matches
    const match = bcryptjs.compareSync(password, user.password);
    if (!match) {
      errorMessages.password = ["The password is incorrect."];
    }
  }

  // If there are any error messages, return them with status 422
  if (Object.keys(errorMessages).length > 0) {
    return res.status(422).json({
      message: "Unprocessable Entity",
      data: errorMessages,
      status: false,
      code: 422,
    });
  }

  // Generate token and return success response if no errors
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_KEY
  );

  await tokenModel.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  user.status = "online";
  await user.save();

  return res.status(200).json({
    message: "Logged in Successfully.",
    data: {
      token,
      username: user.name, // Assuming 'name' field is the username
    },
    status: true,
    code: 200,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
 const token = req.headers["token"];
  if (!token) {
    return res.status(400).json({
      message: "Token is required.",
      status: false,
      code: 400,
    });
  }

  // Find the token document
  const tokenDoc = await tokenModel
    .findOne({
      token,
      isValid: true,
    })
    .populate("user");

  if (!tokenDoc) {
    return res.status(401).json({
      message: "Unauthorized",
      status: false,
      code: 401,
    });
  }

  // Invalidate the token
  tokenDoc.isValid = false;
  await tokenDoc.save();

  // Update user's status to offline
  if (tokenDoc.user) {
    tokenDoc.user.status = "offline";
    await tokenDoc.user.save();
  }

  return res.status(200).json({
    message: "Logged out successfully.",
    data: [], // As per your format, though this could be omitted if not needed
    status: true,
    code: 200,
  });
});

// //send forget Code

// export const sendForgetCode = asyncHandler(async (req, res, next) => {
//   const user = await userModel.findOne({ email: req.body.email });

//   if (!user) {
//     return next(new Error("Invalid email!", { cause: 400 }));
//   }

//   const code = randomstring.generate({
//     length: 5,
//     charset: "numeric",
//   });

//   user.forgetCode = code;
//   await user.save();

//   return (await sendEmail({
//     to: user.email,
//     subject: "Reset Password",
//     html: resetPassword(code),
//   }))
//     ? res.status(200).json({ success: true, message: "check you email!" })
//     : next(new Error("Something went wrong!", { cause: 400 }));
// });

// export const resetPasswordByCode = asyncHandler(async (req, res, next) => {
//   const newPassword = bcryptjs.hashSync(
//     req.body.password,
//     +process.env.SALT_ROUND
//   );
//   const checkUser = await userModel.findOne({ email: req.body.email });
//   if (!checkUser) {
//     return next(new Error("Invalid email!", { cause: 400 }));
//   }
//   if (checkUser.forgetCode !== req.body.forgetCode) {
//     return next(new Error("Invalid code!", { status: 400 }));
//   }
//   const user = await userModel.findOneAndUpdate(
//     { email: req.body.email },
//     { password: newPassword, $unset: { forgetCode: 1 } }
//   );

//   //invalidate tokens
//   const tokens = await tokenModel.find({ user: user._id });

//   tokens.forEach(async (token) => {
//     token.isValid = false;
//     await token.save();
//   });

//   return res.status(200).json({ success: true, message: "Try to login!" });
// });
