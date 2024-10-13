import { Router } from "express";
// import * as Validators from "./auth.validation.js";
// import { isValidation } from "../../middleware/validation.middleware.js";
import * as doctorController from "./controller/Doctor.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";

const router = Router();

router.post(
  "/",
  fileUpload(filterObject.image).single("imageDoctor"),
  doctorController.create
);
router.get("/recommendation", doctorController.recommendation);

router.get("/", doctorController.getAll);

router.get("/:id", doctorController.getOne);

router.post("/:id/reviews", isAuthenticated, doctorController.addReview);
router.get("/:id/reviews", doctorController.getReviews);

export default router;
