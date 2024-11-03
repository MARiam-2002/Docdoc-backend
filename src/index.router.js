import authRouter from "./modules/auth/auth.router.js";
import cityWithGovRouter from "./modules/cityWithGov/cityWithGov.router.js";
import doctorSpecialityRouter from "./modules/Doctor Speciality/speciality.router.js";
import doctorRouter from "./modules/Doctor/Doctor.router.js";
import appointmentRouter from "./modules/appointment/appointment.router.js";
import notificationRouter from "./modules/notification/notification.router.js";
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
  if (process.env.NODE_ENV === "dev") {
    app.use(morgan("common"));
  }

  app.use(cors());
  
  app.use(express.json());

  app.use("/.well-known", express.static(".well-known"));

  app.use(session({ 
    secret: process.env.SESSION_SECRET || "your_secret_key", 
    resave: false, 
    saveUninitialized: false 
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/auth", authRouter);
  app.use("/cityWithGov", cityWithGovRouter);
  app.use("/doctorSpeciality", doctorSpecialityRouter);
  app.use("/doctor", doctorRouter);
  app.use("/Home", homeRouter);
  app.use("/notification", notificationRouter);
  app.use("/appointment", appointmentRouter);

  app.all("*", (req, res, next) => {
    return next(new Error("Not Found", { cause: 404 }));
  });

  app.use(globalErrorHandling);
};