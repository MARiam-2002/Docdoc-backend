import authRouter from "./modules/auth/auth.router.js";
import cityWithGovRouter from "./modules/cityWithGov/cityWithGov.router.js";
import doctorSpecialityRouter from "./modules/Doctor Speciality/speciality.router.js";
import doctorRouter from "./modules/Doctor/Doctor.router.js";
import homeRouter from "./modules/Home/Home.router.js";
import { globalErrorHandling } from "./utils/asyncHandler.js";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import pass from "../config/passport.sttup.js";
import session from "express-session";

export const bootstrap = (app, express) => {
  if (process.env.NODE_ENV == "dev") {
    app.use(morgan("common"));
  }

  // const whiteList = ["http://127.0.0.1:5500",undefined];

  // app.use((req, res, next) => {
  //   if (req.originalUrl.includes("/auth/confirmEmail")) {
  //     res.setHeader("Access-Control-Allow-Origin", "*");
  //     res.setHeader("Access-Control-Allow-Methods", "GET");
  //     return next();
  //   }
  //   if (!whiteList.includes(req.header("origin"))) {
  //     return next(new Error("Blocked By CORS!"));
  //   }
  //   res.setHeader("Access-Control-Allow-Origin", "*");
  //   res.setHeader("Access-Control-Allow-Headers", "*");
  //   res.setHeader("Access-Control-Allow-Methods", "*");
  //   res.setHeader("Access-Control-Allow-Private-Network", true);
  //   return next();
  // });
  // app.use((req, res, next) => {
  //   console.log(req.originalUrl);
  //   if (req.originalUrl == "/order/webhook") {
  //     next();
  //   } else {
  //     express.json()(req, res, next);
  //   }
  // });
  app.use(cors());
  app.use(express.json());
  app.use(
    session({ secret: "secret", resave: true, saveUninitialized: true })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/auth", authRouter);
  app.use("/cityWithGov", cityWithGovRouter);
  app.use("/doctorSpeciality", doctorSpecialityRouter);
  app.use("/doctor", doctorRouter);
  app.use("/Home", homeRouter);


  app.all("*", (req, res, next) => {
    return next(new Error("not found page", { cause: 404 }));
  });

  app.use(globalErrorHandling);
};
