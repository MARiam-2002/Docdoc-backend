import { Router } from "express";
// import * as Validators from "./auth.validation.js";
// import { isValidation } from "../../middleware/validation.middleware.js";
import * as specialController from "./controller/speciality.js";
import { fileUpload, filterObject } from "../../utils/multer.js";

const router = Router();

router.post(
  "/",
  fileUpload(filterObject.image).single("image"),
  // isValidation(Validators.createDoctorSpeciality),
  specialController.createDoctorSpeciality
);

router.get("/", specialController.getAllDoctorSpeciality);

export default router;
