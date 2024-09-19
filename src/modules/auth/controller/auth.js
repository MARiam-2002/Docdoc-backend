import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import tokenModel from "../../../../DB/models/token.model.js";

export const register = asyncHandler(async (req, res, next) => {
  const { phone, email, name, password, birthDay, country } = req.body;
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
    name,
    phone,
    email,
    password: hashPassword,
    birthDay: new Date(birthDay),
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

// export const login = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;
//   const user = await userModel.findOne({ email });

//   if (!user) {
//     return next(new Error("Invalid-Email", { cause: 400 }));
//   }

//   if (!user.isConfirmed) {
//     return next(new Error("Un activated Account", { cause: 400 }));
//   }

//   const match = bcryptjs.compareSync(password, user.password);

//   if (!match) {
//     return next(new Error("Invalid-Password", { cause: 400 }));
//   }

//   const token = jwt.sign(
//     { id: user._id, email: user.email },
//     process.env.TOKEN_KEY,
//     { expiresIn: "2d" }
//   );

//   await tokenModel.create({
//     token,
//     user: user._id,
//     agent: req.headers["user-agent"],
//   });

//   user.status = "online";
//   await user.save();

//   return res.status(200).json({ success: true, result: token });
// });

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
