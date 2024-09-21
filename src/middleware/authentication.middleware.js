import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import tokenModel from "../../DB/models/token.model.js";
import userModel from "../../DB/models/user.model.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token = req.headers["token"];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      data: [],
      status: false,
      code: 401,
    });
  }

  const decode = jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid token",
        data: [],
        status: false,
        code: 401,
      });
    }
    return decoded;
  });

  if (!decode) {
    return res.status(401).json({
      message: "Invalid token",
      data: [],
      status: false,
      code: 401,
    });
  }

  const tokenDB = await tokenModel.findOne({ token, isValid: true });

  if (!tokenDB) {
    return res.status(401).json({
      message: "Token expired!",
      data: [],
      status: false,
      code: 401,
    });
  }

  const user = await userModel.findOne({ _id: decode.id });

  if (!user) {
    return res.status(401).json({
      message: "User not found!",
      data: [],
      status: false,
      code: 401,
    });
  }

  req.user = user;
  return next();
});
