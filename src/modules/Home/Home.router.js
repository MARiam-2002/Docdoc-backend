import { Router } from "express";
// import * as Validators from "./auth.validation.js";
// import { isValidation } from "../../middleware/validation.middleware.js";
import * as homeController from "./controller/Home.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";


const router = Router();



router.get("/",isAuthenticated, homeController.home);


export default router;
