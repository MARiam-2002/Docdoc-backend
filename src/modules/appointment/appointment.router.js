import { Router } from "express";
import * as appointmentController from "./controller/appointment.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";

const router = Router();

router.post("/",isAuthenticated, appointmentController.bookAppointment);

router.post("/payments", isAuthenticated,appointmentController.handlePayment);

router.post("/confirm",isAuthenticated, appointmentController.confirmAppointment);
export default router;
