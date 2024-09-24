import { Router } from "express";
import * as cityWithGovController from "./controller/cityWithGov.js";

const router = Router();


router.get("/getAll", cityWithGovController.getAllCityWithGov);
// router.get("/getAllcity", cityWithGovController.getAllcity);

export default router;
